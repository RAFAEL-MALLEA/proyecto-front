import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(
  async ({ requestLocale }) => {
    const localeSolicitado =
      await requestLocale;

    const locale = hasLocale(
      routing.locales,
      localeSolicitado
    )
      ? localeSolicitado
      : routing.defaultLocale;

    return {
      locale,

      messages: (
        await import(
          `../messages/${locale}.json`
        )
      ).default,
    };
  }
);