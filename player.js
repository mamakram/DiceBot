import {STATS} from "./utils.js"
import { EmbedBuilder } from "discord.js";

export class Player {
  name;
  hp = 0;
  combat;
survival;
mechanic;
medecine;
discretion;
charisma;
perception;
endurance;
  skills = [];

  constructor(name,hp=0,combat=0,survival=0,mechanic=0,medecine=0,discretion=0,charisma=0,perception=0,endurance=0) {
    this.name = name;
    this.hp = hp;
    this.combat=combat;
    this.survival=survival;
    this.mechanic=mechanic;
    this.medecine=medecine;
    this.discretion=discretion;
    this.charisma=charisma;
    this.perception=perception;
    this.endurance=endurance;
  }
  setStamina(stamina) {
    this.stamina = stamina;
  }
  setHp(hp) {
    this.hp = hp;
  }
  getHp(){
    return this.hp;
  }
  setCombat(combat) {
    this.combat = combat;
  }
   setSurvival(survival) {
    this.survival = survival;
  }
   setMechanic(mechanic) {
    this.mechanic = mechanic;
  }
  setEndurance(endurance) {
    this.endurance = endurance;
  }
  setMedecine(medecine) {
    this.medecine = medecine;
  }
  setPerception(perception) {
    this.perception = perception;
  }
  setCharisma(charisma) {
    this.charisma = charisma;
  }
  setDiscretion(discretion) {
    this.discretion = discretion;
  }
  addSkill(name, description) {
    this.skills.push({ name: name, description: description });
  }
  toString() {
    let str = "```"+`**Nom: ${this.name}**\n HP: ${this.hp}\n Combat: ${this.combat}\t Perception: ${this.perception}\n Médecine: ${this.medecine}\t Endurance: ${this.endurance}\n Charisme: ${this.charisma}\t Survie: ${this.survival}\n Mécanique/Bricolage: ${this.mechanic}\t Discrétion: ${this.discretion}`+"```";
    return str;
  }
  toEmbed(){
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(this.name)
      .addFields(
        { name: 'HP', value: this.hp.toString() },
        { name: '\u200B', value: '\u200B' },
        { name: 'Combat', value: this.combat.toString(), inline: true },
        { name: 'Perception', value: this.perception.toString(), inline: true },
        { name: 'Médecine', value: this.medecine.toString(), inline: true },
        { name: 'Endurance', value: this.endurance.toString(), inline: true },
        { name: 'Charisme', value: this.charisma.toString(), inline: true },
        { name: 'Survie', value: this.survival.toString(), inline: true },
        { name: 'Mécanique/Bricolage', value: this.mechanic.toString(), inline: true },
        { name: 'Discrétion', value: this.discretion.toString(), inline: true },
      )
      .setTimestamp();
      return exampleEmbed
  }
  
}
