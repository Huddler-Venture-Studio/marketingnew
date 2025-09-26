export const siteHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || "huddler.io";
export const siteUrl = `https://${siteHost}`;