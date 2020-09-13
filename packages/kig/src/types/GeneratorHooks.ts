import { GeneratorArgs } from './GeneratorArg'
import { Job } from './Job'
import { TemplateHead } from './TemplateHead'

type PromiseOrValue<T> = T | Promise<T>

export interface GeneratorHooks {
  onStart?: () => PromiseOrValue<void>
  beforeArgsParser?: (args: { [key: string]: string }) => PromiseOrValue<{ [key: string]: string }>
  afterArgsParser?: (args: GeneratorArgs) => PromiseOrValue<GeneratorArgs>
  beforeDiscoverTemplates?: (args: GeneratorArgs) => PromiseOrValue<void>
  afterDiscoverTemplates?: (templatePaths: string[], args: GeneratorArgs) => PromiseOrValue<string[]>
  beforeParseTemplateHead?: (rawTemplateHead: string, args: GeneratorArgs) => PromiseOrValue<string>
  afterParseTemplateHead?: (templateHead: TemplateHead, args: GeneratorArgs) => PromiseOrValue<TemplateHead>
  beforeParseTemplateBody?: (
    templateHead: TemplateHead,
    rawTemplateBody: string,
    args: GeneratorArgs
  ) => PromiseOrValue<string>
  afterParseTemplateBody?: (
    templateHead: TemplateHead,
    templateBody: string,
    args: GeneratorArgs
  ) => PromiseOrValue<string>
  beforeGenerateJobQueue?: (
    templates: { templateHead: TemplateHead; templateBody: string }[],
    args: GeneratorArgs
  ) => PromiseOrValue<{ templateHead: TemplateHead; templateBody: string }[]>
  afterGenerateJobQueue?: (jobsQueue: Job[], args: GeneratorArgs) => PromiseOrValue<Job[]>
  onEnd?: () => PromiseOrValue<void>
}
