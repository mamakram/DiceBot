import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder,
  SlashCommandStringOption,
  TextChannel,
} from "discord.js";

const start = "```ansi\n" + "\u001b[0;37m ";
const end = " ```";
const MAX_MESSAGE_LENGTH = 850;

/**
 * Diceroll command, based on msg parameters roll dice and send message
 * @param {*} msg
 */

export const data = new SlashCommandBuilder()
  .setName("roll")
  .setDescription("Lancer de dés")
  .addStringOption(
    new SlashCommandStringOption()
      .setName("dice")
      .setDescription("Dé a lancer (e.g., 2d6)")
      .setRequired(true)
  );

export async function executeInteraction(command: ChatInputCommandInteraction) {
  let content = command.options.getString("dice");
  let result = diceRoll(content ?? "");
  let output = `<@${command.user.id}> :game_die:`;
  for (let i = 0; i < result.length; i += MAX_MESSAGE_LENGTH) {
    output += start + result.slice(i, i + MAX_MESSAGE_LENGTH) + end;
    if (i == 0) {
      await command.reply(output);
    } else {
      await command.followUp(output);
    }
    output = "";
  }
}

export async function executeMessage(command: Message) {
  if (!(command.channel instanceof TextChannel)) {
    return;
  }
  let array = command.content.split(" ");
  if (array.length != 2) {
    await command.channel.send("Erreur : mauvaise syntaxe");
    return;
  }
  let content = array[1];
  console.log(content);
  let result = diceRoll(content);
  let output = `<@${command.author.id}> :game_die:`;
  for (let i = 0; i < result.length; i += MAX_MESSAGE_LENGTH) {
    output += start + result.slice(i, i + MAX_MESSAGE_LENGTH) + end;
    if (i == 0) {
      await command.channel.send(output);
    } else {
      await command.channel.send(output);
    }
    output = "";
  }
}

function diceRoll(command: string): string {
  let array2 = command.split("d");
  if (array2.length != 2) {
    return "Erreur : mauvaise syntaxe";
  } else {
    let amount = parseInt(array2[0]);
    let cap = parseInt(array2[1]);
    let sum = 0;
    let critic_success = Math.floor((cap / 100) * 10);
    let critic_fail = Math.floor((cap / 100) * 90 + 1);
    let output = "Result : ";
    let counter = amount;
    while (counter > 0) {
      let die = Math.floor(Math.random() * cap) + 1;
      if (die <= critic_success) {
        output += "\u001b[1;32m" + die + "\u001b[0;37m";
      } else if (die >= critic_fail) {
        output += "\u001b[1;31m" + die + "\u001b[0;37m";
      } else {
        output += die;
      }
      if (counter > 1) {
        output += ", ";
      }
      sum += die;
      counter -= 1;
    }
    output += " (" + amount + "d" + cap + ")";
    if (amount > 1) {
      output += "\nSum: " + sum;
    }
    return output;
  }
}
