import {
  SlashCommandBuilder,
  Message,
  ChatInputCommandInteraction,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("removehp")
  .setDescription("Remove HP from a player")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user").setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Amount of HP to remove")
      .setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  // TODO: Implement remove HP logic
  await interaction.reply("Remove HP command");
}
export async function executeMessage(command: Message) {}
