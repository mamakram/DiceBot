import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";

/**
 * Display help message as Discord Embed
 * @param {*} msg
 */
export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Help message");

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply({ embeds: [helpEmbed()] });
}

export async function executeMessage(command: Message) {
  if (command.channel.isSendable()) {
    command.channel.send({ embeds: [helpEmbed()] });
  }
}

function helpEmbed() {
  let embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Dicebot")
    .setDescription("Bot de lancer de dés et fonctionnalités JDR")
    .addFields(
      { name: "Lancer de dés", value: "" },
      { name: "?r _d_", value: "jette un dé. Exemple: ?r 2d6" },
      { name: "\u200B", value: "\u200B" }
    )
    .addFields(
      { name: "Sons", value: "" },
      {
        name: "?play",
        value: "fight/brook/smash/ultra/filler",
        inline: true,
      },
      {
        name: "?quitter",
        value: "déconnecte le bot du channel vocal",
        inline: true,
      },
      { name: "\u200B", value: "\u200B" }
    )
    .addFields(
      { name: "Fiches", value: "" },
      {
        name: "?nouveau",
        value: "Créer un nouveau personnage",
        inline: true,
      },
      {
        name: "?supprimer @joueur",
        value: "Supprime le personnage",
        inline: true,
      },
      {
        name: "?info @joueur",
        value: "Donne les infos du personnage",
        inline: true,
      },
      { name: "?statut", value: "Statut des joueurs", inline: true },
      { name: "?ajouterPV @joueur quantité", value: "", inline: true },
      { name: "?enleverPV @joueur quantité", value: "", inline: true }
    );
  return embed;
}
