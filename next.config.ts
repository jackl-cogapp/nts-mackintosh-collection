import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Pin Turbopack workspace root to this project — silences the
	// "multiple lockfiles detected" warning when this repo lives next
	// to other lockfiles (e.g. parent monorepo or sibling projects).
	turbopack: {
		root: path.join(__dirname),
	},
};

export default nextConfig;
