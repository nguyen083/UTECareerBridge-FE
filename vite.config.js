import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    base: "/",
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_UI_PORT) || 3000, // Thêm fallback port
      host: '0.0.0.0', // Cho phép truy cập từ bên ngoài
      allowedHosts: ['ute-career.pro.vn'],
      hmr: {
        protocol: "ws",
        host: "localhost"
        },
    },
  };
});