import * as fs from 'fs'
import * as path from 'path'
import { getProjectConfig } from '~/modules/projectConfig'
import { HistoryEntryDiscovery } from '~/types'
import { workingDir } from '~/utils/paths'
import { HistoryDisabledError } from './errors'

export function discoverHistoryEntries(): HistoryEntryDiscovery[] {
  const projectConfig = getProjectConfig()
  if (!projectConfig.history.enabled) throw new HistoryDisabledError()

  const cacheLocation = path.resolve(workingDir, projectConfig.history.cacheLocation, 'history')

  return fs.readdirSync(cacheLocation).map((f) => ({
    entryName: f,
    entryPath: path.resolve(cacheLocation, f),
  }))
}
