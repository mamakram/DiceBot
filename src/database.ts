// SQLite (sync)
import { DatabaseSync } from "node:sqlite";
import { Player } from "./objects/Player.ts";
import { Perk } from "./objects/Perk.ts";
import { BodyParts, Equipment } from "./objects/Equipment.ts";
import { Item } from "./objects/Item.ts";
import { Inventory } from "./objects/Inventory.ts";
const database = new DatabaseSync(
  new URL("../data.db", import.meta.url).pathname
);

type BodyPart = (typeof BodyParts)[keyof typeof BodyParts];

export function createDatabase() {
  database.exec(`
      CREATE TABLE IF NOT EXISTS players(
        key INTEGER PRIMARY KEY,
        NAME TEXT UNIQUE,
        AUTHORID TEXT,
        GUILD TEXT,
        HP INTEGER DEFAULT 0,
        HP_MAX INTEGER DEFAULT 0,
        PROFILE_PIC TEXT,
        STAMINA INTEGER DEFAULT 0,
        COMBAT INTEGER,
        SURVIVAL INTEGER,
        MECHANIC INTEGER,
        MEDECINE INTEGER,
        DISCRETION INTEGER,
        CHARISMA INTEGER,
        PERCEPTION INTEGER,
        ENDURANCE INTEGER
      ) STRICT
    `);
  database.exec(`
      CREATE TABLE IF NOT EXISTS equipment(
        key INTEGER PRIMARY KEY,
        NAME TEXT,
        DESCRIPTION TEXT,
        BODYPART INTEGER
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS items(
      key INTEGER PRIMARY KEY,
      NAME TEXT
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS perks(
      key INTEGER PRIMARY KEY,
      NAME TEXT UNIQUE, 
      CONDITION TEXT
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS perkmodifiers(
      key INTEGER PRIMARY KEY,
      perk_id INTEGER NOT NULL,
      NAME TEXT,
      VALUE INTEGER,
      FOREIGN KEY(perk_id) REFERENCES perks(key)
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS equipmentmodifiers(
      key INTEGER PRIMARY KEY,
      equipment_id INTEGER NOT NULL,
      NAME TEXT,
      VALUE INTEGER,
      FOREIGN KEY(equipment_id) REFERENCES equipment(key)
    ) STRICT`);

  //relational tables
  database.exec(`CREATE TABLE IF NOT EXISTS playerperks(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,
      perk_id INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key) ON DELETE CASCADE,
      FOREIGN KEY(perk_id) REFERENCES perks(key)
      
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS playerequipment(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,  
      equipment_id INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key) ON DELETE CASCADE,
      FOREIGN KEY(equipment_id) REFERENCES equipment(key)
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS playeritems(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,
      item_id INTEGER,
      AMOUNT INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key) ON DELETE CASCADE,
      FOREIGN KEY(item_id) REFERENCES items(key)
      ) STRICT`);
}

/**
 * Add new player to table
 * @param name
 * @param id
 * @param guild
 * @param maxHP
 * @returns
 */
export function addPlayer(
  name: string,
  id: string,
  guild: string,
  maxHP: number
) {
  if (getInfoPlayer(name) != undefined) {
    return false;
  }
  let insert = database.prepare(
    "INSERT INTO players (NAME,AUTHORID,GUILD,HP_MAX,HP,STAMINA) VALUES (?,?,?,?,?,0)"
  );
  insert.run(name, id, guild, maxHP, maxHP);
  return true;
}

/**
 * Delete player in table
 * @param name
 */
export function removePlayer(name: string) {
  let del = database.prepare("DELETE FROM players WHERE NAME = ?");
  del.run(name);
}

/**
 * Update skill in table to given value
 * @param stat
 * @param name
 * @param value
 */
export function updateSkills(stat: string, name: string, value: number) {
  let update = database.prepare(
    "UPDATE players SET " + stat + " = ? WHERE NAME = ?"
  );
  update.run(value, name);
}

/**
 * Modify player hp by amount
 * @param player
 * @param amount
 * @returns
 */
