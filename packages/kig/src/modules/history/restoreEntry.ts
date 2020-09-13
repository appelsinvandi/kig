import * as fs from 'fs'
import * as path from 'path'
import to from 'await-to-js'
import { prompt } from 'enquirer'
import { HistoryEntry, HistoryEntryDiscovery } from '~/types'
import { workingDir } from '~/utils/paths'
import { hashFileBody } from './utils/hash'
import { HistoryEntryType } from '~/constants'
import chalk from 'chalk'

export async function restoreHistoryEntry(entryDiscovery: HistoryEntryDiscovery) {
  const entryIndex = require(path.resolve(entryDiscovery.entryPath, 'index.json')) as HistoryEntry
  entryIndex.items = entryIndex.items.map((e) => ({
    ...e,
    destinationPath: path.resolve(workingDir, e.destinationPath),
  }))

  console.log('Undoing the following action:', entryIndex.command)

  // Check for changes
  const changedFiles = entryIndex.items.filter(
    (e) =>
      fs.existsSync(e.destinationPath) && hashFileBody(fs.readFileSync(e.destinationPath).toString()) !== e.hashAfter
  )
  if (changedFiles.length > 0) {
    const changedPaths = changedFiles.map((e) => e.destinationPath.replace(workingDir, '').replace(/^[\/\\]/, ''))
    const [overridePromptErr, overridePromptAnswer] = await to(
      prompt({
        name: 'override',
        type: 'confirm',
        message:
          'There has been changes to the following files since the history entry was made:\n' +
          `│   - ${changedPaths.map((p) => chalk.underline(p)).join('\n│   - ')}\n` +
          '└ Proceeding will override all these files and delete all changes. Do you want to continue?',
      }) as Promise<{ override: boolean }>
    )

    if (overridePromptErr != null || !overridePromptAnswer!.override) {
      console.log('Exiting...')
      process.exit(0)
    }
  }

  for (const entryItem of entryIndex.items) {
    if (entryItem.type === HistoryEntryType.ADD && fs.existsSync(entryItem.destinationPath)) {
      fs.unlinkSync(entryItem.destinationPath)
    } else if (entryItem.type === HistoryEntryType.CHANGE) {
      fs.copyFileSync(path.resolve(entryDiscovery.entryPath, entryItem.cacheFileName), entryItem.destinationPath)
    }
  }

  fs.rmdirSync(entryDiscovery.entryPath, { recursive: true })
}
