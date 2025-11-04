import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
} from "discord.js";
// TODO: this
export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Fiche d'un personnage")
  .addUserOption((option) =>
    option
      .setName("utilisateur")
      .setDescription("L'utilisateur")
      .setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply("Remove HP command");
}
export async function executeMessage(command: Message) {}
