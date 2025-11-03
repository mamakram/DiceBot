import { SlashCommandBuilder } from "discord.js";
import { disconnect } from "../musicplayer.ts";

export const data = new SlashCommandBuilder()
  .setName("quitter")
  .setDescription("Quitte le channel vocal");

export async function execute(interaction: any) {
  disconnect(interaction);
  await interaction.reply("Commande exécutée");
}
