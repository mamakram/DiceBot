import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Message,
} from "discord.js";
import { disconnect } from "../musicplayer.ts";

export const data = new SlashCommandBuilder()
  .setName("quitter")
  .setDescription("Quitte le channel vocal");

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  disconnect(interaction);
  await interaction.reply("Déconnecté du vocal");
}

export async function executeMessage(msg: Message) {
  disconnect(msg);
}
