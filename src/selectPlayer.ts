import {
  Message,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import * as db from "./database.ts";
import { selectCache } from "./SelectCache.ts";
/**
 * show a selection for players based on discord id
 * @param {*} interaction
 * @param {*} command String name of command that is called
 * @param {*} params params of the function
 */
export async function selectPlayer(
  interaction: Message | ChatInputCommandInteraction,
  command: string,
  params: string[]
) {
  let authorId =
    interaction instanceof Message
      ? interaction.author.id
      : interaction.user.id;
  let players = db.getPlayerFromAuthorId(authorId, interaction.guild?.id ?? "");
  let options = [];
  for (var p of players) {
    options.push(new StringSelectMenuOptionBuilder().setLabel(p).setValue(p));
  }
  var customId = "charSelect/" + authorId + "/" + command;
  let characterSelect = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder("personnage")
    .addOptions(options);
  selectCache.push(customId, JSON.stringify(params));
  let row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    characterSelect
  );
  if (interaction instanceof Message) {
    if (interaction.channel.isSendable()) {
      await interaction.channel.send({
        content: "Sélectionnez le personnage",
        components: [row],
      });
    }
  } else {
    await interaction.reply({
      content: "Sélectionnez le personnage",
      components: [row],
    });
  }

  return true;
}
