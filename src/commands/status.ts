import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Show status of all players");

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  // TODO: Implement status logic
  await interaction.reply("Status command");
}

export async function executeMessage(command: Message) {}
