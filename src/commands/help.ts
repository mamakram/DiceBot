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
  .setDescription("Message d'aide");

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
    .setDescription(
      "Bot de lancer de dés et fonctionnalités JDR, commandes en ? ou en /"
    )
    .addFields(
      { name: "Lancer de dés", value: "" },
      { name: "?r _d_", value: "jette un dé. Exemple: ?r 2d6" },
      { name: "\u200B", value: "" }
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
      { name: "\u200B", value: "" }
    )
    .addFields(
      {
        name: "Fiches",
        value:
          "Les commandes ouvrent un menu de sélection si un joueur a plusieurs personnages",
      },
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
        name: "?ajouterperk @joueur",
        value: "Ajouter une nouvelle perk au joueur",
        inline: true,
      },
      {
        name: "?ajouterequipement @joueur",
        value: "Ajouter un équipement au joueur",
        inline: true,
      },
      {
        name: "?ajouteritem @joueur",
        value: "Ajouter un item au joueur",
        inline: true,
      },
      {
        name: "/ajouterphoto @joueur lien",
        value: "Ajouter une photo à un personnage",
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
