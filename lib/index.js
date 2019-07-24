const path = require('path')
const glob = require("glob")

class MultiThemesPlugin {
  constructor(projectName, root_path) {
    console.log('[MultiThemesPlugin]')
    console.log('root_path', root_path)
    this.theme = {}
    this.origin = {}
    this.theme_dir = path.join(root_path, 'themes', projectName)
    this.root_path = root_path

    for (let fname of glob.sync(this.theme_dir + '/**/*', { nodir: true })) {
      let target = path.join(this.root_path, 'src', fname.substring(this.theme_dir.length))
      fname = path.join(fname) // convert *nix path to system path
      this.theme[target] = fname
      this.origin[fname] = target
    }
  }

  apply(resolver) {
    resolver
      .getHook('file')
      .tapAsync("MultiModulePlugin", (request, resolveContext, callback) => {
        const log = console.log
        const prefix = "[" + 'file' + "] "

        //log(prefix, '[hitting]', request.path, '=>', this.theme[request.path])
        if (request.path in this.theme) {
          log(prefix, '[substitute]', request.path, '=>', this.theme[request.path])
          request.path = this.theme[request.path]
          callback(null, request)
        } else {
          if (request.path) {
            //console.log('[here]', request.path);
            const relativePath = path.relative(this.theme_dir, request.path);
            if (!(request.path in this.origin) && !relativePath.startsWith('..')) {
              log(prefix, '[substitute]', request.path, '=>', path.join(this.root_path, 'src', relativePath.substring(this.theme_dir.length)))
              request.path = path.join(this.root_path, 'src', relativePath)
              request.relativePath = path.relative(this.root_path, request.path)
              return resolver.doResolve('rawFile', request, null, resolveContext, callback);
            }
          }
          callback()
        }
      })

    resolver
      .getHook('directory')
      .tapAsync("MultiModulePlugin", (request, resolveContext, callback) => {
        const log = console.log
        const prefix = "[" + 'directory' + "] "

        if (request.path) {
          const relativePath = path.relative(this.theme_dir, request.path);
          if (!(request.path in this.origin) && !relativePath.startsWith('..')) {
            log(prefix, '[substitute]', request.path, '=>', path.join(this.root_path, 'src', relativePath.substring(this.theme_dir.length)))
            request.path = path.join(this.root_path, 'src', relativePath)
            request.relativePath = path.relative(this.root_path, request.path)
            return resolver.doResolve('directory', request, null, resolveContext, callback);
          }
        }
        callback()
      })
  }
}

module.exports = MultiThemesPlugin
