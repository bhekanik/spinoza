/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const moduleExports = {
  reactStrictMode: true,
  optimization: {
    usedExports: true,
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  swcMinify: true,
  future: {
    webpack5: true,
  },
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withPWA(moduleExports);
