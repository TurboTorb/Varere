import adapter from '@sveltejs/adapter-auto';
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
		  resolve: {
			alias: {
			  	$lib: path.resolve("./src/lib")
			}
			},
			// server: {
			// 	hmr: {
			// 		// host: 'localhost'
			// 		host: "0.0.0.0"
			// 		// port: 3000,
			// 		// clientPort: 443
			// 	}
			// }
		}
	}
};

export default config;
