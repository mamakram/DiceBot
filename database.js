// SQLite (sync)
import { DatabaseSync } from "node:sqlite";
import { Player } from "./player.js";
const database = new DatabaseSync("data.db");

export function createDatabase() {
  database.exec(`
      CREATE TABLE IF NOT EXISTS players(
        key INTEGER PRIMARY KEY,
        NAME TEXT UNIQUE,
        AUTHORID TEXT,
        HP INTEGER DEFAULT 0,
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
      player_id INTEGER,
      PERKNAME TEXT,
      DESCRIPTION TEXT,
      FOREIGN KEY(player_id) REFERENCES players(key)
    ) STRICT`);
}

export function addPlayer(name,id) {
  if (getInfoPlayer(name) !=undefined){
    return false
  }
  let insert = database.prepare(
    "INSERT INTO players (NAME,AUTHORID,HP,STAMINA) VALUES (?,?,0,0)",
  );
  insert.run(name,id);
  return true
}

export function removePlayer(name){
  let del = database.prepare("DELETE FROM players WHERE NAME = ?",
  );
  del.run(name);
}


export function updateSkills(stat, name, value) {
  let update = database.prepare(
    "UPDATE players SET " + stat + " = ? WHERE NAME = ?",
  );
  update.run(value, name);
}

export function modifyHP(player,amount){
  console.log(player)
  let get = database.prepare("SELECT HP FROM players WHERE NAME = ?");
  let p = get.all(player)[0];
  if (p){
      let hp = parseInt(p.HP)
      if (typeof(amount)==Number && Number.isInteger(amount) && hp+amount>=0){
          hp = hp+amount
          let update = database.prepare(
          "UPDATE players SET HP = ? WHERE NAME = ?",);
          update.run(hp, player);
          return true
      }
  }
  return false
}

export function getInfoPlayer(name) {
  console.log(name)
  let get = database.prepare("SELECT * FROM players WHERE NAME = ?");
  let p = get.all(name)[0];
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

export function getPlayerFromAuthorId(id) {
  let get = database.prepare("SELECT name FROM players WHERE AUTHORID = ?");
  let p = get.all(id);
  let ret = [];
  for (obj in p){
    ret.push(p.name)
  }
  return ret
}

export function getStatus() {
  let get = database.prepare("SELECT name,HP FROM players");
  let p=get.all()
  let ret = "```"
  for (let i =0;i<p.length;i++){
    ret += p[i].NAME+" : "+p[i].HP+" PV\n"
  }
  ret = ret+"```"
  return ret;
}
