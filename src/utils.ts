import {
  StringSelectMenuOptionBuilder,
  Message,
  ChatInputCommandInteraction,
} from "discord.js";
import { BodyParts, BodyPartNames } from "./objects/Equipment.ts";

export const DEFAULT_PROFILE_PICTURE =
  "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png?20240121032759";
export const MAX_STAT = 10;
export const STATS = [
  {
    niceName: "Combat",
    name: "COMBAT",
  },
  {
    niceName: "Survie",
    name: "SURVIVAL",
  },
  {
    niceName: "Mécanique/Bricolage",
    name: "MECHANIC",
  },
  {
    niceName: "Médecine",
    name: "MEDECINE",
  },
  {
    niceName: "Discrétion",
    name: "DISCRETION",
  },
  {
    niceName: "Charisme",
    name: "CHARISMA",
  },
  {
    niceName: "Perception",
    name: "PERCEPTION",
  },
  {
    niceName: "Endurance",
    name: "ENDURANCE",
  },
];

export const STATS_NICENAME = new Map([
  ["COMBAT", "Combat"],
  ["SURVIVAL", "Survie"],
  ["MECHANIC", "Mécanique/Bricolage"],
  ["MEDECINE", "Médecine"],
  ["DISCRETION", "Discrétion"],
  ["CHARISMA", "Charisme"],
  ["PERCEPTION", "Perception"],
  ["ENDURANCE", "Endurance"],
]);
export function numberOptions(
  max_value: number,
  start_value: number = 1,
  showPlus: boolean = false
) {
  let options = [];
  for (let i = start_value; i <= max_value; i++) {
    if (i != 0) {
      options.push(
        new StringSelectMenuOptionBuilder()
          .setLabel((showPlus && i > 0 ? "+" : "") + i.toString())
          .setValue(i.toString())
      );
    }
  }
  return options;
}

export function statOptions(): StringSelectMenuOptionBuilder[] {
  let options = [];
  for (var stat of STATS) {
    options.push(
      new StringSelectMenuOptionBuilder()
        .setLabel(stat.niceName)
        .setValue(stat.name)
    );
  }
  return options;
}

export function bodyPartOptions(): StringSelectMenuOptionBuilder[] {
  let options = [];
  for (var part in Object.values(BodyParts)) {
    options.push(
      new StringSelectMenuOptionBuilder()
        .setLabel(BodyPartNames[parseInt(part)])
        .setValue(part)
    );
  }
  return options;
}
