// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({path: new URL('../tokens.env', import.meta.url).pathname });
const token = process.env["DISCORD_BOT_TOKEN"];
// Import Discord.js
import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  InteractionType,
  StringSelectMenuBuilder,
  LabelBuilder,
  EmbedBuilder,
  StringSelectMenuOptionBuilder,
  MessageFlags,
  ContainerBuilder,
  ContainerComponent,
  TextDisplayBuilder,
} from "discord.js";
import * as db from "./database.ts";
import { playMusic, disconnect } from "./musicplayer.js";
import { playerCreationContainer, playerCreationModal, statSelectionModal,perkCreationModal, perkSelectionContainer, perkCreationContainer } from './menus.js';

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


//TODO add perks and calculate true skill values 
//TODO add inventory and equipment
//TODO maybe add rivalries
//TODO calculate skill throws
//TODO add slash commands support / major refactor
//TODO add comprehensive way to add ennemies/NPC



client.on("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  db.createDatabase();
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // Ignore messages from bots and self
  const query = msg.content.split(" ")[0];
  switch (query) {
    case "?r":
      diceroll(msg);
      break;
    case "?ajouterPerk":
      addPerk(msg)
      break;
    case "?info":
      getInfo(msg);
      break;
    case "?nouveau":
      createPlayer(msg);
      break;
    case "?ajouterPV":
      addHP(msg);
      break;
    case "?enleverPV":
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

async function test(msg){
  let name = msg.content.substr(msg.content.split(" ")[0].length+1)
  await msg.channel.send({
	components: [playerCreationContainer(msg.author.id,name)],
	flags: MessageFlags.IsComponentsV2,
});
}


/**
 * show a selection for players based on discord id
 * @param {*} msg
 * @param {*} call String name of function that called
 * @param {*} params params of the function
 */
async function selectPlayer(msg,call,params){
  let players = db.getPlayerFromAuthorId(msg.author.id,msg.guild.id)
  let options =[]
  console.log(params)
  for(var p of players){
    options.push(new StringSelectMenuOptionBuilder().setLabel(p).setValue(p))
  }
  let characterSelect = new StringSelectMenuBuilder()
  .setCustomId("charSelect/"+msg.author.id+"/"+call+"/"+params.toString())
  .setPlaceholder("personnage")
  .addOptions(options)
  let row = new ActionRowBuilder().addComponents(characterSelect);
  await msg.channel.send({
    content:"Sélectionnez le personnage",
    components:[row],
  })
  return true
}

/**
 * Launch function after a MemberSelect Action to select the user (see SelectPlayer)
 * @param {*} call String name of function
 * @param {*} params params of the function
 */
function applyFunction(call,params){
  switch(call){
    case "db.modifyHP":
      db.modifyHP(params[0],parseInt(params[1]))
      var p=db.getInfoPlayer(params[0]);
      return params[0]+ " a "+p.getHp()+" PV";
    case "db.removePlayer":
      db.removePlayer(params[0])
      return params[0]+ " a été supprimé !";
    case "db.getInfoPlayer":
      var p = db.getInfoPlayer(params[0])
      return {embeds:[p.toEmbed()]};
    }   
  }

/**return Info for a given player based on discord id
 * If multiple players exist, shows a selection menu to choose
 * **/
async function getInfo(msg) {
  let tmp = msg.content.split(" ")
  if (tmp.length !=2){
    await msg.channel.send("?info @joueur")
    return
  }
  let id = tmp[1].replace("@",'').replace("<","").replace(">","");
  let player = db.getPlayerFromAuthorId(id,msg.guild.id)
  if (player.length==1){
    let p = db.getInfoPlayer(player[0]);
    await msg.channel.send({embeds:[p.toEmbed()]})}
  else if(player.length>1) {
    selectPlayer(id,"db.getInfoPlayer",[])
  }
  else{
    await msg.channel.send("Ce joueur n'existe pas")
  }
}

/**
 * add HP
 * @param {*} msg 
 */
async function addHP(msg){
let tmp = msg.content.split(" ")
if (tmp.length !=3){
    await msg.channel.send("?ajouterHP @joueur quantité")
    return
  }
let amount = parseInt(tmp[2])??0
let id = tmp[1].replace("@",'').replace("<","").replace(">","");
let player = db.getPlayerFromAuthorId(id,msg.guild.id)
if (player.length==1){
  db.modifyHP(player[0],amount);
  await msg.channel.send(player[0]+ " a "+db.getInfoPlayer(player[0]).getHp()+" PV")}
else if(player.length>1) {
  selectPlayer(msg,"db.modifyHP",[amount])
}
else{
  await msg.channel.send("Ce joueur n'existe pas")
}
}

async function removeHP(msg){
let tmp = msg.content.split(" ")
if (tmp.length !=3){
    await msg.channel.send("?enleverHP @joueur quantité")
    return
  }
let amount = parseInt(tmp[2])??0
let id = tmp[1].replace("@",'').replace("<","").replace(">","");
let player = db.getPlayerFromAuthorId(id,msg.guild.id)
if (player.length==1){
  db.modifyHP(player[0],-amount);
  await msg.channel.send(player[0]+ " a "+db.getInfoPlayer(player[0]).getHp()+" PV")}
else if(player.length>1) {
  selectPlayer(msg,"db.modifyHP",[-amount])
}
else{
  await msg.channel.send("Ce joueur n'existe pas")
}
}
/**
 * Delete a player associated to discord id of sender
 * @param {*} msg discord message
 */
async function deletePlayer(msg) {
  let tmp = msg.content.split(" ")
  if (tmp.length !=2){
    await msg.channel.send("?supprimer @joueur")
    return
  }
  let id = msg.content.split(" ")[1].replace("@",'').replace("<","").replace(">","");
  let player = db.getPlayerFromAuthorId(id,msg.guild.id)
  if (player.length==1){
    db.removePlayer(player[0]);
    await msg.channel.send(player[0]+ " a été supprimé !")}
  else if(player.length>1) {
    selectPlayer(msg,"db.removePlayer",[])
  }
  else{
    await msg.channel.send("Ce joueur n'existe pas")
  }
}


/**
 * Send Status of all players
 * @param {*} msg discord message
 */
async function status(msg) {
  let state = db.getStatus(msg.guild.id)
  let embed = new EmbedBuilder().setTitle("Statut")
  for (var s of state){
    embed.addFields({name:s.name,value:s.HP==0?":skull: ":""+s.HP+"/"+s.HP_MAX+ " PV"},)
  }
  await msg.channel.send({embeds:[embed]})
}


async function addPerk(msg) {
  /*let button = new ButtonBuilder()
    .setCustomId("openPerkModal"+'/'+msg.author.id)
    .setLabel("Remplir fiche")
    .setStyle(ButtonStyle.Primary);
  let row = new ActionRowBuilder().addComponents(button);
  await msg.reply({
    content: "Remplissez la fiche de perk:",
    components: [row],
  });*/
  let tmp = msg.content.split(" ")
  if (tmp.length !=2){
    await msg.channel.send("?ajouterPerk @joueur")
    return
  }
  let id = msg.content.split(" ")[1].replace("@",'').replace("<","").replace(">","");
  let player = db.getPlayerFromAuthorId(id,msg.guild.id)
  if (player.length==1){
    let container = perkSelectionContainer(msg.author.id,player[0]);
    await msg.reply({
    components: [container],
    flags: MessageFlags.IsComponentsV2,
    })}
  else if(player.length>1) {
    selectPlayer(msg,"addPerk",[])
  }
  else{
    await msg.channel.send("Ce joueur n'existe pas")
  }

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
        await interaction.showModal(modal);
        break;
      case "openPerkModal":
        modal = perkCreationModal();
        await interaction.showModal(modal);
        break;
      case "openPerkContainer":
        var name = interaction.customId.split("/")[2]
        var container = perkCreationContainer(interaction.user.id,name);
        await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
        })
        break;
      case "perkSubmit":
       //TODO handle submission
       //TODO add String input modal for name and condition
       //TODO add adding modifiers and dynamically update container
        var container = interaction.message.components[0]
        container.components.push(new TextDisplayBuilder()
    .setContent(
			'Bienvenue **'+name+'** !, choisis le joueur associé à ce personnage et ses PV max:',
		),
	)
        //db.addPerk()
        //db.addModifier()
        await interaction.message.edit({components: [container],
        flags: MessageFlags.IsComponentsV2,
        })
        break;
      case "playerSubmit":
        interaction.reply("Personnage créé !")
        console.log(interaction.message.components)
        interaction.message.delete()
      case "openStatModal1":
        var name = interaction.customId.split("/")[2]
        var modalComponents = statSelectionModal(name)
        modal.setCustomId("statInputModal1")
        modal.setTitle("Stats (1/2)")
        for (let i=0;i<4;i++){
          modal.addLabelComponents(new LabelBuilder().setLabel(modalComponents[i].data.placeholder+":").setStringSelectMenuComponent(modalComponents[i]),);
        }
        await interaction.showModal(modal);
        break;
      case "openStatModal2":
        var name = interaction.customId.split("/")[2]
        var modalComponents = statSelectionModal(name)
        modal.setCustomId("statInputModal2")
        modal.setTitle("Stats (2/2)")
        for (let i=4;i<modalComponents.length;i++){
          modal.addLabelComponents(new LabelBuilder().setLabel(modalComponents[i].data.placeholder+":").setStringSelectMenuComponent(modalComponents[i]),);
        }
        await interaction.showModal(modal);
        break;
    }
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
      var maxHP = interaction.fields.getStringSelectValues("hpSelect")[0]
      let authorId = interaction.fields.getSelectedMembers("userSelect").first().user.id
      if (db.addPlayer(name,authorId,interaction.guild.id,maxHP)){
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
        var value = parseInt(f.values[0])
        let info = customId.split("/");
        let name = info[1];
        let stat = info[0];
        db.updateSkills(stat, name, value);
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
        var value = parseInt(f.values[0])
        let info = customId.split("/");
        let name = info[1];
        let stat = info[0];
        db.updateSkills(stat, name, value);
      }
      
      await interaction.reply({embeds:[db.getInfoPlayer(name).toEmbed()]})
      await interaction.message.delete();
      break;
    case "perkInputModal":
      var name = interaction.message.components[0].components[0].customId.split("/")[2]
      for(var [customId,f] of interaction.fields.fields.entries()){
        var value = parseInt(f.values[0])
        let info = customId.split("/");
        let name = info[1];
        let stat = info[0];
        //addPerk(stat, name, value);
      }
      
      await interaction.reply({embeds:[db.getInfoPlayer(name).toEmbed()]})
      await interaction.message.delete();
      break;
  }
}



client.on("interactionCreate", async (interaction) => {
  //Only allow user who requested to press the Button
  if (interaction.isButton() && interaction.customId.includes(interaction.user.id)){
    ButtonInteraction(interaction)
  }
  else if (
    interaction.type === InteractionType.ModalSubmit
  ) {
    ModalInteraction(interaction)
  }else if(interaction.isStringSelectMenu()){
    var selected = interaction.values[0];
    var info = interaction.customId.split("/");
    await interaction.reply(applyFunction(info[2],[selected].concat(JSON.parse("["+info[3]+"]"))))
    await interaction.message.delete()
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
        {name:"?statut",value:"Statut des joueurs", inline:true},
        {name:"?ajouterPV @joueur quantité",value:"", inline:true},
        {name:"?enleverPV @joueur quantité",value:"", inline:true},
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
