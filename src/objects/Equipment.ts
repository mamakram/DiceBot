import { Modifier } from "./Modifier.ts";
import { STATS_NICENAME } from "../utils.ts";
export const BodyParts = {
  Whole: 0,
  Head: 1,
  Torso: 2,
  Legs: 3,
  Hands: 4,
  Feet: 5,
} as const;

export const BodyPartNames = [
  "Corps entier",
  "Tête",
  "Torse",
  "Jambes",
  "Mains",
  "Pieds",
];

type BodyPart = (typeof BodyParts)[keyof typeof BodyParts];

export class Equipment {
  _name: string;
  _bodypart: BodyPart;
  _description: string = "";
  _modifiers: Modifier[];
  constructor(
    name: string,
    bodypart: BodyPart,
    description: string = "",
    modifiers: Array<Modifier> = []
  ) {
    this._name = name;
    this._bodypart = bodypart;
    this._description = description;
    this._modifiers = modifiers;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }

  get bodypart() {
    return this._bodypart;
  }
  addModifier(name: string, value: number) {
    this._modifiers.push(new Modifier(name, value));
  }

  toEmbed() {
    let ret = [];
    let val = "";
    for (var mod of this._modifiers) {
      let value = mod._value.toString();
      if (mod._value > 0) {
        value = "+" + value;
      }
      val += value + " " + STATS_NICENAME.get(mod._name) + "   ";
    }
    ret.push({
      name:
        "- " +
        BodyPartNames[this._bodypart] +
        " :  " +
        this._name +
        " " +
        this._description,
      value: val,
      inline: false,
    });
    return ret;
  }
}
