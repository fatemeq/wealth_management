import React, { useEffect } from "react";
import { ConfigProvider } from "antd";
import { Links, Meta, Scripts, ScrollRestoration, Outlet } from "react-router";

export default function Root() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "connection" in navigator) {
      let refreshing = false;

      // Handle controller change (new SW takes control)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        window.location.reload();
      });

      // Register SW
      import("virtual:pwa-register").then(({ registerSW }) => {
        registerSW({
          onNeedRefresh() {
            if (confirm("🆕 New version available. Reload to update?")) {
              refreshing = true;
              window.location.reload();
            }
          },
          onOfflineReady() {
            console.log("✅ App ready to work offline!");
          },
          onRegisteredSW(swScriptUrl) {
            console.log("✅ Service Worker registered:", swScriptUrl);
          },
          onRegisterError(error) {
            console.error("❌ SW registration failed:", error);
          }
        });
      }).catch(console.error);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1677ff" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">
          <ConfigProvider>
            <Outlet />
          </ConfigProvider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
