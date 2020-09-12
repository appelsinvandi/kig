import { TemplateLocationPlacement, TemplateMode } from '~/constants'

type ArrayOrNot<T> = T | T[]

export type TemplateHead = TemplateHeadModeCreate | TemplateHeadModeInject
export interface TemplateHeadModeCreate {
  mode: TemplateMode.CREATE
  destination: ArrayOrNot<string>
  skip?: ArrayOrNot<TemplatePropertySkipConditional>
  trim?: ArrayOrNot<TemplatePropertyTrim>
  on?: {
    conflict?: {
      action: 'ask' | 'override' | 'skip'
      message?: string
    }
  }
  variables?: { [key: string]: string }
}
export interface TemplateHeadModeInject {
  mode: TemplateMode.INJECT
  destination: ArrayOrNot<string>
  location: TemplatePropertyLocation
  skip?: ArrayOrNot<TemplatePropertySkipConditional | TemplatePropertySkipRegex | TemplatePropertySkipSearch>
  trim?: ArrayOrNot<TemplatePropertyTrim>
  on?: {
    destinationNotFound?: TemplatePropertyEventDestinationNotFound
    noLocationMatch?: TemplatePropertyEventNoLocationMatch
  }
  variables?: { [key: string]: string }
}

export type TemplatePropertyTrim = 'leading' | 'trailing'

export type TemplatePropertyEventNoLocationMatch =
  | TemplatePropertyEventNoLocationMatchExit
  | TemplatePropertyEventNoLocationMatchSkip
  | TemplatePropertyEventNoLocationMatchFallback
export interface TemplatePropertyEventNoLocationMatchExit {
  action: 'exit'
  message?: string
}
export interface TemplatePropertyEventNoLocationMatchSkip {
  action: 'skip'
  message?: string
}
export interface TemplatePropertyEventNoLocationMatchFallback {
  action: 'fallback'
  location: TemplatePropertyLocation
  message?: string
}

export type TemplatePropertyEventDestinationNotFound =
  | TemplatePropertyEventDestinationNotFoundExit
  | TemplatePropertyEventDestinationNotFoundSkip
  | TemplatePropertyEventDestinationNotFoundCreate
interface TemplatePropertyEventDestinationNotFoundExit {
  action: 'exit'
  message?: string
}
interface TemplatePropertyEventDestinationNotFoundSkip {
  action: 'skip'
  message?: string
}
interface TemplatePropertyEventDestinationNotFoundCreate {
  action: 'create'
  message?: string
}

export type TemplatePropertySkip =
  | TemplatePropertySkipConditional
  | TemplatePropertySkipRegex
  | TemplatePropertySkipSearch
interface TemplatePropertySkipConditional {
  mode: 'conditional'
  shouldSkip: boolean
}
interface TemplatePropertySkipSearch {
  mode: 'search'
  skipOn: 'match' | 'noMatch'
  search: string
}
interface TemplatePropertySkipRegex {
  mode: 'regex'
  skipOn: 'match' | 'noMatch'
  pattern: string
  flags: string
}

export type TemplatePropertyLocation =
  | TemplatePropertyLocationAppend
  | TemplatePropertyLocationPrepend
  | TemplatePropertyLocationLine
  | TemplatePropertyLocationRegex
  | TemplatePropertyLocationSearch
export interface TemplatePropertyLocationAppend {
  mode: 'append'
}
export interface TemplatePropertyLocationPrepend {
  mode: 'prepend'
}
export interface TemplatePropertyLocationLine {
  mode: 'line'
  placement: TemplateLocationPlacement
  line: number
}
export interface TemplatePropertyLocationSearch {
  mode: 'search'
  placement: TemplateLocationPlacement
  text: string
}
export interface TemplatePropertyLocationRegex {
  mode: 'regex'
  placement: TemplateLocationPlacement
  pattern: string
  flags: string
}
