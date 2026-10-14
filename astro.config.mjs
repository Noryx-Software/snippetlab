import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://snippetlab.vercel.app',
  integrations: [react()],
});
