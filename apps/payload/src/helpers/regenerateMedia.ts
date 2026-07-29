import path from 'path'
import fs from 'fs'
import { Payload } from 'payload'

const limit = 1000

export default async function regenerateMedia(payload: Payload, staticDir: string = 'media') {
  console.log('Initialise media regeneration...')

  const mediaPath = path.resolve(process.cwd(), staticDir)

  if (fs.existsSync(mediaPath)) {
    console.log(`Folder ${mediaPath} found`)
  } else {
    console.error(`Folder ${mediaPath} not found`)
    return
  }

  try {
    await cleanUpMedia(payload, mediaPath)
    await generateThumbs(payload, mediaPath)
  } catch (err) {
    console.log('Erreur retrieveing Paylaod')
    console.error(err)
    return
  }

  console.log('Media regeneration completed!')
}

async function cleanUpMedia(payload: Payload, mediaPath: string) {
  console.log('Clean up media')
  try {
    const media = await payload.find({
      collection: 'media',
      limit,
      pagination: false,
    })

    const originals = new Set(media.docs.map((doc) => doc.filename))

    const files = await fs.promises.readdir(mediaPath)

    for (const file of files) {
      if (originals.has(file)) continue

      const fullPath = path.join(mediaPath, file)
      const stat = await fs.promises.stat(fullPath)

      if (stat.isFile()) {
        console.log(`Deleting ${file}`)
        await fs.promises.unlink(fullPath)
      }
    }
  } catch (err) {
    console.log('Erreur cleaning up media')
    throw err
  }
}

async function generateThumbs(payload: Payload, mediaPath: string) {
  console.log('Regenerate media')
  try {
    const media = await payload.find({
      collection: 'media',
      limit,
      pagination: false,
    })

    if (!media.totalDocs) {
      console.log('No media found')
      process.exit(0)
    }

    for (const mediaDoc of media.docs) {
      try {
        await payload.update({
          collection: 'media',
          id: mediaDoc.id,
          data: mediaDoc,
          overwriteExistingFiles: true,
          filePath: `${mediaPath}/${mediaDoc.filename}`,
        })

        console.log(`Media ${mediaDoc.id} (${mediaDoc.filename}) regenerated.`)
      } catch (err) {
        console.log(`Media ${mediaDoc.id} (${mediaDoc.filename}) failed to regenerate.`)
        throw err
      }
    }
  } catch (err) {
    console.log('Erreur regenerating media')
    throw err
  }
}
