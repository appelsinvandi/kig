import { GeneratorArgs, GeneratorConfig, Job } from '~/types'
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
  const templatePaths = discoverTemplates(generatorLocation)

  const rawTemplates = templatePaths.map((p) => parseTemplate(p))
  const templates = rawTemplates.map(({ templateHead, templateBody }) => {
    // TODO: Handle errors
    const renderedTemplateHead = renderTemplateHead(templateHead, args)
    const parsedTemplateHead = parseTemplateHead(renderedTemplateHead)
    const templateHeadValidationResult = validateTemplateHead(parsedTemplateHead)

    const renderedTemplateBody = renderTemplateBody(parsedTemplateHead, templateBody, args)

    return {
      templateHead: parsedTemplateHead,
      templateBody: renderedTemplateBody,
    }
  })

  let jobs: Job[] = []
  for (const { templateHead, templateBody } of templates) {
    jobs = jobs.concat(await generateTemplateJobs(templateHead, templateBody, jobs))
  }

  return jobs
}
