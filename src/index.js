// Load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../tokens.env", import.meta.url).pathname });
const token = process.env["DISCORD_BOT_TOKEN"];
// Import Discord.js
import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  MessageFlags,
  Collection,
  REST,
  Routes,
  ButtonStyle,
} from "discord.js";
import * as db from "./database.ts";
import {
  SelectionContainer,
  perkCreationContainer,
  itemCreationContainer,
  equipmentCreationContainer,
  modifierComponent,
  stringInputModal,
  SelectionTypes,
} from "./menus.ts";
import { selectCache } from "./SelectCache.ts";
import { playerSubmit } from "./commands/createPlayer.ts";
import { perkSubmit } from "./commands/addPerk.ts";
import { itemSubmit } from "./commands/addItem.ts";
import { equipmentSubmit } from "./commands/addEquipment.ts";
import { fr } from "../locales/fr.ts";

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
client.commands = new Collection();
// Load commands
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

const commands = [];
//TODO maybe add rivalries
//TODO calculate skill throws
//TODO add comprehensive way to add ennemies/NPC

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
  const commandMap = {
    [fr.textCommands.roll]: fr.slashCommands.roll,
    [fr.textCommands.info]: fr.slashCommands.info,
    [fr.textCommands.inventory]: fr.slashCommands.inventory,
    [fr.textCommands.new]: fr.slashCommands.new,
    [fr.textCommands.addHP]: fr.slashCommands.addHP,
    [fr.textCommands.removeHP]: fr.slashCommands.removeHP,
    [fr.textCommands.delete]: fr.slashCommands.delete,
    [fr.textCommands.status]: fr.slashCommands.status,
    [fr.textCommands.addPerk]: fr.slashCommands.addPerk,
    [fr.textCommands.addEquipment]: fr.slashCommands.addEquipment,
    [fr.textCommands.addItem]: fr.slashCommands.addItem,
    [fr.textCommands.help]: fr.slashCommands.help,
    [fr.textCommands.quit]: fr.slashCommands.quit,
    [fr.textCommands.play]: fr.slashCommands.play,
  };
  const commandName = commandMap[query];

  if (commandName) {
    const command = client.commands.get(commandName);
    if (command) {
      try {
        await command.executeMessage(msg);
      } catch (error) {
        console.error(`Error executing message command ${query}:`, error);
        await msg.channel.send(fr.error.generic);
      }
    }
  }
});

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
      return fr.success.playerHP(params[0], p.getHp());
    case "db.removePlayer":
      db.removePlayer(params[0]);
      return fr.success.playerDeleted(params[0]);
    case "db.getInfoPlayer":
      var p = db.getInfoPlayer(params[0]);
      return { embeds: [p.toEmbed()] };
    case "db.addProfilePic":
      db.addProfilePic(params[0], params[1]);
      return fr.success.imageAdded;
  }
}

const stringInputText = {
  enterPerkName: [fr.modal.enterPerkName, "perkName"],
  enterItemName: [fr.modal.enterItemName, "itemName"],
  enterEquipmentName: [fr.modal.enterEquipmentName, "equipmentName"],
  enterCondition: [fr.modal.enterCondition, "condition"],
  enterPlayerName: [fr.modal.enterPlayerName, "playerName"],
};

