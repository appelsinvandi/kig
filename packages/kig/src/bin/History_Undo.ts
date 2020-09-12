import { discoverEntries, restoreHistoryEntry } from '~/modules/history'

export async function History_Undo() {
  const historyEntries = discoverEntries()
  if (historyEntries == null) return
  if (historyEntries.length === 0) {
    console.log('No history found.')
    return
  }
  const latestHistoryEntryFolderPath = historyEntries.sort((a, b) => Number(b.entryName) - Number(a.entryName))[0]

  return restoreHistoryEntry(latestHistoryEntryFolderPath)
}
