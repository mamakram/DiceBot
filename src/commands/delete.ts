import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("delete")
  .setDescription("Delete a player character")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user").setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  // TODO: Implement delete logic
  await interaction.reply("Delete command");
}

export async function executeMessage(command: Message) {}
