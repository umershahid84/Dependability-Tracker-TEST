import {fileURLToPath} from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['10.0.4.2'],
  turbopack: {
    // Pin the workspace root to this project so Turbopack doesn't walk up
    // and pick up an unrelated lockfile from a parent directory (e.g. $HOME).
    root: __dirname
  }
};

export default nextConfig;
