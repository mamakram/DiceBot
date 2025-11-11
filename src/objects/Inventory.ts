import { EmbedBuilder } from "discord.js";
import { Equipment } from "./Equipment.ts";
import { Item } from "./Item.ts";

export class Inventory {
  _owner: string;
  _equipment: Equipment[];
  _items: Array<[Item, number]>;

  constructor(
    owner: string,
    equipment: Equipment[] = [],
    items: Array<[Item, number]> = []
  ) {
    this._owner = owner;
    this._equipment = equipment;
    this._items = items;
  }
  addItem(item: Item, amount: number = 1) {
    this._items.push([item, amount]);
  }
  addEquipment(equipment: Equipment) {
    this._equipment.push(equipment);
  }
  toEmbed(): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Inventaire de " + this._owner);

    if (this._equipment.length > 0) {
      embed.addFields({ name: "Equipement:", value: "" });
    }
    for (var equipment of this._equipment) {
      embed.addFields(equipment.toEmbed());
    }
    embed.addFields({ name: "\u200B", value: "" });
    if (this._items.length > 0) {
      embed.addFields({ name: "Items:", value: "" });
    }
    for (var item of this._items) {
      embed.addFields({ name: item[0].name, value: "Quantité: x" + item[1] });
    }
    embed.setTimestamp();
    return embed;
  }
}
