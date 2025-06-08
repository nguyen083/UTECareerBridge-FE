import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  //eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());

  return {
    base: "/",
    plugins: [react()],
    server: {
      port: env.VITE_UI_PORT,
      hmr: {
        host: "localhost",
        protocol: "ws",
      },
    },
  };
});
