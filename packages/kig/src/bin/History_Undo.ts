import chalk from 'chalk'
import { discoverHistoryEntries, restoreHistoryEntry } from '~/modules/history'

export async function History_Undo() {
  console.log(chalk.bold('kig history - undo generator run'))

  const historyEntries = discoverHistoryEntries()
  if (historyEntries == null) return
  if (historyEntries.length === 0) {
    console.log('No history found.')
    return
  }
  const latestHistoryEntryFolderPath = historyEntries.sort((a, b) => Number(b.entryName) - Number(a.entryName))[0]

  return restoreHistoryEntry(latestHistoryEntryFolderPath)
}