export function modifyHP(player: string, amount: number) {
  let get = database.prepare("SELECT HP,HP_MAX FROM players WHERE NAME = ?");
  let p = get.all(player)[0] as { HP: number; HP_MAX: number } | undefined;
  if (p) {
    let hp = p.HP;
    let hp_max = p.HP_MAX;
    if (typeof amount == "number" && Number.isInteger(amount)) {
      hp = Math.max(hp + amount, 0);
      if (hp > hp_max) {
        hp = hp_max;
      }
      let update = database.prepare("UPDATE players SET HP = ? WHERE NAME = ?");
      update.run(hp, player);
      return true;
    }
  }
  return false;
}

/**
 * Fetch player info based on character name
 * @param name
 * @returns Player object
 */
export function getInfoPlayer(name: string) {
  let get = database.prepare("SELECT * FROM players WHERE NAME = ?");
  let p = get.all(name)[0] as
    | {
        key: number;
        NAME: string;
        HP: number;
        HP_MAX: number;
        PROFILE_PIC: string;
        COMBAT: number;
        SURVIVAL: number;
        MECHANIC: number;
        MEDECINE: number;
        DISCRETION: number;
        CHARISMA: number;
        PERCEPTION: number;
        ENDURANCE: number;
      }
    | undefined;
  if (p) {
    let player = new Player(
      p.NAME,
      p.HP,
      p.HP_MAX,
      p.PROFILE_PIC,
      p.COMBAT,
      p.SURVIVAL,
      p.MECHANIC,
      p.MEDECINE,
      p.DISCRETION,
      p.CHARISMA,
      p.PERCEPTION,
      p.ENDURANCE
    );
    var player_id = p.key;
    get = database.prepare(
      "SELECT p.key,p.name,p.condition FROM perks AS p INNER JOIN playerperks AS pp ON pp.perk_id = p.key WHERE pp.player_id = ?"
    );
    var p1 = get.all(player_id) as {
      key: number;
      NAME: string;
      CONDITION: string;
    }[];
    if (p1) {
      for (var val of p1) {
        let perk = new Perk(val.NAME, val.CONDITION);
        get = database.prepare(
          "SELECT name,value FROM perkmodifiers WHERE perk_id=?"
        );
        var p2 = get.all(val.key) as { NAME: string; VALUE: number }[];
        for (var mod of p2) {
          perk.addModifier(mod.NAME, mod.VALUE);
        }
        player.addPerk(perk);
      }
      return player;
    }
  }
  return undefined;
}

/**
 * Get all player names associated to a discord id
 * @param id
 * @param guild
 * @returns
 */
export function getPlayerFromAuthorId(id: string, guild: string): string[] {
  let get = database.prepare(
    "SELECT name FROM players WHERE AUTHORID = ? AND GUILD=?"
  );
  let ret = [];
  let p = get.all(id, guild) as { NAME: string }[];
  for (var obj of p) {
    ret.push(obj.NAME);
  }
  return ret;
}

/**
 * Get status of all player (ie HP) in specific guild
 * @param guild
 * @returns
 */
export function getStatus(guild: string) {
  let get = database.prepare(
    "SELECT name,HP,HP_MAX FROM players WHERE GUILD=?"
  );
  let p = get.all(guild) as { NAME: string; HP: number; HP_MAX: number }[];
  let ret = [];
  for (var player of p) {
    ret.push({ name: player.NAME, HP: player.HP, HP_MAX: player.HP_MAX });
  }
  return ret;
}

/**
 * Associate existing perk to existing player in relational table
 * @param perkName
 * @param playerName
 * @returns
 */
export function addPlayerPerk(perkName: string, playerName: string) {
  //check that it's not already added
  let get = database.prepare(
    "SELECT p.name FROM perks AS p INNER JOIN playerperks AS pp ON pp.perk_id = p.key INNER JOIN players as pl ON pp.player_id = pl.key WHERE pl.NAME = ?"
  );
  let p = get.all(playerName).map((row) => row.NAME);
  if (p.includes(perkName)) {
    return;
  }
  get = database.prepare("SELECT key from perks WHERE name =?");
  let p1 = get.all(perkName)[0] as { key: number };
  let perk = p1.key;
  get = database.prepare("SELECT key from players WHERE name=?");
  p1 = get.all(playerName)[0] as { key: number };
  let player = p1.key;
  let insert = database.prepare(
    "INSERT INTO playerperks (player_id,perk_id) values (?,?)"
  );
  insert.run(player, perk);
}

