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

const soundsFolder = "sounds/";
import { spawn } from "child_process";

export async function playMusic(msg, folder) {
  if (!msg.member.voice.channel) {
    return msg.reply("Faut etre dans un channel vocal pour ça !");
  }
  const connection = joinVoiceChannel({
    channelId: msg.member.voice.channelId,
    guildId: msg.guild.id,
    adapterCreator: msg.guild.voiceAdapterCreator,
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
    },
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

export async function disconnect(msg) {
  const connection = getVoiceConnection(msg.guild.id);
  if (connection) {
    connection.destroy();
  }
}

function chooseRandomFromFolder(folder) {
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
