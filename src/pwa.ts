// src/pwa.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({
        onNeedRefresh() {
          if (confirm("🆕 New version available. Reload to update?")) {
            window.location.reload();
          }
        },
        onOfflineReady() {
          console.log("✅ App ready to work offline!");
        },
        onRegisteredSW(swScriptUrl: string) {
          console.log("✅ Service Worker registered:", swScriptUrl);
        },
        onRegisterError(error: Error) {
          console.error("❌ SW registration failed:", error);
        }
      });
    });
  });
}
