import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script",
      strategies: "generateSW",
      devOptions: { enabled: true },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [/^\/$/],
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: "Wealth Management",
        short_name: "Wealth",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1677ff",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "build",
  },
});