/**
 * Associate existing item to existing player in relational table
 * @param itemName
 * @param playerName
 * @returns
 */
export function addPlayerItem(
  itemName: string,
  playerName: string,
  amount: number = 1
) {
  //TODO if item relation already in database increment amount
  //check that it's not already added
  let get = database.prepare(
    "SELECT i.name FROM items AS i INNER JOIN playeritems AS pi ON pi.item_id = i.key INNER JOIN players as pl ON pi.player_id = pl.key WHERE pl.NAME = ?"
  );
  let p = get.all(playerName).map((row) => row.NAME);
  if (p.includes(itemName)) {
    return;
  }
  get = database.prepare("SELECT key from items WHERE name =?");
  let p1 = get.all(itemName)[0] as { key: number };
  let item = p1.key;
  get = database.prepare("SELECT key from players WHERE name=?");
  p1 = get.all(playerName)[0] as { key: number };
  let player = p1.key;
  let insert = database.prepare(
    "INSERT INTO playeritems (player_id,item_id,amount) values (?,?,?)"
  );
  insert.run(player, item, amount);
}

/**
 * Associate existing equipment to existing player in relational table
 * @param equipmentName
 * @param playerName
 * @returns
 */
export function addPlayerEquipment(equipmentName: string, playerName: string) {
  //check that it's not already added
  let get = database.prepare(
    "SELECT e.name FROM equipment AS e INNER JOIN playerequipment AS pe ON pe.equipment_id = e.key INNER JOIN players as pl ON pe.player_id = pl.key WHERE pl.NAME = ?"
  );
  let p = get.all(playerName).map((row) => row.NAME);
  if (p.includes(equipmentName)) {
    return;
  }
  get = database.prepare("SELECT key from equipment WHERE name =?");
  let p1 = get.all(equipmentName)[0] as { key: number };
  let equipment = p1.key;
  get = database.prepare("SELECT key from players WHERE name=?");
  p1 = get.all(playerName)[0] as { key: number };
  let player = p1.key;
  let insert = database.prepare(
    "INSERT INTO playerequipment (player_id,equipment_id) values (?,?)"
  );
  insert.run(player, equipment);
}

/**
 * Retrieves player items and equipment
 * @param playerName
 */
export function getInventory(playerName: string): Inventory | undefined {
  let get = database.prepare("SELECT key FROM players WHERE NAME = ?");
  let p = get.all(playerName)[0] as
    | {
        key: number;
      }
    | undefined;
  if (p) {
    var player_id = p.key;
    get = database.prepare(
      "SELECT e.key,e.name,e.description,e.bodypart FROM equipment AS e INNER JOIN playerequipment AS pe ON pe.equipment_id = e.key WHERE pe.player_id = ?"
    );
    var p1 = get.all(player_id) as {
      key: number;
      NAME: string;
      DESCRIPTION: string;
      BODYPART: BodyPart;
    }[];
    var inventory = new Inventory(playerName);
    for (var e of p1) {
      let equipment = new Equipment(e.NAME, e.BODYPART, e.DESCRIPTION);
      get = database.prepare(
        "SELECT name,value FROM equipmentmodifiers WHERE equipment_id=?"
      );
      var p2 = get.all(e.key) as { NAME: string; VALUE: number }[];
      for (var mod of p2) {
        equipment.addModifier(mod.NAME, mod.VALUE);
      }
      inventory.addEquipment(equipment);
    }
    get = database.prepare(
      "SELECT i.name,pi.amount FROM items AS i INNER JOIN playeritems AS pi ON pi.item_id = i.key WHERE pi.player_id = ?"
    );
    var p3 = get.all(player_id) as {
      NAME: string;
      AMOUNT: number;
    }[];
    for (var i of p3) {
      let item = new Item(i.NAME);
      inventory.addItem(item, i.AMOUNT);
    }
    return inventory;
  }
  return undefined;
}

/**
 * Get Perk from perk name
 * @param perkName
 * @returns Perk object or undefined
 */
