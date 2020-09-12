import * as fs from 'fs'
import * as path from 'path'
import { HistoryEntry, HistoryEntryItem, Job, JobCreate, JobInject, JobOverride } from '~/types'
import { getProjectConfig } from '~/modules/projectConfig'
import { workingDir } from '~/utils/paths'
import { HistoryEntryType, JobType } from '~/constants'
import { hashFileBody } from './utils/hash'

export async function createHistoryEntry(jobs: Job[], command: string) {
  const timestamp = Date.now()
  const projectConfig = getProjectConfig()
  if (!projectConfig.history.enabled) return

  const cacheLocation = path.resolve(workingDir, projectConfig.history.cacheLocation, 'history')
  if (!fs.existsSync(cacheLocation)) fs.mkdirSync(cacheLocation, { recursive: true })

  const limit = projectConfig.history.limit
  let existingEntries = fs
    .readdirSync(cacheLocation)
    .filter((f) => fs.lstatSync(path.resolve(cacheLocation, f)).isDirectory())
    .sort((a, b) => Number(b) - Number(a))
  if (existingEntries.length >= limit)
    existingEntries
      .slice(limit - 1, existingEntries.length)
      .forEach((f) => fs.rmdirSync(path.resolve(cacheLocation, f), { recursive: true }))

  const historyEntryLocation = path.resolve(cacheLocation, String(timestamp))
  fs.mkdirSync(historyEntryLocation)

  type FilteredJob = JobCreate | JobInject | JobOverride
  const filteredJobs = jobs.filter((j) => j.type !== JobType.EXIT && j.type !== JobType.SKIP) as FilteredJob[]
  const historyItems = filteredJobs.reverse().reduce((acc, job, i) => {
    if (acc.every((h) => h.destinationPath !== job.destination)) {
      if (fs.existsSync(path.resolve(workingDir, job.destination))) {
        const destinationBody = fs.readFileSync(path.resolve(workingDir, job.destination)).toString()

        acc.push({
          type: HistoryEntryType.CHANGE,
          cacheFileName: String(i),
          destinationPath: job.destination,
          hashBefore: hashFileBody(destinationBody),
          hashAfter: hashFileBody(job.body),
        })
      } else {
        acc.push({
          type: HistoryEntryType.ADD,
          destinationPath: job.destination,
          hashAfter: hashFileBody(job.body),
        })
      }
    }

    return acc
  }, [] as HistoryEntryItem[])

  // Save cache
  await Promise.all(
    historyItems.map(async (h) => {
      if (h.type === HistoryEntryType.CHANGE) {
        fs.copyFileSync(
          path.resolve(workingDir, h.destinationPath),
          path.resolve(historyEntryLocation, h.cacheFileName)
        )
      }
    })
  )

  const historyEntry: HistoryEntry = {
    timestamp: timestamp,
    command: command,
    items: historyItems,
  }
  fs.writeFileSync(path.resolve(historyEntryLocation, 'index.json'), JSON.stringify(historyEntry))
}
