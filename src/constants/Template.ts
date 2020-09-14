export enum TemplateMode {
  CREATE = 'create',
  INJECT = 'inject',
}

export enum TemplateEvent {
  CONFLICT = 'conflict',
  DESTINATION_NOT_FOUND = 'destinationNotFound',
  NO_LOCATION_MATCH = 'noLocationMatch',
}

export enum TemplateSkipMode {
  CONDITIONAL = 'conditional',
  SEARCH = 'search',
  REGEX = 'regex',
}

export enum TemplateLocationMode {
  APPEND = 'append',
  PREPEND = 'prepend',
  LINE = 'line',
  SEARCH = 'search',
  REGEX = 'regex',
}

export enum TemplateLocationPlacement {
  BEFORE = 'before',
  REPLACE = 'replace',
  AFTER = 'after',
}
