import { Router } from "express";
import type { Router as RouterType } from "express";
import type { Request, Response, NextFunction } from "express";

import payloader from "@setsetset-777/payloader";
import type { LocalesData } from "@setsetset-777/payloader";
import logger from "@setsetset-777/logger";

import { getAssetsDetails, clientDistPath } from "../utils/index.ts";
import type { HttpError } from "../types/index.ts";

export const initRouter = async (): Promise<RouterType> => {
  const router = Router();

  let localization = { localeCodes: ["en"], defaultLocale: "en" };

  try {
    localization = (await payloader.fetch("locales")) as LocalesData;
  } catch (e) {
    logger.warn("No locales retrieved:", e);
  }

  const { localeCodes: locales, defaultLocale } = localization;

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

  router.get("{/*paths}", async (req, res, next) => {
    const paths = req.params.paths || [];
    let locale = defaultLocale;
    let path;

    /* Handle locales */
    if (locales.includes(paths[0])) {
      locale = paths[0];
      path = paths[1];
    } else {
      path = paths[0];
    }

    if (!path) {
      path = "home";
    }

    res.render("home", {
      ...viewData,
    });
  });

  /**
   * ERROR HANDLING
   */
  router.use(
    (err: HttpError, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500);

      res.render("error", {
        message:
          process.env.NODE_ENV === "production"
            ? "Something went wrong. Please try agaon later."
            : err.message,
        ...viewData,
      });
    },
  );

  return router;
};
