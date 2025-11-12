// Node core modules
import fs from "fs";
import path from "path";

// Import from @discordjs/voice
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  StreamType,
  entersState,
} from "@discordjs/voice";

import { fr } from "./locales/fr.ts";

import { Message, ChatInputCommandInteraction } from "discord.js";

const soundsFolder = "sounds/";
import { spawn } from "child_process";
type CommandType = Message | ChatInputCommandInteraction;

export async function playMusic(context: CommandType, folder: string) {
  // Get member and guild based on context type
  const member =
    context instanceof Message
      ? context.member
      : context.guild?.members.cache.get(context.user.id);
  const guild = context.guild;

  if (
    !member ||
    !member.voice.channel ||
    !member.voice.channelId ||
    !guild?.voiceAdapterCreator
  ) {
    return context.reply(fr.error.notInVoiceChannel);
  }
  const connection = joinVoiceChannel({
    channelId: member.voice.channelId,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    console.log("[VoiceConnection] Ready");
  } catch (error) {
    throw error;
  }
  connection.on(
    VoiceConnectionStatus.Disconnected,
    async (oldState, newState) => {
      console.log("[VoiceConnection] Disconnected, destroying connection.");
      connection.destroy(); // safely destroy connectionthis.connection.on('stateChange', (oldState, newState) => {
    }
  );

  let file = chooseRandomFromFolder(path.join(soundsFolder + folder));
  console.log(file);
  //const resource = createAudioResource(fs.createReadStream(file));
  const ffmpeg = spawn("ffmpeg", [
    "-i",
    file, // input
    "-f",
    "s16le", // raw PCM
    "-ar",
    "48000", // sample rate
    "-ac",
    "2", // stereo
    "pipe:1",
  ]);
  const resource = createAudioResource(ffmpeg.stdout, {
    inputType: StreamType.Raw,
  });

  const player = createAudioPlayer();
  player.play(resource);
  setTimeout(() => {
    connection.subscribe(player), 1000;
  });

  player.on(AudioPlayerStatus.Idle, () => {
    console.log("[AudioPlayer] Idle");
    // destroy/disconnect after finished playing
    setTimeout(() => connection.destroy(), 2000);
  });
  player.on(AudioPlayerStatus.Playing, () => {
    console.log("[AudioPlayer] Playing", resource.started);
  });
  player.on("error", (err) => {
    console.error("[AudioPlayer] Error:", err);
  });
}

export async function disconnect(context: CommandType) {
  if (context.guild) {
    let connection = getVoiceConnection(context.guild.id);
    if (connection) {
      connection.destroy();
    }
  }
}

function chooseRandomFromFolder(folder: string) {
  let files = fs
    .readdirSync(folder, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name);
  let max = files.length - 1;
  let min = 0;

  let index = Math.round(Math.random() * (max - min) + min);
  let file = files[index];
  return path.join(folder, file);
}
