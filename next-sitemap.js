const siteUrl =
  process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "production"
    ? "https://spinoza.xyz"
    : "https://spinoza-mu.vercel.app";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
