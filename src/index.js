// Load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../tokens.env", import.meta.url).pathname });
const token = process.env["DISCORD_BOT_TOKEN"];
// Import Discord.js
import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  Collection,
  REST,
  Routes,
} from "discord.js";
import * as db from "./database.ts";
import {
  playerCreationContainer,
  perkSelectionContainer,
  perkCreationContainer,
  modifierComponent,
  stringInputModal,
} from "./menus.js";
import { SelectCache } from "./SelectCache.ts";
import { STATS } from "./utils.ts";
// Node core modules
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
const selectCache = new SelectCache();
client.commands = new Collection();
// Load commands
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

const commands = [];

//TODO add perks and calculate true skill values
//TODO add inventory and equipment
//TODO maybe add rivalries
//TODO calculate skill throws
//TODO add slash commands support / major refactor
//TODO add comprehensive way to add ennemies/NPC
//TODO add profile pic

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);

  if (
    "data" in command &&
    "executeInteraction" in command &&
    "executeMessage" in command
  ) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    console.log(`Loaded command: ${command.data.name}`);
  } else {
    console.log(
      `[WARNING] Command at ${filePath} is missing "data" or "execute"`
    );
  }
}

// Register slash commands
async function registerCommands() {
  const rest = new REST().setToken(token);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    // For global commands (takes up to 1 hour to update)
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });
    console.log("Successfully registered global commands!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

client.on("clientReady", () => {
  registerCommands();
  db.createDatabase();
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // Ignore messages from bots and self
  const query = msg.content.split(" ")[0];
  // Map message commands to slash commands
  //: Record<string, string> =
  const commandMap = {
    "?r": "roll",
    "?info": "info",
    "?nouveau": "create",
    "?ajouterPV": "addhp",
    "?enleverPV": "removehp",
    "?supprimer": "delete",
    "?statut": "status",
    "?ajouterPerk": "addperk",
    "?help": "help",
    "?leave": "leave",
    "?play": "play",
  };

  const commandName = commandMap[query];

  if (commandName) {
    const command = client.commands.get(commandName);
    if (command) {
      try {
        await command.executeMessage(msg);
      } catch (error) {
        console.error(`Error executing message command ${query}:`, error);
        await msg.channel.send("There was an error executing that command!");
      }
    }
  }
});
/**
 * show a selection for players based on discord id
 * @param {*} msg
 * @param {*} call String name of function that called
 * @param {*} params params of the function
 */
async function selectPlayer(msg, call, params) {
  let players = db.getPlayerFromAuthorId(msg.author.id, msg.guild.id);
  let options = [];
  for (var p of players) {
    options.push(new StringSelectMenuOptionBuilder().setLabel(p).setValue(p));
  }
  let characterSelect = new StringSelectMenuBuilder()
    .setCustomId(
      "charSelect/" + msg.author.id + "/" + call + "/" + params.toString()
    )
    .setPlaceholder("personnage")
    .addOptions(options);
  let row = new ActionRowBuilder().addComponents(characterSelect);
  await msg.channel.send({
    content: "Sélectionnez le personnage",
    components: [row],
  });
  return true;
}

/**
 * Launch function after a MemberSelect Action to select the user (see SelectPlayer)
 * @param {*} call String name of function
 * @param {*} params params of the function
 */
function applyFunction(call, params) {
  switch (call) {
    case "db.modifyHP":
      db.modifyHP(params[0], parseInt(params[1]));
      var p = db.getInfoPlayer(params[0]);
      return params[0] + " a " + p.getHp() + " PV";
    case "db.removePlayer":
      db.removePlayer(params[0]);
      return params[0] + " a été supprimé !";
    case "db.getInfoPlayer":
      var p = db.getInfoPlayer(params[0]);
      return { embeds: [p.toEmbed()] };
  }
}

/**return Info for a given player based on discord id
 * If multiple players exist, shows a selection menu to choose
 * **/
async function getInfo(msg) {
  let tmp = msg.content.split(" ");
  if (tmp.length != 2) {
    await msg.channel.send("?info @joueur");
    return;
  }
  let id = tmp[1].replace("@", "").replace("<", "").replace(">", "");
  let player = db.getPlayerFromAuthorId(id, msg.guild.id);
  if (player.length == 1) {
    let p = db.getInfoPlayer(player[0]);
    await msg.channel.send({ embeds: [p.toEmbed()] });
  } else if (player.length > 1) {
    selectPlayer(msg, "db.getInfoPlayer", []);
  } else {
    await msg.channel.send("Ce joueur n'existe pas");
  }
}

/**
 * add HP
 * @param {*} msg
 */
async function addHP(msg) {
  let tmp = msg.content.split(" ");
  if (tmp.length != 3) {
    await msg.channel.send("?ajouterPV @joueur quantité");
    return;
  }
  let amount = parseInt(tmp[2]) ?? 0;
  let id = tmp[1].replace("@", "").replace("<", "").replace(">", "");
  let player = db.getPlayerFromAuthorId(id, msg.guild.id);
  if (player.length == 1) {
    db.modifyHP(player[0], amount);
    await msg.channel.send(
      player[0] + " a " + db.getInfoPlayer(player[0]).getHp() + " PV"
    );
  } else if (player.length > 1) {
    selectPlayer(msg, "db.modifyHP", [amount]);
  } else {
    await msg.channel.send("Ce joueur n'existe pas");
  }
}

async function removeHP(msg) {
  let tmp = msg.content.split(" ");
  if (tmp.length != 3) {
    await msg.channel.send("?enleverPV @joueur quantité");
    return;
  }
  let amount = parseInt(tmp[2]) ?? 0;
  let id = tmp[1].replace("@", "").replace("<", "").replace(">", "");
  let player = db.getPlayerFromAuthorId(id, msg.guild.id);
  if (player.length == 1) {
    db.modifyHP(player[0], -amount);
    await msg.channel.send(
      player[0] + " a " + db.getInfoPlayer(player[0]).getHp() + " PV"
    );
  } else if (player.length > 1) {
    selectPlayer(msg, "db.modifyHP", [-amount]);
  } else {
    await msg.channel.send("Ce joueur n'existe pas");
  }
}
/**
 * Delete a player associated to discord id of sender
 * @param {*} msg discord message
 */
async function deletePlayer(msg) {
  let tmp = msg.content.split(" ");
  if (tmp.length != 2) {
    await msg.channel.send("?supprimer @joueur");
    return;
  }
  let id = msg.content
    .split(" ")[1]
    .replace("@", "")
    .replace("<", "")
    .replace(">", "");
  let player = db.getPlayerFromAuthorId(id, msg.guild.id);
  if (player.length == 1) {
    db.removePlayer(player[0]);
    await msg.channel.send(player[0] + " a été supprimé !");
  } else if (player.length > 1) {
    selectPlayer(msg, "db.removePlayer", []);
  } else {
    await msg.channel.send("Ce joueur n'existe pas");
  }
}

/**
 * Send Status of all players
 * @param {*} msg discord message
 */
async function status(msg) {
  let state = db.getStatus(msg.guild.id);
  let embed = new EmbedBuilder().setTitle("Statut");
  for (var s of state) {
    embed.addFields({
      name: s.name,
      value: s.HP == 0 ? ":skull: " : "" + s.HP + "/" + s.HP_MAX + " PV",
    });
  }
  await msg.channel.send({ embeds: [embed] });
}

async function addPerk(msg) {
  let tmp = msg.content.split(" ");
  if (tmp.length != 2) {
    await msg.channel.send("?ajouterPerk @joueur");
    return;
  }
  let id = msg.content
    .split(" ")[1]
    .replace("@", "")
    .replace("<", "")
    .replace(">", "");
  let player = db.getPlayerFromAuthorId(id, msg.guild.id);
  if (player.length == 1) {
    let container = perkSelectionContainer(msg.author.id, player[0]);
    await msg.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  } else if (player.length > 1) {
    selectPlayer(msg, "addPerk", []);
  } else {
    await msg.channel.send("Ce joueur n'existe pas");
  }
}
/**
 * create new player
 * @param {*} msg discord message
 */
async function createPlayer(msg) {
  await msg.channel.send({
    components: [playerCreationContainer(msg.author.id)],
    flags: MessageFlags.IsComponentsV2,
  });
}

/**
 * Handler for interaction with buttons, displays corresponding modal
 * or triggers correct action (for example container submit)
 * Information is passed through customId of the interaction component
 * @param {} interaction interaction
 */
async function ButtonInteraction(interaction) {
  let interactionId = interaction.customId.split("/")[0];
  let modal = new ModalBuilder();
  switch (interactionId) {
    case "enterPerkName":
      modal = stringInputModal("Nom de la perk", "perkName");
      await interaction.showModal(modal);
      break;
    case "enterCondition":
      modal = stringInputModal("Condition de la perk", "condition");
      await interaction.showModal(modal);
      break;
    case "enterPlayerName":
      modal = stringInputModal("Nom du joueur", "playerName");
      await interaction.showModal(modal);
      break;
    case "openPerkContainer":
      var name = interaction.customId.split("/")[2];
      var container = perkCreationContainer(interaction.user.id, name);
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
      await interaction.message.delete();
      break;
    /**@see perkCreationContainer add a Modifier Component to Container */
    case "addModifier":
      var container = interaction.message.components[0];
      var num = parseInt(interaction.customId.split("/")[2]);
      var button = container.components.pop(); //validate button
      container.components.pop(); //previous add button
      container.components = container.components.concat(
        modifierComponent(interaction.user.id, (num + 1).toString())
      );
      container.components.push(button);
      await interaction.message.edit({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
      await interaction.deferUpdate();
      break;
    /**@see perkCreationContainer Submit the perk*/
    case "perkSubmit":
      if (perkSubmit(interaction)) {
        await interaction.reply("Perk ajoutée !");
        await interaction.message.delete();
      } else {
        interaction.reply("Il manque des valeurs.");
      }
      break;
    /**@see playerCreationContainer Submit the Player */
    case "playerSubmit":
      if (playerSubmit(interaction)) {
        interaction.reply("Personnage créé !");
        interaction.message.delete();
      } else {
        interaction.reply("Il manque des valeurs.");
      }
      break;
  }
}

/**
 * Create new player based on submission from @see perkCreationContainer
 * @param {*} interaction interaction from validate button
 */
function perkSubmit(interaction) {
  var container = interaction.message.components[0];
  var name = container.components[0].accessory.customId.split("/")[2];
  var perkName = container.components[0].accessory.data.label;
  var numModifiers = Math.min(
    Math.ceil((container.components.length - 4) / 2),
    4
  );
  if (container.components[0].accessory.data.type == "1") {
    //name not entered
    return false;
  }
  for (let i = 0; i < numModifiers; i++) {
    if (
      !selectCache.exists(
        container.components[2 + i * 2].components[0].customId
      ) ||
      !selectCache.exists(
        container.components[3 + i * 2].components[0].customId
      )
    ) {
      return false;
    }
  }
  var condition =
    container.components[1].accessory.data.style == 2
      ? container.components[1].accessory.data.label
      : "";
  db.addPerk(perkName, condition);
  for (let i = 0; i < numModifiers; i++) {
    var stat = selectCache.pop(
      container.components[2 + i * 2].components[0].customId
    );
    var value = selectCache.pop(
      container.components[3 + i * 2].components[0].customId
    );
    db.addModifier(perkName, stat, value);
  }
  db.addPlayerPerk(perkName, name);
  return true;
}

/**
 * Create new player based on submission from @see playerCreationContainer
 * @param {*} interaction interaction from validate button
 */
function playerSubmit(interaction) {
  var container = interaction.message.components[0];
  //user or maxHp or name not entered
  if (
    !selectCache.exists(container.components[1].components[0].customId) ||
    !selectCache.exists(container.components[2].components[0].customId) ||
    container.components[0].accessory.data.type == "1"
  ) {
    return false;
  }
  //stat value not entered
  for (let i = 0; i < STATS.length; i++) {
    if (
      !selectCache.exists(container.components[5 + i].components[0].customId)
    ) {
      return false;
    }
  }
  var playerName = container.components[0].accessory.data.label;
  var authorId = selectCache.pop(
    container.components[1].components[0].customId
  );
  var maxHP = selectCache.pop(container.components[2].components[0].customId);
  db.addPlayer(playerName, authorId, interaction.guild.id, maxHP);
  for (let i = 0; i < STATS.length; i++) {
    var val = selectCache.pop(
      container.components[5 + i].components[0].customId
    );
    var name = container.components[5 + i].components[0].customId.split("/")[1];
    db.updateSkills(name, playerName, val);
  }
  return true;
}

/**
 * Handle String input modals that ask a string input after button press by assigning value to button and disabling it
 * Used in various container @see perkCreationContainer @see playerCreationContainer
 * @param {*} interaction
 */
async function stringInput(interaction) {
  let container = interaction.message.components[0];
  let stringName = interaction.components[0].component.customId;
  let value = interaction.components[0].component.value;
  switch (stringName) {
    /**@see perkCreationContainer */
    case "playerName":
      if (db.getInfoPlayer(value)) {
        //name already used
        container.components[0].accessory.data.label = "Nom déjà utilisé";
      } else {
        container.components[0].accessory.data.label = value;
        container.components[0].accessory.data.style = 2;
        container.components[0].accessory.data.disabled = true;
      }
      break;
    case "perkName":
      if (db.getPerk(value)) {
        //name alre ady used
        container.components[0].accessory.data.label = "Nom déjà utilisé";
      } else {
        container.components[0].accessory.data.label = value;
        container.components[0].accessory.data.style = 2;
        container.components[0].accessory.data.disabled = true;
      }
      break;
    /**@see perkCreationContainer */
    case "condition":
      container.components[1].accessory.data.label = value;
      container.components[1].accessory.data.style = 2;
      container.components[1].accessory.data.disabled = true;
      break;
  }
  await interaction.message.edit({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
  });
}

/**
 * Handler for interaction with Modals, updates values in database
 * Information is passed through customId of the button object
 * @param {*} interaction
 */
async function ModalInteraction(interaction) {
  switch (interaction.customId) {
    /** @see stringInputModal */
    case "stringInputModal":
      stringInput(interaction);
      interaction.deferUpdate();
      break;
  }
}
async function stringSelectInteraction(interaction) {
  var info = interaction.customId.split("/");
  var customId = info[0].replace(/[0-9]/g, "");
  switch (customId) {
    /**@see selectPlayer */
    case "charSelect":
      var selected = interaction.values[0];
      var info = interaction.customId.split("/");
      if (info[2] == "addPerk") {
        let container = perkSelectionContainer(interaction.user.id, selected);
        await interaction.reply({
          components: [container],
          flags: MessageFlags.IsComponentsV2,
        });
      } else {
        await interaction.reply(
          applyFunction(
            info[2],
            [selected].concat(JSON.parse("[" + info[3] + "]"))
          )
        );
      }
      await interaction.message.delete();
      break;
    /** @see perkSelectionContainer */
    case "perkSelect":
      var selected = interaction.values[0];
      if (selected != "undefined") {
        //undefined when no perks exist
        var info = interaction.customId.split("/");
        db.addPlayerPerk(selected, info[2]);
        await interaction.message.delete();
        await interaction.reply("Perk ajoutée !");
      } else {
        interaction.deferUpdate();
      }
      break;
    /**
     * @see modifierComponent and @see playerCreationContainer
     * Fill to placeholder and defer update
     */
    case "hpSelect":
    case "modStatSelect":
    case "modValueSelect":
    case "playerStatSelect":
      selectCache.push(interaction.customId, interaction.values[0]);
    default:
      interaction.deferUpdate();
  }
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.executeInteraction(interaction);
    } catch (error) {
      console.error(error);
    }
  }
  //Only allow user who requested to press the Button
  if (
    interaction.isButton() &&
    interaction.customId.includes(interaction.user.id)
  ) {
    ButtonInteraction(interaction);
  }
  if (interaction.isModalSubmit()) {
    ModalInteraction(interaction);
  }
  if (
    interaction.isStringSelectMenu() &&
    interaction.customId.includes(interaction.user.id)
  ) {
    stringSelectInteraction(interaction);
  }
  if (
    interaction.isUserSelectMenu() &&
    interaction.customId.includes(interaction.user.id)
  ) {
    selectCache.push(interaction.customId, interaction.values[0]);
    interaction.deferUpdate();
  }
});

client.login(token);
