import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const refreshButton = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("nike")
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Primary)
  ),
];
