import { Modifier } from "./modifier.ts";
import { STATS_NICENAME } from "./utils.ts";
export class Perk {
  _name: string;
  _condition: string;
  _modifiers: Array<Modifier>;

  constructor(
    name: string,
    condition: string = "",
    modifiers: Array<Modifier> = []
  ) {
    this._name = name;
    this._condition = condition;
    this._modifiers = modifiers;
  }

  get name(): string {
    return this._name;
  }
  get condition(): string {
    return this._condition;
  }
  get modifiers(): Array<Modifier> {
    return this._modifiers;
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
    val += this._condition;
    ret.push({
      name: this._name + (this._condition == "" ? "" : "*"),
      value: val,
      inline: false,
    });
    return ret;
  }
}
