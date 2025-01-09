import { Platform } from "react-native";
import { getLocales } from "./module";

function getUnsupportedError(
  os: Platform["OS"],
  version: Platform["Version"],
): Error {
  return new Error(`Only supported by ${os} ${version} and above`);
}

export function findBestLanguageTag<T extends string>(
  languageTags: ReadonlyArray<T>,
): { languageTag: T; isRTL: boolean } | undefined {
  const locales = getLocales();
  const loweredLanguageTags = languageTags.map((tag) => tag.toLowerCase());

  for (let i = 0; i < locales.length; i++) {
    const currentLocale = locales[i];

    if (!currentLocale) {
      continue;
    }

    const { languageTag, languageCode, scriptCode, countryCode, isRTL } =
      currentLocale;

    const combinaisons = [
      languageTag,
      !!scriptCode ? languageCode + "-" + scriptCode : null,
      languageCode + "-" + countryCode,
      languageCode,
    ].filter((value): value is string => !!value);

    for (let j = 0; j < combinaisons.length; j++) {
      const combinaison = combinaisons[j]?.toLowerCase();

      if (!combinaison) {
        continue;
      }

      const tagIndex = loweredLanguageTags.indexOf(combinaison);
      const languageTag = languageTags[tagIndex];

      if (languageTag && tagIndex !== -1) {
        return { languageTag, isRTL };
      }
    }
  }
}

import { openAppLanguageSettings as openAppLanguageSettingsImpl } from "./module";

export function openAppLanguageSettings(): void {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    openAppLanguageSettingsImpl();
  } else {
    throw getUnsupportedError("android", 33);
  }
}

export {
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  uses24HourClock,
  usesAutoDateAndTime,
  usesAutoTimeZone,
  usesMetricSystem,
} from "./module";
export * from "./types";
