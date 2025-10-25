// SQLite (sync)
import { DatabaseSync } from "node:sqlite";
import { Player } from "./player.ts";
const database = new DatabaseSync(new URL('../data.db', import.meta.url).pathname);

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
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS modifiers(
      key INTEGER PRIMARY KEY,
      perk_id INTEGER NOT NULL,
      NAME TEXT,
      VALUE TEXT,
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
  );
  update.run(value, name);
}

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
      p.COMBAT,
      p.SURVIVAL,
      p.MECHANIC,
      p.MEDECINE,
      p.DISCRETION,
      p.CHARISMA,
      p.PERCEPTION,
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
