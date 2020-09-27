import { GeneratorArgs, GeneratorConfig, Job, TemplateHead } from '~/types'
import { discoverTemplates } from './00-discoverTemplates'
import { parseTemplate } from './01-parseTemplate'
import { renderTemplateHead } from './02-renderTemplateHead'
import { parseTemplateHead } from './03-parseTemplateHead'
import { validateTemplateHead } from './04-validateTemplateHead'
import { renderTemplateBody } from './05-renderTemplateBody'
import { generateTemplateJobs } from './06-generateTemplateJobs'

export async function getGeneratorJobs(
  args: GeneratorArgs,
  generatorLocation: string,
  generatorConfig: GeneratorConfig
) {
  if (generatorConfig.hooks?.beforeDiscoverTemplates != null) await generatorConfig.hooks?.beforeDiscoverTemplates(args)
  let templatePaths = discoverTemplates(generatorLocation)
  if (generatorConfig.hooks?.afterDiscoverTemplates != null)
    templatePaths = (await generatorConfig.hooks?.afterDiscoverTemplates(templatePaths, args)) ?? templatePaths

  let rawTemplates = templatePaths.map((p) => parseTemplate(p))
  let templates = await Promise.all(
    rawTemplates.map(async ({ templateHead, templateBody }) => {
      // TODO: Handle errors
      if (generatorConfig.hooks?.beforeParseTemplateHead != null)
        templateHead = (await generatorConfig.hooks?.beforeParseTemplateHead(templateHead, args)) ?? templateHead
      let renderedTemplateHead = renderTemplateHead(templateHead, args)
      let parsedTemplateHead = parseTemplateHead(renderedTemplateHead)
      // TODO: Show validation errors
      let templateHeadValidationResult = validateTemplateHead(parsedTemplateHead)
      let validatedTemplateHead = templateHeadValidationResult.value as TemplateHead
      if (generatorConfig.hooks?.afterParseTemplateHead != null)
        validatedTemplateHead =
          (await generatorConfig.hooks?.afterParseTemplateHead(validatedTemplateHead, args)) ?? validatedTemplateHead

      if (generatorConfig.hooks?.beforeParseTemplateBody != null)
        templateBody =
          (await generatorConfig.hooks?.beforeParseTemplateBody(validatedTemplateHead, templateBody, args)) ??
          templateBody
      let renderedTemplateBody = renderTemplateBody(validatedTemplateHead, templateBody, args)
      if (generatorConfig.hooks?.afterParseTemplateBody != null)
        renderedTemplateBody =
          (await generatorConfig.hooks?.afterParseTemplateBody(validatedTemplateHead, renderedTemplateBody, args)) ??
          renderedTemplateBody

      return {
        templateHead: validatedTemplateHead,
        templateBody: renderedTemplateBody,
      }
    })
  )

  if (generatorConfig.hooks?.beforeGenerateJobQueue != null)
    templates = (await generatorConfig.hooks?.beforeGenerateJobQueue(templates, args)) ?? templates
  let jobs: Job[] = []
  for (const { templateHead, templateBody } of templates) {
    jobs = jobs.concat(await generateTemplateJobs(templateHead, templateBody, jobs))
  }
  if (generatorConfig.hooks?.afterGenerateJobQueue != null)
    jobs = (await generatorConfig.hooks?.afterGenerateJobQueue(jobs, args)) ?? jobs

  return jobs
}
