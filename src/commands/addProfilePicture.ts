import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
import * as db from "../database.ts";
import { selectPlayer } from "../selectPlayer.ts";

export const data = new SlashCommandBuilder()
  .setName("ajouterphoto")
  .setDescription("Ajouter une photo de profil à un joueur")
  .addStringOption((option) =>
    option
      .setName("image")
      .setDescription("Lien vers l'image")
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
      await interaction.reply("Image ajoutée");
    } else if (player.length > 1) {
      selectPlayer(interaction, "db.addProfilePic", [image]);
    } else {
      await interaction.reply("Ce joueur n'existe pas");
    }
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    await msg.channel.send("Utilisez cette commande en /");
  }
}
