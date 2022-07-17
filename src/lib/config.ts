export const config = {
  key: process.env.KEY || "",
  region: process.env.REGION || "",
  isProd: process.env.NODE_ENV === "production",
};
