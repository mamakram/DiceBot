import { EmbedBuilder } from "discord.js";
import { Perk } from "./perk.ts";
<<<<<<< HEAD
import { DEFAULT_PROFILE_PICTURE } from "./utils.ts";

export class Player {
  _name: string;
  _hp: number = 0;
  _maxHp = 0;
  _stamina: number = 0;
  _skills: Map<string, number>;
  _perks: Array<Perk> = [];
  _profilePicture: string;
  constructor(
    name: string,
    hp: number = 0,
    maxHp: number = 0,
    combat: number = 0,
    survival: number = 0,
    mechanic: number = 0,
    medecine: number = 0,
    discretion: number = 0,
    charisma: number = 0,
    perception: number = 0,
    endurance: number = 0,
    profilePicture = DEFAULT_PROFILE_PICTURE
  ) {
    this._name = name;
    this._hp = hp;
    this._maxHp = maxHp;
    this._skills = new Map<string, number>();
    this._skills.set("COMBAT", combat);
    this._skills.set("SURVIVAL", survival);
    this._skills.set("MECHANIC", mechanic);
    this._skills.set("MEDECINE", medecine);
    this._skills.set("DISCRETION", discretion);
    this._skills.set("CHARISMA", charisma);
    this._skills.set("PERCEPTION", perception);
    this._skills.set("ENDURANCE", endurance);
    this._profilePicture = profilePicture;
  }
  setStamina(stamina: number) {
    this._stamina = stamina;
  }
  setHp(hp: number) {
    this._hp = hp;
  }
  getHp() {
    return this._hp;
  }
  setCombat(combat: number) {
    this._skills.set("COMBAT", combat);
  }
  setSurvival(survival: number) {
    this._skills.set("SURVIVAL", survival);
  }
  setMechanic(mechanic: number) {
    this._skills.set("MECHANIC", mechanic);
  }
  setEndurance(endurance: number) {
    this._skills.set("ENDURANCE", endurance);
  }
  setMedecine(medecine: number) {
    this._skills.set("MEDECINE", medecine);
  }
  setPerception(perception: number) {
    this._skills.set("PERCEPTION", perception);
  }
  setCharisma(charisma: number) {
    this._skills.set("CHARISMA", charisma);
  }
  setDiscretion(discretion: number) {
    this._skills.set("DISCRETION", discretion);
  }
  addPerk(perk: Perk) {
    this._perks.push(perk);
  }

  _trueSkillValues(): Map<string, string> {
    let ret = new Map();
    for (var i of this._skills) {
      ret.set(i[0], i[1].toString());
    }
    for (var perk of this._perks) {
      for (var mod of perk._modifiers) {
        ret.set(
          mod._name,
          ret.get(mod._name) +
            " (" +
            (mod._value > 0 ? "+" : "") +
            mod._value.toString() +
            (perk._condition == "" ? "" : "*") +
            ")"
        );
      }
    }
    return ret;
  }

  toEmbed() {
    let skills = this._trueSkillValues();
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(this._name)
      .setThumbnail(this._profilePicture)
      .addFields(
        {
          name: "HP",
          value:
            this._hp.toString() +
            "/" +
            this._maxHp.toString() +
            (this._hp == 0 ? ":skull: " : ""),
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "Combat",
          value: skills.get("COMBAT")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Survie",
          value: skills.get("SURVIVAL")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Mécanique/Bricolage",
          value: skills.get("MECHANIC")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Médecine",
          value: skills.get("MEDECINE")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Discrétion",
          value: skills.get("DISCRETION")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Charisme",
          value: skills.get("CHARISMA")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Perception",
          value: skills.get("PERCEPTION")?.toString() ?? "0",
          inline: true,
        },
        {
          name: "Endurance",
          value: skills.get("ENDURANCE")?.toString() ?? "0",
          inline: true,
        }
      );
    if (this._perks.length > 0) {
      embed.addFields({ name: "\u200B", value: "\u200B" });
    }
    for (var perk of this._perks) {
      embed.addFields(perk.toEmbed());
    }
    embed.setTimestamp();
    return embed;
  }
=======

export class Player {
  name:string;
  hp:number = 0;
  stamina:number =0;
  skills:Map<string,number>;
  perks:Array<Perk>=[];

  constructor(name:string,hp:number=0,combat:number=0,survival:number=0,mechanic:number=0,medecine:number=0,discretion:number=0,charisma:number=0,perception:number=0,endurance:number=0) {
    this.name = name;
    this.hp = hp;
    this.skills = new Map<string,number>()
    this.skills.set("combat",combat)
    this.skills.set("survival",survival)
    this.skills.set("mechanic",mechanic)
    this.skills.set("medecine",medecine)
    this.skills.set("discretion",discretion)
    this.skills.set("charisma",charisma)
    this.skills.set("perception",perception)
    this.skills.set("endurance",endurance)
  }
  setStamina(stamina:number) {
    this.stamina = stamina;
  }
  setHp(hp:number) {
    this.hp = hp;
  }
  getHp(){
    return this.hp;
  }
  setCombat(combat:number) {
    this.skills.set("combat",combat);
  }
  setSurvival(survival:number) {
    this.skills.set("survival",survival);
  }
  setMechanic(mechanic:number) {
    this.skills.set('mechanic', mechanic);
  }
  setEndurance(endurance:number) {
    this.skills.set("endurance",endurance);
  }
  setMedecine(medecine:number) {
    this.skills.set("medecine", medecine);
  }
  setPerception(perception:number) {
    this.skills.set("perception", perception);
  }
  setCharisma(charisma:number) {
    this.skills.set("charisma", charisma);
  }
  setDiscretion(discretion:number) {
    this.skills.set("discretion",discretion);
  }
  addPerk(perk:Perk) {
    this.perks.push(perk);
  }
  toEmbed(){
    
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(this.name)
      .addFields(
        { name: 'HP', value: this.hp.toString() },
        { name: '\u200B', value: '\u200B' },
        { name: "Combat", value: this.skills.get("combat")?.toString() ?? "0", inline: true },
        { name: "Survie", value: this.skills.get("survival")?.toString() ?? "0", inline: true },
        { name: "Mécanique/Bricolage", value: this.skills.get("mechanic")?.toString() ?? "0", inline: true },
        { name: "Médecine", value: this.skills.get("medecine")?.toString() ?? "0", inline: true },
        { name: "Discrétion", value: this.skills.get("discretion")?.toString() ?? "0", inline: true },
        { name: "Charisme", value: this.skills.get("charisme")?.toString() ?? "0", inline: true },
        { name: "Perception", value: this.skills.get("perception")?.toString() ?? "0", inline: true },
        { name: "Endurance", value: this.skills.get("endurance")?.toString() ?? "0", inline: true },
      )
      .setTimestamp();
      return exampleEmbed
  }
  
>>>>>>> main
}
