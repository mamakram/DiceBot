// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({path:"tokens.env"});
const token = process.env["DISCORD_BOT_TOKEN"];
console.log(token)

// Import Discord.js
import {
  Client,
  GatewayIntentBits,
  Message,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  MessageFlags,
  StringSelectMenuBuilder,
  ComponentType,
  UserSelectMenuComponent,
  LabelBuilder,
  GuildMember,
  User,
  Collection,
  ModalSubmitFields,
  EmbedBuilder
} from "discord.js";
import {
  createDatabase,
  updateSkills,
  addPlayer,
  getInfoPlayer,
  removePlayer,
  getStatus,
  getPlayerFromAuthorId,
} from "./database.js";
import { playMusic, disconnect } from "./musicplayer.js";
import { playerCreationModal, statSelectionModal } from './menus.js';

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



client.on("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  createDatabase();
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // Ignore messages from bots and self
  const query = msg.content.split(" ")[0];
  switch (query) {
    case "?r":
      diceroll(msg);
      break;
    case "?info":
      getInfo(msg);
      break;
    case "?nouveau":
      createPlayer(msg);
      break;
    case "?ajouterHP":
      addHP(msg);
      break;
    case "?enleverHP":
      removeHP(msg);
      break;
    case "?supprimer":
      deletePlayer(msg);
      break;
    case "?statut":
      status(msg)
      break;
    case "?sad":
      playMusic(msg, "sad");
      break;
    case "?fight":
      playMusic(msg, "fight");
      break;
    case "?brook":
      playMusic(msg, "brook");
      break;
    case "?smash":
      playMusic(msg, "smash");
      break;
    case "?ultra":
      playMusic(msg, "ultrainstinct");
      break;
    case "?filler":
      playMusic(msg, "elevator");
      break;
    case "?help":
      help(msg);
    case "?leave":
      disconnect(msg);
      break;
  }
});


/**return Info for a given player based on discord id
 * If multiple players exist, shows a selection menu to choose
 * **/
async function getInfo(msg) {
  const name = msg.content.substring(msg.content.split(" ")[0].length+1);
  let player = getInfoPlayer(name);
  if (player){
  await msg.channel.send({embeds:[player.toEmbed()]})}
  else{
    await msg.channel.send("Ce joueur n'existe pas")
  }
}

/**
 * show a selection for players based on discord id
 * 
 */
function selectPlayer(){
  return
}


/**
 * add HP
 * @param {*} msg 
 */
async function addHP(msg){
let amount = parseInt(cmd.content.split(" ")[-1])
console.log(msg.author.id)
console.log(getPlayerFromAuthorId(msg.author.id))
}

async function removeHP(msg){
let amount = parseInt(cmd.content.split(" ")[-1])
console.log(msg.author.id)
console.log(getPlayerFromAuthorId(msg.author.id))
}


/**
 * Send Status of all players
 * @param {*} msg discord message
 */
async function status(msg) {
  await msg.channel.send(getStatus())
}

/**
 * create new player
 * @param {*} msg discord message
 */
async function createPlayer(msg) {
  let button = new ButtonBuilder()
    .setCustomId("openPlayerModal"+'/'+msg.author.id)
    .setLabel("Remplir fiche")
    .setStyle(ButtonStyle.Primary);
  let row = new ActionRowBuilder().addComponents(button);
  await msg.reply({
    content: "Remplissez la fiche de personnage:",
    components: [row],
  });
}

/**
 * Delete a player associated to discord id of sender
 * @param {*} msg discord message
 */
async function deletePlayer(msg) {
  const name = msg.content.substring(msg.content.split(" ")[0].length+1);
  removePlayer(name);
  await msg.channel.send(name+ " a été supprimé !");
}


/**
 * Handler for interaction with buttons, displays corresponding modal
 * Information is passed through customId of the interaction object
 * @param {} interaction interaction
 */
async function ButtonInteraction(interaction){
    let interactionId = interaction.customId.split("/")[0]
    let modal = new ModalBuilder();
    switch(interactionId){ //handle 3 cases
      case "openPlayerModal":
        modal = playerCreationModal();
        break;
      case "openStatModal1":
        var name = interaction.customId.split("/")[2]
        var modalComponents = statSelectionModal(name)
        modal.setCustomId("statInputModal1")
        modal.setTitle("Stats (1/2)")
        for (let i=0;i<4;i++){
          modal.addLabelComponents(new LabelBuilder().setLabel(i.toString()+":").setStringSelectMenuComponent(modalComponents[i]),);
        }
        break;
      case "openStatModal2":
        var name = interaction.customId.split("/")[2]
        var modalComponents = statSelectionModal(name)
        modal.setCustomId("statInputModal2")
        modal.setTitle("Stats (2/2)")
        for (let i=4;i<modalComponents.length;i++){
          modal.addLabelComponents(new LabelBuilder().setLabel(i.toString()+":").setStringSelectMenuComponent(modalComponents[i]),);
        }
        break;
    }
    await interaction.showModal(modal);
    return;
}

