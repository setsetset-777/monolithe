import payloader from "@setsetset-777/payloader";

type LocaleCode = string;

export type Locales = {
  localeCodes: LocaleCode[];
  defaultLocale: LocaleCode;
};

export const getLocales: () => Promise<Locales> = async () => {
  let locales = {
    localeCodes: ["en"],
    defaultLocale: "en",
  };

  if (process.env.PAYLOAD_ENABLE) {
    locales = (await payloader.locales()) as Locales;
  }

  return locales;
};
