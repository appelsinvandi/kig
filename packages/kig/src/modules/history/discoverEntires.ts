import * as fs from 'fs'
import * as path from 'path'
import { getProjectConfig } from '~/modules/projectConfig'
import { workingDir } from '~/utils/paths'

export function discoverEntries() {
  const projectConfig = getProjectConfig()
  if (!projectConfig.history.enabled) {
    // TODO: Display error
    return
  }
  const cacheLocation = path.resolve(workingDir, projectConfig.history.cacheLocation, 'history')

  return fs.readdirSync(cacheLocation).map((f) => ({
    entryName: f,
    entryPath: path.resolve(cacheLocation, f),
  }))
}
