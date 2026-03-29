import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		dangerouslyAllowLocalIP: true,
		remotePatterns: [
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "3000",
				pathname: "/api/preview/image/**",
			},
		],
	},
};

export default nextConfig;
