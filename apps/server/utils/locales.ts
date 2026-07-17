import payloader from "@setsetset-777/payloader";
import logger from "@setsetset-777/logger";
import type { LocalesData } from "@setsetset-777/payloader";

export const DEFAULT_LOCALE = "fr";

export const getLocales: () => Promise<LocalesData> = async () => {
  let locales = {
    localeCodes: ["fr"],
    defaultLocale: DEFAULT_LOCALE,
  };

  if (process.env.PAYLOAD_ENABLE) {
    try {
      locales = (await payloader.locales()) as LocalesData;
    } catch (e) {
      logger.warn("No locales retrieved:", e);
    }
  }

  return locales;
};
