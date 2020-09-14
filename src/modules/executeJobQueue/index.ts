import * as fs from 'fs'
import * as path from 'path'
import { JobType } from '~/constants'
import { Job } from '~/types'
import { workingDir } from '~/utils/paths'

export function executeJobQueue(jobQueue: Job[]) {
  const actions = jobQueue.reduce((acc, j) => {
    const destinationPath = path.resolve(workingDir, j.destination)
    if (acc[destinationPath] == null) acc[destinationPath] = { actions: [] }

    acc[destinationPath].actions.push(j.type)

    if (j.type === JobType.CREATE || j.type === JobType.INJECT || j.type === JobType.OVERRIDE) {
      acc[destinationPath].body = j.body
    }

    return acc
  }, {} as { [key: string]: { actions: JobType[]; body?: string } })

  Object.entries(actions).forEach(([p, a]) => {
    if (!fs.existsSync(p)) fs.mkdirSync(path.dirname(p), { recursive: true })
    if (a.body != null) {
      fs.writeFileSync(p, a.body)
    }
  })
}
