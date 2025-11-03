import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("addperk")
  .setDescription("Add a perk to a player")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user").setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  // TODO: Implement add perk logic
  await interaction.reply("Add perk command");
}

export async function executeMessage(command: Message) {}
