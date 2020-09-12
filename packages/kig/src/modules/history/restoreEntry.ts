import * as fs from 'fs'
import * as path from 'path'
import { prompt } from 'enquirer'
import { HistoryEntry } from '~/types'
import { workingDir } from '~/utils/paths'
import { hashFileBody } from './utils/hash'
import { HistoryEntryType } from '~/constants'

export async function restoreHistoryEntry(historyEntry: { entryName: string; entryPath: string }) {
  const entryIndex = require(path.resolve(historyEntry.entryPath, 'index.json')) as HistoryEntry
  entryIndex.items = entryIndex.items.map((e) => ({
    ...e,
    destinationPath: path.resolve(workingDir, e.destinationPath),
  }))

  // Check for changes
  const changedFiles = entryIndex.items.filter(
    (e) =>
      fs.existsSync(e.destinationPath) && hashFileBody(fs.readFileSync(e.destinationPath).toString()) !== e.hashAfter
  )
  if (changedFiles.length > 0) {
    const changedPaths = changedFiles.map((e) => e.destinationPath.replace(workingDir, '').replace(/^[\/\\]/, ''))
    const answer = (await prompt({
      name: 'override',
      type: 'confirm',
      message:
        'There has been changes to the following files since the history entry was made:\n' +
        `│   - ${changedPaths.join('\n│   - ')}\n` +
        '└ Proceeding will override all these files and delete all changes. Do you want to continue?',
    })) as { override: boolean }

    if (!answer.override) {
      // TODO: Message
      return
    }
  }

  for (const entryItem of entryIndex.items) {
    if (entryItem.type === HistoryEntryType.ADD && fs.existsSync(entryItem.destinationPath)) {
      fs.unlinkSync(entryItem.destinationPath)
    } else if (entryItem.type === HistoryEntryType.CHANGE) {
      fs.copyFileSync(path.resolve(historyEntry.entryPath, entryItem.cacheFileName), entryItem.destinationPath)
    }
  }

  fs.rmdirSync(historyEntry.entryPath, { recursive: true })
}
