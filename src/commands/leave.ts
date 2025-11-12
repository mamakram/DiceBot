import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Message,
} from "discord.js";
import { disconnect } from "../musicplayer.ts";
import { fr } from "../locales/fr.ts";

export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.quit)
  .setDescription(fr.commandDescriptions.leave);

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  disconnect(interaction);
  await interaction.reply(fr.success.disconnected);
}

export async function executeMessage(msg: Message) {
  disconnect(msg);
}
