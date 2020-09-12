import { prompt } from 'enquirer'
import { JobType } from '~/constants'
import { TemplateHeadModeCreate } from '~/types'

export async function getEventConflictResolutionType(templateHead: TemplateHeadModeCreate, destinationPath: string) {
  if (templateHead.on?.conflict?.action === 'override') {
    return JobType.OVERRIDE
  } else if (templateHead.on?.conflict?.action === 'skip') {
    return JobType.SKIP
  } else {
    const answer = (await prompt({
      name: 'conflict',
      type: 'autocomplete',
      message: `Tried to create file: ${destinationPath}\nThe file already exists, how would you like to proceed?`,
      choices: ['skip', 'override'],
    })) as { conflict: 'skip' | 'override' }

    if (answer.conflict === 'override') {
      return JobType.OVERRIDE
    } else if (answer.conflict === 'skip') {
      return JobType.SKIP
    } else {
      return JobType.EXIT
    }
  }
}
