import {
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ContainerComponent,
  Message,
  SectionComponent,
  SlashCommandBuilder,
  StringSelectMenuComponent,
  MessageFlags,
  GuildMember,
  ActionRow,
} from "discord.js";
import * as db from "../database.ts";
import {
  perkCreationContainer,
  SelectionContainer,
  SelectionTypes,
} from "../menus.ts";
import { selectCache } from "../SelectCache.ts";
import { selectPlayer } from "../selectPlayer.ts";
import { fr } from "../locales/fr.ts";

export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.addPerk)
  .setDescription(fr.commandDescriptions.addPerk)
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription(fr.optionDescriptions.user)
      .setRequired(true)
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
        SelectionTypes.Perk
      );
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
    } else if (player.length > 1) {
      selectPlayer(interaction, "addPerk", []);
    } else {
      await interaction.reply(fr.error.playerDoesNotExist);
    }
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    var tmp = msg.content.split(" ");
    if (tmp.length != 2) {
      await msg.channel.send(fr.usage.addPerk);
      return;
    }
    var id = msg.content.split(" ")[1].replace(/[@<>]/g, "");
    var player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      let container = SelectionContainer(
        msg.author.id,
        player[0],
        SelectionTypes.Perk
      );
      await msg.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
    } else if (player.length > 1) {
      selectPlayer(msg, "addPerk", []);
    } else {
      await msg.channel.send(fr.error.playerDoesNotExist);
    }
  }
}

/**
 * Create new perk based on submission from @see perkCreationContainer
 * @param {*} interaction interaction from validate button
 */
export function perkSubmit(interaction: ButtonInteraction) {
  var container = interaction.message.components[0] as ContainerComponent;
  var perkNameButton = (container.components[0] as unknown as SectionComponent)
    .accessory as ButtonComponent;
  if (perkNameButton) {
    var name = perkNameButton.customId?.split("/")[2] ?? "";
    var perkName = perkNameButton.label ?? "";
    var numModifiers = Math.min(
      Math.ceil((container.components.length - 4) / 2),
      4
    );
    if (perkNameButton.style == ButtonStyle.Primary) {
      //name not entered
      return false;
    }
    for (let i = 0; i < numModifiers; i++) {
      if (
        !selectCache.exists(
          (
            (container.components[2 + i * 2] as unknown as ActionRow<any>)
              .components[0] as unknown as StringSelectMenuComponent
          ).customId
        ) ||
        !selectCache.exists(
          (
            (container.components[3 + i * 2] as unknown as ActionRow<any>)
              .components[0] as unknown as StringSelectMenuComponent
          ).customId
        )
      ) {
        return false;
      }
    }
    var conditionButton = (
      container.components[1] as unknown as SectionComponent
    ).accessory as ButtonComponent;
    var condition =
      conditionButton.style == ButtonStyle.Secondary
        ? conditionButton.label ?? ""
        : "";
    db.addPerk(perkName, condition);
    for (let i = 0; i < numModifiers; i++) {
      var stat =
        selectCache.pop(
          (
            (container.components[2 + i * 2] as unknown as ActionRow<any>)
              .components[0] as unknown as StringSelectMenuComponent
          ).customId
        ) ?? "";
      var value = parseInt(
        selectCache.pop(
          (
            (container.components[3 + i * 2] as unknown as ActionRow<any>)
              .components[0] as unknown as StringSelectMenuComponent
          ).customId
        ) ?? ""
      );
      db.addPerkModifier(perkName, stat, value);
    }
    db.addPlayerPerk(perkName, name);
    return true;
  }
}
