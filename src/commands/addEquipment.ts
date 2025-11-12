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
  equipmentCreationContainer,
  SelectionContainer,
  SelectionTypes,
} from "../menus.ts";
import { BodyParts } from "../objects/Equipment.ts";
import { selectCache } from "../SelectCache.ts";
import { selectPlayer } from "../selectPlayer.ts";
import { fr } from "../locales/fr.ts";
type BodyPart = (typeof BodyParts)[keyof typeof BodyParts];

export const data = new SlashCommandBuilder()
  .setName(fr.slashCommands.addEquipment)
  .setDescription(fr.commandDescriptions.addEquipment)
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
        SelectionTypes.Equipment
      );
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
    } else if (player.length > 1) {
      selectPlayer(interaction, "addEquipment", []);
    } else {
      await interaction.reply(fr.error.playerDoesNotExist);
    }
  }
}

export async function executeMessage(msg: Message) {
  if (msg.channel.isSendable()) {
    var tmp = msg.content.split(" ");
    if (tmp.length != 2) {
      await msg.channel.send(fr.usage.addEquipment);
      return;
    }
    var id = msg.content.split(" ")[1].replace(/[@<>]/g, "");
    var player = db.getPlayerFromAuthorId(id, msg.guild?.id ?? "");
    if (player.length == 1) {
      let container = SelectionContainer(
        msg.author.id,
        player[0],
        SelectionTypes.Equipment
      );
      await msg.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
      });
    } else if (player.length > 1) {
      selectPlayer(msg, "addEquipment", []);
    } else {
      await msg.channel.send(fr.error.playerDoesNotExist);
    }
  }
}

/**
 * Create new equipment based on submission from @see equipmentCreationContainer
 * @param {*} interaction interaction from validate button
 */
export function equipmentSubmit(interaction: ButtonInteraction) {
  var container = interaction.message.components[0] as ContainerComponent;
  var equipmentNameButton = (
    container.components[0] as unknown as SectionComponent
  ).accessory as ButtonComponent;
  if (equipmentNameButton) {
    var name = equipmentNameButton.customId?.split("/")[2] ?? "";
    var equipmentName = equipmentNameButton.label ?? "";
    var numModifiers = Math.min(
      Math.ceil((container.components.length - 5) / 2),
      4
    );
    if (equipmentNameButton.style == ButtonStyle.Primary) {
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
    var descriptionButton = (
      container.components[1] as unknown as SectionComponent
    ).accessory as ButtonComponent;
    var description =
      descriptionButton.style == ButtonStyle.Secondary
        ? descriptionButton.label ?? ""
        : "";
    var bodypart = parseInt(
      selectCache.pop(
        (container.components[2] as unknown as ActionRow<any>).components[0]
          .customId
      ) ?? ""
    ) as BodyPart;
    db.addEquipment(equipmentName, description, bodypart);
    for (let i = 0; i < numModifiers; i++) {
      var stat =
        selectCache.pop(
          (
            (container.components[3 + i * 2] as unknown as ActionRow<any>)
              .components[0] as unknown as StringSelectMenuComponent
          ).customId
        ) ?? "";
      var value = parseInt(
        selectCache.pop(
          (
            (container.components[4 + i * 2] as unknown as ActionRow<any>)
              .components[0] as unknown as StringSelectMenuComponent
          ).customId
        ) ?? ""
      );
      db.addEquipmentModifier(equipmentName, stat, value);
    }
    db.addPlayerEquipment(equipmentName, name);
    return true;
  }
}
