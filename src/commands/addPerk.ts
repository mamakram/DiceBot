import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
} from "discord.js";

//TODO this
export const data = new SlashCommandBuilder()
  .setName("ajouterperk")
  .setDescription("Add a perk to a player")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user").setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  await interaction.reply("Add perk command");
}

export async function executeMessage(command: Message) {}
