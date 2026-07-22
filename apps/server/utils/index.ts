import path from 'path'
import fs from 'fs'

import config from './config.ts'

export const clientDistPath = process.env.CLIENT_DIST || '../client/dist'

export const clientAssetsPath = path.join(clientDistPath, 'assets')

const { manifestFile, mainFile } = config.client

/**
 * Returns client assets access details
 */
export const getAssetsDetails = (
  clientDistPath: string,
): {
  mainJs: string
  mainCss: string
} => {
  const manifest = JSON.parse(fs.readFileSync(path.join(clientDistPath, manifestFile), 'utf-8'))

  const main = manifest[mainFile]

  return {
    mainJs: `/${main.file}`,
    mainCss: `/${main.css[0]}`,
  }
}
