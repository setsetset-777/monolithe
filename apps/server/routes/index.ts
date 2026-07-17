import { Router } from "express";
import type { Router as RouterType } from "express";
import type { Request, Response, NextFunction } from "express";

import payloader from "@setsetset-777/payloader";
import logger from "@setsetset-777/logger";

import { getAssetsDetails, clientDistPath } from "../utils/index.ts";
import { DEFAULT_LOCALE, getLocales } from "../utils/locales.ts";
import type { HttpError, Locale } from "../types/index.ts";

export const initRouter = async (): Promise<RouterType> => {
  const router = Router();

  const { mainJs, mainCss, resetCss } = getAssetsDetails(clientDistPath);
  const viewData = {
    mainJs,
    mainCss,
    resetCss,
    analytics: {
      enable: process.env.ANALYTICS_ENABLE === "true",
      domain: process.env.ANALYTICS_DOMAIN,
      id: process.env.ANALYTICS_ID,
    },
  };

  router.get("/{*paths}", async (req, res, next) => {
    const paths = req.params.paths || [];
    const url = req.url;

    /* Handle locales */
    const { localeCodes: locales } = await getLocales();

    const locale = (locales.includes(paths[0]) && paths[0]) as Locale;
    let path = url;

    if (locale) {
      // Remove locale
      path = path.replace(new RegExp(`^${locale}(?=\/|$)`), "");
    }

    /* Handle routes */
    const routes = (await payloader.fetch(
      "routes",
      null,
      locale as string,
    )) as {
      path: string;
      slug: string;
    }[];
    const route = routes.find((item) => item.path === path);

    if (!route) {
      next(404);
      return;
    }

    try {
      const page = await payloader.global(path, locale);

      console.log("page", page);

      res.render(`pages/${route.slug}`, {
        ...viewData,
        page,
      });
    } catch (e) {
      console.log("error", e);
      next(e);
    }

    // res.render(path, {
    //   ...viewData,
    // });
  });

  /**
   * ERROR HANDLING
   */
  router.use(
    (err: HttpError, req: Request, res: Response, next: NextFunction) => {
      const templates: { [key: string]: string } = {
        404: "errors/404",
        default: "errors/500",
      };
      const template =
        templates[err as unknown as string | number] ?? templates.default;

      res.render(template, {
        message:
          process.env.NODE_ENV === "production"
            ? "Something went wrong. Please try again later."
            : err.message,
        ...viewData,
      });
    },
  );

  return router;
};
