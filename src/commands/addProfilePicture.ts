import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";
import { fr } from "../locales/fr.ts";

export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.addProfilePicture)
  .setDescription(fr.commandDescriptions.addProfilePicture)
  .addStringOption((option) =>
    option
      .setName("image")
      .setDescription(fr.optionDescriptions.image)
      .setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  var member = interaction.user;
  var image = interaction.options.getString("image");
  if (member && image) {
    var player = db.getPlayerFromAuthorId(
      member.id,
      interaction.guild?.id ?? ""
    );
    if (player.length == 1) {
      db.addProfilePic(player[0], image);
      await interaction.reply(fr.success.imageAdded);
    } else if (player.length > 1) {
      selectPlayer(interaction, "db.addProfilePic", [image]);
    } else {
      await interaction.reply(fr.error.playerDoesNotExist);
    }
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    await msg.channel.send(fr.error.useSlashCommand);
  }
}
