import * as fs from 'fs'
import arrify from 'arrify'
import { JobType, TemplateMode } from '~/constants'
import {
  TemplateHead,
  TemplateHeadModeCreate,
  TemplateHeadModeInject,
  TemplatePropertySkip,
  Job,
  JobCreate,
  JobInject,
  JobOverride,
} from '~/types'
import {
  getEventConflictResolutionType,
  getEventDestinationNotFoundResolutionType,
  resolveLocation,
  resolveSkip,
} from './subModules'

export async function generateTemplateJobs(
  templateHead: TemplateHead,
  templateBody: string,
  existingJobs: Job[]
): Promise<Job[]> {
  let jobs: Job[] = []

  for (const destinationPath of arrify(templateHead.destination)) {
    const destinationBody = (() => {
      const existingJob = (existingJobs.concat(jobs) as (JobCreate | JobInject | JobOverride)[])
        .reverse()
        .find((j) => j.destination === destinationPath && j.body != null)
      if (existingJob != null) return existingJob.body
      else if (fs.existsSync(destinationPath)) return fs.readFileSync(destinationPath).toString()
      else return undefined
    })()

    // Skip
    const skip = templateHead.skip as TemplatePropertySkip | TemplatePropertySkip[] | undefined
    if (skip != null) {
      let shouldSkip = arrify(skip).some((s) => resolveSkip(s, destinationBody))

      if (shouldSkip) {
        jobs.push({ type: JobType.SKIP, destination: destinationPath })
        continue
      }
    }

    // Trim
    const trim = templateHead.trim
    if (trim != null) {
      if (arrify(trim).includes('leading')) {
        templateBody = templateBody.trimLeft()
      }
      if (arrify(trim).includes('trailing')) {
        templateBody = templateBody.trimRight()
      }
    }

    let job: Job | null = null
    if (templateHead.mode === TemplateMode.CREATE) {
      job = await generateCreateTemplateJob(templateHead as TemplateHeadModeCreate, templateBody, destinationPath)
    } else if (templateHead.mode === TemplateMode.INJECT) {
      job = await generateInjectTemplateJob(
        templateHead as TemplateHeadModeInject,
        templateBody,
        destinationPath,
        destinationBody
      )
    }

    if (job == null || job.type === JobType.EXIT) {
      console.error('Cannot complete template because of file:', destinationPath)
      if (job?.type === JobType.EXIT && job?.message != null) {
        console.error(job.message)
      }
      // TODO: Better propagation back to root for more clear behavior
      process.exit(0)
    } else {
      jobs.push(job)
    }
  }

  return jobs
}

async function generateCreateTemplateJob(
  templateHead: TemplateHeadModeCreate,
  templateBody: string,
  destinationPath: string
): Promise<Job> {
  if (fs.existsSync(destinationPath)) {
    const returnType = await getEventConflictResolutionType(templateHead, destinationPath)

    if (returnType === JobType.OVERRIDE) {
      return {
        type: JobType.OVERRIDE,
        destination: destinationPath,
        body: templateBody,
      }
    } else if (returnType === JobType.SKIP) {
      return {
        type: JobType.SKIP,
        destination: destinationPath,
      }
    } else {
      return {
        type: JobType.EXIT,
        destination: destinationPath,
        message: 'Unable to resolve: File already exists.',
      }
    }
  }

  return {
    type: JobType.CREATE,
    destination: destinationPath,
    body: templateBody,
  }
}

async function generateInjectTemplateJob(
  templateHead: TemplateHeadModeInject,
  templateBody: string,
  destinationPath: string,
  destinationBody?: string
): Promise<Job> {
  if (destinationBody == null) {
    const returnType = await getEventDestinationNotFoundResolutionType(templateHead, destinationPath)

    if (returnType === JobType.CREATE) {
      return {
        type: JobType.CREATE,
        destination: destinationPath,
        body: templateBody,
      }
    } else if (returnType === JobType.SKIP) {
      return {
        type: JobType.SKIP,
        destination: destinationPath,
      }
    } else {
      return {
        type: JobType.EXIT,
        destination: destinationPath,
        message: 'Unable to resolve: File does not exist.',
      }
    }
  }

  return resolveLocation(templateHead, templateBody, destinationPath, destinationBody)
}
