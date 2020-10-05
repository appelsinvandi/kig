export type PromptOptions = PromptOptionsInput | PromptOptionsConfirm | PromptOptionsSelect | PromptOptionsMultiSelect

interface PromptOptionsInput {
  type: 'input'
  message: string
}

interface PromptOptionsConfirm {
  type: 'confirm'
  message: string
}

interface PromptOptionsSelect {
  type: 'select'
  message: string
  choices: string[]
}

interface PromptOptionsMultiSelect {
  type: 'multi-select'
  message: string
  choices: string[]
}
