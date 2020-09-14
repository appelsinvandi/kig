import * as fs from 'fs'
import * as path from 'path'

export function discoverTemplates(generatorLocation: string) {
  return scan(generatorLocation)

  // TODO: Make more memory efficient
  function scan(dirPath: string) {
    const dirContents = fs.readdirSync(dirPath)

    let templateFiles: string[] = []
    for (const contentName of dirContents) {
      let contentPath = path.resolve(dirPath, contentName)

      if (fs.lstatSync(contentPath).isDirectory()) {
        templateFiles = templateFiles.concat(scan(contentPath))
      } else if (contentName.endsWith('.t.ejs')) {
        templateFiles = templateFiles.concat(contentPath)
      }
    }

    return templateFiles
  }
}