/**
 * Handler for interaction with Modals, updates values in database
 * Information is passed through customId of the button object
 * @param {*} interaction 
 */
async function ModalInteraction(interaction) {
  switch(interaction.customId){
    case "createPlayerModal":
      var name = interaction.fields.getTextInputValue("nameInput");
      const authorId = interaction.fields.getSelectedMembers("userSelect").first().user.id
      if (addPlayer(name,authorId)){
      var button = new ButtonBuilder()
      .setCustomId("openStatModal1"+"/"+interaction.user.id+"/"+name)
      .setLabel("choisir Stats (1/2)")
      .setStyle(ButtonStyle.Primary);
      var row = new ActionRowBuilder().addComponents(button);
      await interaction.reply({
      content: "Choisissez vos Stats:",
      components: [row],
    });
      await interaction.message.delete()
    }else{
      await interaction.reply({content: `Ce nom est déjà utilisé`,
      });
    }
    break;
    case "statInputModal1":
      var name = interaction.message.components[0].components[0].customId.split("/")[2]
      for(var [customId,f] of interaction.fields.fields.entries()){
        var value = f.id
        let info = customId.split("/");
        let name = info[1];
        let stat = info[0];
        updateSkills(stat, name, Number(value));
      }
      
      var button = new ButtonBuilder()
      .setCustomId("openStatModal2"+"/"+interaction.user.id+"/"+name)
      .setLabel("choisir Stats (2/2)")
      .setStyle(ButtonStyle.Primary);
      var row = new ActionRowBuilder().addComponents(button);
      await interaction.message.edit({
      content: "Choisissez vos Stats:",
      components: [row],});
      await interaction.deferUpdate();
      break;
    case "statInputModal2":
      var name = interaction.message.components[0].components[0].customId.split("/")[2]
      for(var [customId,f] of interaction.fields.fields.entries()){
        console.log(customId)
        var value = f.id
        let info = customId.split("/");
        let name = info[1];
        let stat = info[0];
        updateSkills(stat, name, Number(value));
      }
      
      await interaction.reply({embeds:[getInfoPlayer(name).toEmbed()]})
      await interaction.message.delete();
      break;
  }
}



client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton() && interaction.customId.includes(interaction.user.id)){
    ButtonInteraction(interaction)
  }
  else if (
    interaction.type === InteractionType.ModalSubmit
  ) {
    ModalInteraction(interaction)
  }
});

/**
 * Display help message
 * @param {*} msg 
 */
function help(msg) {
  let embed = new EmbedBuilder().setColor(0x0099ff)
      .setTitle("Dicebot")
      .setDescription("Bot de lancer de dés et fonctionnalités JDR")
      .addFields(
        { name: "Lancer de dés", value: "" },
        {name:"?r _d_",value: "jette un dé. Exemple: ?r 2d6"},
        { name: '\u200B', value: '\u200B' },
      )
      .addFields(
        { name: "Sons", value: "" },
        {name:"?sad",value:"",inline:true},
        {name:"?fight",value:"",inline:true},
        {name:"?brook",value:"", inline:true},
        {name:"?smash",value:"", inline:true},
        {name:"?ultra",value:"", inline:true},
        {name:"?filler",value:"", inline:true},
        {name:"?leave",value:"déconnecte le bot du channel vocal", inline:true},
        { name: '\u200B', value: '\u200B' },)
      .addFields(
        { name: "Fiches", value: "" },
        {name:"?nouveau",value:"Créer un nouveau personnage", inline:true},
        {name:"?supprimer @joueur",value:"Supprime le personnage", inline:true},
        {name:"?info @joueur",value:"Donne les infos du personnage", inline:true},
        {name:"?ajouterHP quantité",value:"", inline:true},
        {name:"?enleverHP quantité",value:"", inline:true},
      )
  msg.channel.send(
    {embeds:[embed]}
  );
}

/**
 * Diceroll function, based on msg parameters roll dice and send message
 * @param {*} msg 
 */
async function diceroll(msg) {
  let array = msg.content.split(" ");
  if (array.length != 2) {
    msg.channel.send(`Error. Wrong Syntax`);
  } else {
    let content = array[1];
    let array2 = content.split("d");
    if (array2.length != 2) {
      msg.channel.send(`Error. Wrong Syntax`);
    } else {
      let amount = parseInt(array2[0]);
      let cap = parseInt(array2[1]);
      let sum = 0;
      let critic_success = Math.floor((cap / 100) * 10);
      let critic_fail = Math.floor((cap / 100) * 90 + 1);
      let output =
        `<@${msg.author.id}> :game_die:` +
        "```ansi\n" +
        "\u001b[0;37mResult : ";
      let counter = amount;
      while (counter > 0) {
        if (output.length > 900) {
          output += "..```";
          console.log(output);
          try {
            await msg.channel.send(output);
          } catch (exception) {}
          output = "```ansi\n" + "\u001b[0;37m ..";
        }
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
      output += "```";
      try {
        await msg.delete();
        await msg.channel.send(output);
      } catch (exception) {
        await msg.channel.send("Error :slight_frown:");
      }
    }
  }
}

client.login(token);
