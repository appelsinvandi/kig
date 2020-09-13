import { HistoryEntryType } from '~/constants'

export interface HistoryEntryDiscovery {
  entryName: string
  entryPath: string
}

export interface HistoryEntry {
  timestamp: number
  command: string
  items: HistoryEntryItem[]
}

export type HistoryEntryItem = HistoryEntryItemAdd | HistoryEntryItemChange
export interface HistoryEntryItemAdd {
  type: HistoryEntryType.ADD
  destinationPath: string
  hashAfter: string
}
export interface HistoryEntryItemChange {
  type: HistoryEntryType.CHANGE
  destinationPath: string
  cacheFileName: string
  hashBefore: string
  hashAfter: string
}
