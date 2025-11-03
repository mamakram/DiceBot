import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { playMusic } from "../musicplayer.ts";
const choices = ["sad", "fight", "brook", "smash", "ultra", "ascenseur"];

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Jouer un son")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("track")
      .setDescription("Music track to play")
      .setRequired(true)
      .addChoices(
        { name: "Sad", value: "sad" },
        { name: "Fight", value: "fight" },
        { name: "Brook", value: "brook" },
        { name: "Smash", value: "smash" },
        { name: "Ultra", value: "ultrainstinct" },
        { name: "Ascenseur", value: "elevator" }
      )
  );

export async function executeInteraction(command: ChatInputCommandInteraction) {
  playMusic(command, command.options.getString("track") ?? "");
  await command.reply("Commande exécutée");
}

export async function executeMessage(command: Message) {
  if (command.channel.isSendable()) {
    let array = command.content.split(" ");
    if (array.length != 2 || !choices.includes(array[1])) {
      await command.channel.send("Mauvais choix");
    } else {
      playMusic(command, array[1]);
    }
  }
}
