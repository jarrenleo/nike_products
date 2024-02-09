import { CalendarData } from "../data/calendarData.js";
import { calendarEmbed } from "../utilities/embeds.js";

export class Calendar extends CalendarData {
  constructor() {
    super();
  }

  async createEmbed(country) {
    try {
      const data = await this.getCalendarData(country);
      return calendarEmbed(data);
    } catch (e) {
      throw Error(e.message);
    }
  }

  async sendEmbed(m, embed) {
    try {
      m.reply({
        embeds: embed,
        allowedMentions: {
          repliedUser: false,
        },
      });
    } catch (e) {
      this.sendError(m, e.message);
    }
  }

  sendError(m, message) {
    m.reply({
      content: message,
    });
  }

  async handleMessage(m, countries) {
    try {
      if (!countries.length) throw new Error("Missing country parameter");

      for (const country of countries) {
        const embed = await this.createEmbed(country);
        await this.sendEmbed(m, embed);
      }
    } catch (e) {
      this.sendError(m, e.message);
    }
  }
}
