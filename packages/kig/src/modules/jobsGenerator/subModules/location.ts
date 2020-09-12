import { JobType } from '~/constants'
import { Job, TemplateHeadModeInject } from '~/types'
import { joinSplitLines } from '~/utils/joinSplitLines'

export function resolveLocation(
  templateHead: TemplateHeadModeInject,
  templateBody: string,
  destinationPath: string,
  destinationBody: string,
  fallback: boolean = false
): Job {
  const splitDestinationBody = destinationBody.split(/\r?\n/)
  const splitTemplateBody = templateBody.split(/\r?\n/)

  const location =
    fallback && templateHead.on?.noLocationMatch?.action === 'fallback'
      ? templateHead.on.noLocationMatch.location
      : templateHead.location
  let locatedLine = -1
  if (location.mode === 'prepend') {
    return {
      type: JobType.INJECT,
      destination: destinationPath,
      body: joinSplitLines([...splitTemplateBody, ...splitDestinationBody]),
    }
  } else if (location.mode === 'append') {
    return {
      type: JobType.INJECT,
      destination: destinationPath,
      body: joinSplitLines([...splitDestinationBody, ...splitTemplateBody]),
    }
  } else if (location.mode === 'line') {
    locatedLine = location.line
  } else if (location.mode === 'search') {
    locatedLine = splitDestinationBody.findIndex((l) => l.includes(location.text))
  } else if (location.mode === 'regex') {
    locatedLine = splitDestinationBody.findIndex((l) => Boolean(l.match(new RegExp(location.pattern, location.flags))))
  }

  if (locatedLine > -1) {
    const splitLineStart = location.placement === 'after' ? locatedLine + 1 : locatedLine
    const splitLineEnd = location.placement === 'replace' ? splitLineStart + 1 : splitLineStart

    return {
      type: JobType.INJECT,
      destination: destinationPath,
      body: joinSplitLines([
        ...splitDestinationBody.slice(0, splitLineStart),
        ...splitTemplateBody,
        ...splitDestinationBody.slice(splitLineEnd, destinationBody.length),
      ]),
    }
  } else if (!fallback) {
    return resolveLocation(templateHead, templateBody, destinationPath, destinationBody, true)
  } else {
    return {
      type: JobType.EXIT,
      destination: destinationPath,
      message: templateHead.on?.noLocationMatch?.message ?? "Couldn't find location or fallback location",
    }
  }
}
