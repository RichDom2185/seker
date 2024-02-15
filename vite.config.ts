import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Use UMD bundle for xmlhttprequest-ts dependency
      {
        find: "xmlhttprequest-ts",
        replacement:
          "./node_modules/xmlhttprequest-ts/bundles/xmlhttprequest-ts.umd.js",
      },
    ],
  },
});
