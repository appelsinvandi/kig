import * as fs from 'fs'
import * as path from 'path'
import { GeneratorConfig } from '../types'
import * as paths from './paths'
import { generatorConfigSchema } from '../schemas/generatorConfigSchema'

let _generators: [generatorDirPath: string, generatorConfig: GeneratorConfig][] | null = null
export async function discoverGenerators() {
  if (_generators == null) {
    const GeneratorDirs = fs.readdirSync(paths.templateDir)
    _generators = []
    for (const generatorDir of GeneratorDirs) {
      const generatorDirPath = path.resolve(paths.templateDir, generatorDir)
      const generatorConfigPath = path.resolve(generatorDirPath, 'config.js')

      if (!fs.existsSync(generatorConfigPath)) continue
      const generatorConfig = require(generatorConfigPath) as GeneratorConfig

      const generatorValidationResult = generatorConfigSchema.validate(generatorConfig)
      if (generatorValidationResult.error != null) {
        console.error('There was an error with a generator:')
        console.error(JSON.stringify(generatorValidationResult.error, null, 2))
        continue
      }

      _generators.push([generatorDirPath, generatorValidationResult.value])
    }
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
