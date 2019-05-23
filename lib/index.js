const path = require('path')
const glob = require("glob")

class MultiModulePlugin {
  constructor(projectName, root_path) {
    console.log('[MultiModulePlugin]')
    this.theme = {}
    this.origin = {}
    this.theme_dir = path.join('themes', projectName)
    this.root_path = root_path

    for (let fname of glob.sync(this.theme_dir + '/**/*', { nodir: true })) {
      this.theme[path.join(this.root_path, 'src', fname.substring(this.theme_dir.length))] = path.join(this.root_path, fname)
      this.origin[path.join(this.root_path, fname)] = path.join(this.root_path, 'src', fname.substring(this.theme_dir.length))
    }
  }

  apply(resolver) {
    resolver
      .getHook('relative')
      .tapAsync("MultiModulePlugin", (request, resolveContext, callback) => {
        const log = console.log
        const prefix = "[" + 'relative' + "] "

        if (request.path in this.theme) {
          log(prefix, '[change]', request.path, '=>', request.path.replace(this.theme_dir, 'src'))
          request.path = this.theme[request.path]
          callback(null, request)
        } else {
          if (request.path) {
            const relativePath = path.relative(this.root_path, request.path)
            if (!(request.path in this.origin) && relativePath.startsWith(this.theme_dir)) {
              log(prefix, '[change]', request.path, '=>', path.join(this.root_path, 'src', relativePath.substring(this.theme_dir.length)))
              request.path = path.join(this.root_path, 'src', relativePath.substring(this.theme_dir.length))
              request.relativePath = path.relative(this.root_path, request.path)
              return callback(null, request)
            }
          }
          callback()
        }
      })
  }
}

module.exports = MultiModulePlugin
