// SQLite (sync)
import { DatabaseSync } from "node:sqlite";
import { Player } from "./objects/Player.ts";
import { Perk } from "./objects/Perk.ts";
const database = new DatabaseSync(
  new URL("../data.db", import.meta.url).pathname
);

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
        DESCRIPTION TEXT
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS items(
      key INTEGER PRIMARY KEY,
      NAME TEXT,
      DESCRIPTION TEXT,
      AMOUNT INTEGER
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS perks(
      key INTEGER PRIMARY KEY,
      NAME TEXT UNIQUE, 
      CONDITION TEXT
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS modifiers(
      key INTEGER PRIMARY KEY,
      perk_id INTEGER NOT NULL,
      NAME TEXT,
      VALUE TEXT,
      FOREIGN KEY(perk_id) REFERENCES perks(key)
    ) STRICT`);

  //relational tables
  database.exec(`CREATE TABLE IF NOT EXISTS playerperks(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,
      perk_id INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key),
      FOREIGN KEY(perk_id) REFERENCES perks(key)
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS playerequipment(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,  
      equipment_id INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key),
      FOREIGN KEY(equipment_id) REFERENCES equipment(key)
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS playeritems(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,
      item_id INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key),
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
          "SELECT name,value FROM modifiers WHERE perk_id=?"
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
 * Add a new modifier associated to perk
 * @param perkName
 * @param stat modified stat
 * @param value modifier
 */
export function addModifier(perkName: string, stat: string, value: number) {
  let get = database.prepare("SELECT key from perks WHERE name =?");
  let p = get.all(perkName)[0] as { key: number };
  let perk = p.key;
  let insert = database.prepare(
    "INSERT INTO modifiers (perk_id,name,value) values (?,?,?)"
  );
  insert.run(perk, stat, value);
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
