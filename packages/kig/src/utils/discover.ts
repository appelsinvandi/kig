import * as fs from 'fs'
import * as path from 'path'
import { GeneratorConfig } from '../types'
import * as paths from './paths'
import { generatorConfigSchema } from '../schemas/generatorConfigSchema'

let _generators: [generatorDirPath: string, generatorConfig: GeneratorConfig][] | null = null
export async function discoverGenerators() {
  if (_generators == null) {
    _generators = fs
      .readdirSync(paths.templateDir)
      .map((e) => path.resolve(paths.templateDir, e))
      .filter((p) => fs.existsSync(path.resolve(p, 'config.js')))
      .map((p) => [p, require(path.resolve(p, 'config.js')) as GeneratorConfig])
      .filter(([, gConfig]) => !generatorConfigSchema.validate(gConfig).error) as [
      generatorDirPath: string,
      generatorConfig: GeneratorConfig
    ][]
  }

  return _generators
}

let _editorConfig: string | null = null
export async function discoverEditorConfig() {
  if (_editorConfig == null) {
    const editorConfigPath = await walker(paths.workingDir)
    _editorConfig = editorConfigPath != null ? fs.readFileSync(editorConfigPath).toString() : ''
  }

  return _editorConfig

  async function walker(dirPath: string) {
    const editorConfigPath = path.resolve(dirPath, '.editorconfig')

    if (fs.existsSync(editorConfigPath) && fs.lstatSync(editorConfigPath).isFile()) return dirPath
    else if (path.resolve(dirPath, '..') === dirPath) return null
    else return walker(path.resolve(dirPath, '..'))
  }
}
