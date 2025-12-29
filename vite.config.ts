// vite.config.ts - COMPLETE FIXED VERSION
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(), // Handles Netlify routing automatically
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      injectRegister: "script",
      devOptions: { enabled: true },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],
        globIgnores: ["**/*.*~"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /^\/_/, /^\/static/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
            },
          },
        ],
      },
      manifest: {
        name: "Wealth Management",
        short_name: "Wealth",
        description: "Manage your wealth anywhere, anytime",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1677ff",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
            purpose: "any maskable",
          },
        ],
      },
    }),
    // ✅ REMOVED: netlifyPlugin() - conflicts with reactRouter()
  ],
  build: {
    outDir: "dist", // Matches your netlify.toml
  },
});
