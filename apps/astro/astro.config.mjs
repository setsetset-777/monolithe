// @ts-check
import { defineConfig } from 'astro/config'

import node from '@astrojs/node'

const domains = (process.env.DOMAINS ?? '').split(',')

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  security: {
    allowedDomains: domains.map((domain) => ({
      hostname: `**.${domain}`,
      protocol: 'https',
    })),
  },
})
