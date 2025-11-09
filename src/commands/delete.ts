import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";
// TODO: this
export const data = new SlashCommandBuilder()
  .setName("supprimer")
  .setDescription("Supprime le personnage")
  .addUserOption((option) =>
    option
      .setName("utilisateur")
      .setDescription("L'utilisateur")
      .setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply("Delete command");
}

export async function executeMessage(msg: Message) {}