const SubmitData = {
  itemSubmit: [itemSubmit, fr.success.itemAdded],
  perkSubmit: [perkSubmit, fr.success.perkAdded],
  playerSubmit: [playerSubmit, fr.success.characterCreated],
  equipmentSubmit: [equipmentSubmit, fr.success.equipmentAdded],
};

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
    case "enterItemName":
    case "enterEquipmentName":
    case "enterCondition":
    case "enterPlayerName":
      modal = stringInputModal(
        interaction.user.id,
        stringInputText[interactionId][0],
        stringInputText[interactionId][1]
      );
      await interaction.showModal(modal);
      break;
    case "openItemContainer":
      var name = interaction.customId.split("/")[2];
      var container = itemCreationContainer(interaction.user.id, name);
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
      await interaction.message.delete();
      break;
    case "openEquipmentContainer":
      var name = interaction.customId.split("/")[2];
      var container = equipmentCreationContainer(interaction.user.id, name);
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
      await interaction.message.delete();
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
    /** @see itemCreationContainer Submit Item*/
    case "itemSubmit":
    /** @see equipmentCreationContainer Submit equipment*/
    case "equipmentSubmit":
    /**@see perkCreationContainer Submit the perk*/
    case "perkSubmit":
    /**@see playerCreationContainer Submit the Player */
    case "playerSubmit":
      if (SubmitData[interactionId][0](interaction)) {
        interaction.reply(SubmitData[interactionId][1]);
        interaction.message.delete();
      } else {
        interaction.reply(fr.error.missingValues);
      }
      break;
  }
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
    case "playerName":
    case "equipmentName":
    case "itemName":
    case "perkName":
      if (
        (stringName == "perkName" && db.getPerk(value)) ||
        (stringName == "itemName" && db.getItem(value)) ||
        (stringName == "equipmentName" && db.getEquipment(value)) ||
        (stringName == "playerName" && db.getInfoPlayer(value))
      ) {
        //name already used
        container.components[0].accessory.data.label = fr.error.nameAlreadyUsed;
      } else {
        container.components[0].accessory.data.label = value;
        container.components[0].accessory.data.style = ButtonStyle.Secondary;
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
  switch (interaction.customId.split("/")[0]) {
    /** @see stringInputModal */
    case "stringInputModal":
      stringInput(interaction);
      interaction.deferUpdate();
      break;
  }
}

const SelectData = {
  itemSelect: [db.addPlayerItem, fr.success.itemAdded],
  perkSelect: [db.addPlayerPerk, fr.success.perkAdded],
  equipmentSelect: [db.addPlayerEquipment, fr.success.equipmentAdded],
};

async function stringSelectInteraction(interaction) {
  var info = interaction.customId.split("/");
  var customId = info[0].replace(/[0-9]/g, "");
  switch (customId) {
    /**@see selectPlayer */
    case "charSelect":
      var selected = interaction.values[0];
      var info = interaction.customId.split("/");
      if (info[2] == "addPerk") {
        let container = SelectionContainer(
          interaction.user.id,
          selected,
          SelectionTypes.Perk
        );
        await interaction.reply({
          components: [container],
          flags: MessageFlags.IsComponentsV2,
        });
      } else {
        var params = JSON.parse(selectCache.pop(interaction.customId));
        await interaction.reply(
          applyFunction(info[2], [selected].concat(params))
        );
      }
      await interaction.message.delete();
      break;
    /** @see SelectionContainer */
    case "itemSelect":
    case "equipmentSelect":
    case "perkSelect":
      var selected = interaction.values[0];
      if (selected != "undefined") {
        //undefined when no values exist
        var info = interaction.customId.split("/");
        SelectData[customId][0](selected, info[2]);
        await interaction.message.delete();
        await interaction.reply(SelectData[customId][1]);
      } else {
        interaction.deferUpdate();
      }
      break;
    /**
     * @see modifierComponent @see playerCreationContainer @see equipmentCreationContainer @see itemCreationContainer
     * Fill to placeholder and defer update
     */
    case "bodyPartSelect":
    case "hpSelect":
    case "amountSelect":
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
  //Only allow user who requested to complete interaction
  else if (interaction.customId.includes(interaction.user.id)) {
    if (interaction.isButton()) {
      ButtonInteraction(interaction);
    }
    if (interaction.isModalSubmit()) {
      ModalInteraction(interaction);
    }
    if (interaction.isStringSelectMenu()) {
      stringSelectInteraction(interaction);
    }
    if (interaction.isUserSelectMenu()) {
      selectCache.push(interaction.customId, interaction.values[0]); //cache userSelect option in containers
      interaction.deferUpdate();
    }
  }
});

client.login(token);