export function getPerk(perkName: string): Perk | undefined {
  let get = database.prepare("SELECT name,condition from perks WHERE name =?");
  let p = get.all(perkName)[0] as { NAME: string; CONDITION: string };
  if (p) {
    return new Perk(p.NAME, p.CONDITION);
  }
  return undefined;
}
/**
 * Get Equipment from equipment name
 * @param equipmentName
 * @returns Equipment object or undefined
 */
export function getEquipment(perkName: string): Equipment | undefined {
  let get = database.prepare(
    "SELECT name,description,bodypart from equipment WHERE name =?"
  );
  let p = get.all(perkName)[0] as {
    NAME: string;
    DESCRIPTION: string;
    BODYPART: BodyPart;
  };
  if (p) {
    return new Equipment(p.NAME, p.BODYPART, p.DESCRIPTION);
  }
  return undefined;
}
/**
 * Get Item from item name
 * @param itemName
 * @returns Item object or undefined
 */
export function getItem(itemName: string): Item | undefined {
  let get = database.prepare("SELECT name from items WHERE name =?");
  let p = get.all(itemName)[0] as { NAME: string };
  if (p) {
    return new Item(p.NAME);
  }
  return undefined;
}

/**
 * Add new perk
 * @param perkName
 * @param condition
 */
export function addPerk(perkName: string, condition: string) {
  let insert = database.prepare(
    "INSERT INTO perks (name,condition) values (?,?)"
  );
  insert.run(perkName, condition);
}
/**
 * Add new item
 * @param itemName
 */
export function addItem(itemName: string) {
  let insert = database.prepare("INSERT INTO items (name) values (?)");
  insert.run(itemName);
}
/**
 * Add new equipment
 * @param equipmentName
 * @param condition
 */
export function addEquipment(
  equipmentName: string,
  description: string,
  bodypart: BodyPart
) {
  let insert = database.prepare(
    "INSERT INTO equipment (name,description,bodypart) values (?,?,?)"
  );
  insert.run(equipmentName, description, bodypart);
}

/**
 * Add a new modifier associated to perk
 * @param perkName
 * @param stat modified stat
 * @param value modifier
 */
export function addPerkModifier(perkName: string, stat: string, value: number) {
  let get = database.prepare("SELECT key from perks WHERE name =?");
  let p = get.all(perkName)[0] as { key: number };
  let perk = p.key;
  let insert = database.prepare(
    "INSERT INTO perkmodifiers (perk_id,NAME,VALUE) values (?,?,?)"
  );
  insert.run(perk, stat, value);
}

/**
 * Add a new modifier associated to equipment
 * @param equipmentName
 * @param stat modified stat
 * @param value modifier
 */
export function addEquipmentModifier(
  equipmentName: string,
  stat: string,
  value: number
) {
  let get = database.prepare("SELECT key from equipment WHERE name =?");
  let p = get.all(equipmentName)[0] as { key: number };
  let equipment = p.key;
  let insert = database.prepare(
    "INSERT INTO equipmentmodifiers (equipment_id,NAME,VALUE) values (?,?,?)"
  );
  insert.run(equipment, stat, value);
}

/**
 * Add profile picture to user entry
 * @param playerName
 * @param image
 */
export function addProfilePic(playerName: string, image: string) {
  let update = database.prepare(
    "UPDATE players SET PROFILE_PIC = ? WHERE NAME = ?"
  );
  update.run(image, playerName);
}

/**
 * get all Perk names from db
 * @returns perk names as list
 */
export function getAllPerkNames() {
  let get = database.prepare("SELECT NAME from perks ORDER BY name");
  let p = get.all() as { NAME: string }[];
  return p;
}

/**
 * get all equipment names from db
 * @returns equipment names as list
 */
export function getAllEquipmentNames() {
  let get = database.prepare("SELECT NAME from equipment ORDER BY name");
  let p = get.all() as { NAME: string }[];
  return p;
}
/**
 * get all Item names from db
 * @returns item names as list
 */
export function getAllItemNames() {
  let get = database.prepare("SELECT NAME from items ORDER BY name");
  let p = get.all() as { NAME: string }[];
  return p;
}
