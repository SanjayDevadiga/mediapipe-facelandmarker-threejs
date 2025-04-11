import { defineConfig } from "vite";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
	plugins: [mkcert()],
	server: {
		port: 3000, 
		open: true, 
		https: true
	},
});
