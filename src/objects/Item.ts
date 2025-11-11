import { EmbedBuilder } from "@discordjs/builders";

export class Item {
  _name: string;
  _description: string = "";
  constructor(name: string, description: string = "") {
    this._name = name;
    this._description = description;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
}
