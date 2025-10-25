import { EmbedBuilder } from "discord.js";
import { Perk } from "./perk.ts";

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
  
}
