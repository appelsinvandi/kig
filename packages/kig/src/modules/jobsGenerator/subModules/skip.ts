import { TemplateSkipMode } from '~/constants'
import { TemplatePropertySkip } from '~/types'

export function resolveSkip(skip: TemplatePropertySkip, destinationBody?: string) {
  if (skip.mode === TemplateSkipMode.CONDITIONAL) {
    return Boolean(skip.shouldSkip)
  } else if (destinationBody == null) {
    return false
  } else if (skip.mode === TemplateSkipMode.SEARCH) {
    const isMatch = destinationBody.includes(skip.search)
    if (skip.skipOn === 'noMatch') {
      return !isMatch
    } else {
      return isMatch
    }
  } else if (skip.mode === TemplateSkipMode.REGEX) {
    const isMatch = Boolean(destinationBody.match(new RegExp(skip.pattern, skip.flags)))
    if (skip.skipOn === 'noMatch') {
      return !isMatch
    } else {
      return isMatch
    }
  }

  return true
}
