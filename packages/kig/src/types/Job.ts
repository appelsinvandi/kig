import { JobType } from '~/constants'

export type Job = JobCreate | JobOverride | JobInject | JobSkip | JobExit
export interface JobCreate {
  type: JobType.CREATE
  destination: string
  body: string
}
export interface JobOverride {
  type: JobType.OVERRIDE
  destination: string
  body: string
}
export interface JobInject {
  type: JobType.INJECT
  destination: string
  body: string
}
export interface JobSkip {
  type: JobType.SKIP
  destination: string
  message?: string
}
export interface JobExit {
  type: JobType.EXIT
  destination: string
  message?: string
}
