import { prompt } from 'enquirer'
import { JobType } from '~/constants'
import { TemplateHeadModeInject } from '~/types'

export async function getEventDestinationNotFoundResolutionType(
  templateHead: TemplateHeadModeInject,
  destinationPath: string
) {
  if (templateHead.on?.destinationNotFound?.action === 'create') {
    return JobType.CREATE
  } else if (templateHead.on?.destinationNotFound?.action === 'skip') {
    return JobType.SKIP
  } else if (templateHead.on?.destinationNotFound?.action === 'exit') {
    return JobType.EXIT
  } else {
    const answer = (await prompt({
      name: 'destinationNotFound',
      type: 'autocomplete',
      message: `Tried to inject into file: ${destinationPath}\nThe file is missing, how would you like to proceed?`,
      choices: ['create', 'skip'],
    })) as { destinationNotFound: 'create' | 'skip' }

    if (answer.destinationNotFound === 'create') {
      return JobType.CREATE
    } else if (answer.destinationNotFound === 'skip') {
      return JobType.SKIP
    } else {
      return JobType.EXIT
    }
  }
}
