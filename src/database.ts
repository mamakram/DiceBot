// SQLite (sync)
import { DatabaseSync } from "node:sqlite";
import { Player } from "./player.ts";
<<<<<<< HEAD
import { Perk } from "./perk.ts";
const database = new DatabaseSync(
  new URL("../data.db", import.meta.url).pathname
);
=======
const database = new DatabaseSync(new URL('../data.db', import.meta.url).pathname);
>>>>>>> main

export function createDatabase() {
  database.exec(`
      CREATE TABLE IF NOT EXISTS players(
        key INTEGER PRIMARY KEY,
        NAME TEXT UNIQUE,
        AUTHORID TEXT,
        GUILD TEXT,
        HP INTEGER DEFAULT 0,
        HP_MAX INTEGER DEFAULT 0,
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
      CREATE TABLE IF NOT EXISTS skills(
        key INTEGER PRIMARY KEY,
        player_id INTEGER,
        SKILLNAME TEXT,
        LEVEL INTEGER,
        FOREIGN KEY(player_id) REFERENCES players(key)
      ) STRICT
    `);
  database.exec(`
      CREATE TABLE IF NOT EXISTS equipment(
        key INTEGER PRIMARY KEY,
<<<<<<< HEAD
        NAME TEXT,
        DESCRIPTION TEXT
      ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS items(
      key INTEGER PRIMARY KEY,
      NAME TEXT,
      DESCRIPTION TEXT,
      AMOUNT INTEGER
    ) STRICT`);
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
  database.exec(`CREATE TABLE IF NOT EXISTS perks(
      key INTEGER PRIMARY KEY,
      NAME TEXT UNIQUE, 
      CONDITION TEXT
=======
        player_id INTEGER,
        EQUIPMENTNAME TEXT,
        DESCRIPTION TEXT,
        FOREIGN KEY(player_id) REFERENCES players(key)
      ) STRICT
    `);
  database.exec(`CREATE TABLE IF NOT EXISTS items(
      key INTEGER PRIMARY KEY,
      player_id INTEGER,
      ITEMNAME TEXT,
      DESCRIPTION TEXT,
      AMOUNT INTEGER,
      FOREIGN KEY(player_id) REFERENCES players(key)
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS perks(
      key INTEGER PRIMARY KEY,
      player_id INTEGER NOT NULL,
      PERKNAME TEXT,
      DESCRIPTION TEXT,
      FOREIGN KEY(player_id) REFERENCES players(key)
>>>>>>> main
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS modifiers(
      key INTEGER PRIMARY KEY,
      perk_id INTEGER NOT NULL,
      NAME TEXT,
      VALUE TEXT,
<<<<<<< HEAD
      FOREIGN KEY(perk_id) REFERENCES perks(key)
    ) STRICT`);
}

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

export function removePlayer(name: string) {
  let del = database.prepare("DELETE FROM players WHERE NAME = ?");
  del.run(name);
}

export function updateSkills(stat: string, name: string, value: number) {
  let update = database.prepare(
    "UPDATE players SET " + stat + " = ? WHERE NAME = ?"
=======
      CONDITIONAL BOOLEAN,
      FOREIGN KEY(perk_id) REFERENCES perks(key)
    ) STRICT`)
}

export function addPlayer(name:string,id:string,guild:string,maxHP:number) {
  if (getInfoPlayer(name) !=undefined){
    return false
  }
  let insert = database.prepare(
    "INSERT INTO players (NAME,AUTHORID,GUILD,HP_MAX,HP,STAMINA) VALUES (?,?,?,?,?,0)",
  );
  insert.run(name,id,guild,maxHP,maxHP);
  return true
}

export function removePlayer(name:string){
  let del = database.prepare("DELETE FROM players WHERE NAME = ?",
  );
  del.run(name);
}


export function updateSkills(stat:string, name:string, value:number) {
  let update = database.prepare(
    "UPDATE players SET " + stat + " = ? WHERE NAME = ?",
>>>>>>> main
  );
  update.run(value, name);
}

<<<<<<< HEAD
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

export function getInfoPlayer(name: string) {
  //TODO add perk and modifier fetch
  let get = database.prepare("SELECT * FROM players WHERE NAME = ?");
  let p = get.all(name)[0] as
    | {
        key: number;
        NAME: string;
        HP: number;
        HP_MAX: number;
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
=======
export function modifyHP(player:string,amount:number){
  let get = database.prepare("SELECT HP,HP_MAX FROM players WHERE NAME = ?");
  let p = get.all(player)[0] as { HP: number; HP_MAX: number } | undefined;
  if (p){
      let hp = p.HP
      let hp_max = p.HP_MAX
      if (typeof(amount)=="number" && Number.isInteger(amount) && hp+amount>=0){
          hp += amount
          if (hp>hp_max){
            hp=hp_max
          }
          let update = database.prepare(
          "UPDATE players SET HP = ? WHERE NAME = ?",);
          update.run(hp, player);
          return true
      }
  }
  return false
}

export function getInfoPlayer(name:string) {
  let get = database.prepare("SELECT * FROM players WHERE NAME = ?");
  let p = get.all(name)[0] as {NAME:string,HP:number;COMBAT:number;SURVIVAL:number;MECHANIC:number;MEDECINE:number;DISCRETION:number;CHARISMA:number;PERCEPTION:number;ENDURANCE:number}|undefined;
  if (p){
  return new Player(
    p.NAME,
    p.HP,
>>>>>>> main
      p.COMBAT,
      p.SURVIVAL,
      p.MECHANIC,
      p.MEDECINE,
      p.DISCRETION,
      p.CHARISMA,
      p.PERCEPTION,
<<<<<<< HEAD
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

export function getPerk(perkName: string): Perk | undefined {
  let get = database.prepare("SELECT name,condition from perks WHERE name =?");
  let p = get.all(perkName)[0] as { NAME: string; CONDITION: string };
  if (p) {
    return new Perk(p.NAME, p.CONDITION);
  }
  return undefined;
}

export function addPerk(perkName: string, condition: string) {
  let insert = database.prepare(
    "INSERT INTO perks (name,condition) values (?,?)"
  );
  insert.run(perkName, condition);
}

export function addModifier(perkName: string, stat: string, value: number) {
  let get = database.prepare("SELECT key from perks WHERE name =?");
  let p = get.all(perkName)[0] as { key: number };
  let perk = p.key;
  let insert = database.prepare(
    "INSERT INTO modifiers (perk_id,name,value) values (?,?,?)"
  );
  insert.run(perk, stat, value);
}
export function getAllPerks() {
  let get = database.prepare("SELECT NAME from perks ORDER BY name");
  let p = get.all() as { NAME: string }[];
  return p;
}
=======
      p.ENDURANCE,
  );
}else {return undefined}
}

export function getPlayerFromAuthorId(id:string,guild:string) {
  let get = database.prepare("SELECT name FROM players WHERE AUTHORID = ? AND GUILD=?");
  let ret = [];
  let p = get.all(id,guild) as {NAME:string;}[];
  for (var obj of p){
    ret.push(obj.NAME)
  }
  return ret
}

export function getStatus(guild:string) {
  let get = database.prepare("SELECT name,HP,HP_MAX FROM players WHERE GUILD=?");
  let p=get.all(guild) as {NAME:string;HP:number;HP_MAX:number;}[]
  let ret = []
  for (var player of p){
    ret.push({"name":player.NAME,"HP":player.HP,"HP_MAX":player.HP_MAX})
  }
  return ret;
}
>>>>>>> main
