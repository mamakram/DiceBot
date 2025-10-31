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
    ) STRICT`);
  database.exec(`CREATE TABLE IF NOT EXISTS modifiers(
      key INTEGER PRIMARY KEY,
      perk_id INTEGER NOT NULL,
      NAME TEXT,
      VALUE TEXT,
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
export function addPlayerPerk(perkName:string,playerName:string){
  let get = database.prepare("SELECT key from perks WHERE name =?")
  let p = get.all(perkName)[0] as {KEY:number}
  let perk = p.KEY
  get = database.prepare("SELECT key from players WHERE name=?")
  p = get.all(playerName)[0] as {KEY:number}
  let player = p.KEY
  let insert = database.prepare(
    "INSERT INTO playerperks (player_id,perk_id) values (?,?)",
  );
  insert.run(perk,player);
}

export function addPerk(perkName:string,condition:string){
    let insert = database.prepare(
    "INSERT INTO perks (name,condition) values (?,?)",
  );
  insert.run(perkName,condition);
}

export function addModifier(perkName:number,stat:string,value:number){
  let get = database.prepare("SELECT key from perks WHERE name =?")
  let p = get.all(perkName)[0] as {KEY:number}
  let perk = p.KEY
  let insert = database.prepare(
    "INSERT INTO modifiers (perk_id,name,value) values (?,?;?)",
  );
  insert.run(perk,stat,value);

}
export function getAllPerks(){
  let get = database.prepare("SELECT NAME from perks ORDER BY name")
  let p = get.all() as {NAME:string;}[]
  return p;
}
