import {
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContainerComponent,
  Message,
  SectionComponent,
  SlashCommandBuilder,
  MessageFlags,
  GuildMember,
  ActionRow,
} from "discord.js";
import * as db from "../database.ts";
import {
  itemCreationContainer,
  SelectionContainer,
  SelectionTypes,
} from "../menus.ts";
import { selectCache } from "../SelectCache.ts";
import { selectPlayer } from "../selectPlayer.ts";

export const data = new SlashCommandBuilder()
  .setName("ajouteritem")
  .setDescription("Ajouter un item à un joueur")
  .addUserOption((option) =>
    option.setName("user").setDescription("L'utilisateur").setRequired(true)
  );

export async function executeInteraction(
  interaction: ChatInputCommandInteraction
) {
  var member = interaction.options.getMember("user") as GuildMember;
  if (member) {
    var player = db.getPlayerFromAuthorId(
      member.id,
      interaction.guild?.id ?? ""
    );
    if (player.length == 1) {
      let container = SelectionContainer(
        member.id,
        player[0],
        SelectionTypes.Item
      );
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
    } else if (player.length > 1) {
      selectPlayer(interaction, "addItem", []);
    } else {
      await interaction.reply("Ce joueur n'existe pas");
    }
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    var tmp = msg.content.split(" ");
    if (tmp.length != 2) {
      await msg.channel.send("?ajouterItem @joueur");
      return;
    }
    var id = msg.content.split(" ")[1].replace(/[@<>]/g, "");
    var player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      let container = SelectionContainer(
        msg.author.id,
        player[0],
        SelectionTypes.Item
      );
      await msg.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
    } else if (player.length > 1) {
      selectPlayer(msg, "addItem", []);
    } else {
      await msg.channel.send("Ce joueur n'existe pas");
    }
  }
}

/**
 * Create new item based on submission from @see itemCreationContainer
 * @param {*} interaction interaction from validate button
 */
export function itemSubmit(interaction: ButtonInteraction) {
  var container = interaction.message.components[0] as ContainerComponent;
  var itemNameButton = (container.components[0] as unknown as SectionComponent)
    .accessory as ButtonComponent;
  if (itemNameButton) {
    var name = itemNameButton.customId?.split("/")[2] ?? "";
    var itemName = itemNameButton.label ?? "";
    if (
      itemNameButton.style == ButtonStyle.Primary ||
      !selectCache.exists(
        (container.components[1] as unknown as ActionRow<any>).components[0]
          .customId
      )
    ) {
      //name not entered
      return false;
    }
    var amount = parseInt(
      selectCache.pop(
        (container.components[1] as unknown as ActionRow<any>).components[0]
          .customId
      ) ?? ""
    );
    db.addItem(itemName);
    db.addPlayerItem(itemName, name, amount);
    return true;
  }
}
