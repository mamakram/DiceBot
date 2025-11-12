import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { playMusic } from "../musicplayer.ts";
import { fr } from "../locales/fr.ts";

const choices = ["sad", "fight", "brook", "smash", "ultra", "ascenseur"];

export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.play)
  .setDescription(fr.commandDescriptions.play)
  .addStringOption(
    new SlashCommandStringOption()
      .setName("track")
      .setDescription(fr.optionDescriptions.track)
      .setRequired(true)
      .addChoices(
        { name: fr.playChoices.sad, value: "sad" },
        { name: fr.playChoices.fight, value: "fight" },
        { name: fr.playChoices.brook, value: "brook" },
        { name: fr.playChoices.smash, value: "smash" },
        { name: fr.playChoices.ultra, value: "ultra" },
        {
          name: fr.playChoices.elevator,
          value: "elevator",
        }
      )
  );

export async function executeInteraction(command: ChatInputCommandInteraction) {
  playMusic(command, command.options.getString("track") ?? "");
  await command.reply(fr.success.commandExecuted);
}

export async function executeMessage(command: Message) {
  if (command.channel.isSendable()) {
    let array = command.content.split(" ");
    if (array.length != 2 || !choices.includes(array[1])) {
      await command.channel.send(fr.error.badChoice);
    } else {
      playMusic(command, array[1]);
    }
  }
}
