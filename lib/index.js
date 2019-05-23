const path = require('path')
const glob = require("glob")

class MultiModulePlugin {
	constructor(projectName) {

    this.theme = {}
    this.origin = {}
    this.theme_dir = path.join('themes', projectName)

    for (let fname of glob.sync(this.theme_dir + '/**/*', { nodir: true })) {
      this.theme[path.join(__dirname, 'src', fname.substring(this.theme_dir.length))] = path.join(__dirname, fname)
      this.origin[path.join(__dirname, fname)] = path.join(__dirname, 'src', fname.substring(this.theme_dir.length))
    }
	}

	apply(resolver) {

		resolver
			.getHook('relative')
			.tapAsync("LogInfoPlugin", (request, resolveContext, callback) => {
        const log = console.log
        const prefix = "[" + 'relative' + "] "

        if (request.path in this.theme) {
          log(prefix, '[change]', request.path, '=>', request.path.replace(this.theme_dir, 'src'))
          request.path = this.theme[request.path]
          callback(null, request)
        } else {
          if (request.path) {
            const relativePath = path.relative(__dirname, request.path)
            if (!(request.path in this.origin) && relativePath.startsWith(this.theme_dir)) {
              log(prefix, '[change]', request.path, '=>', path.join(__dirname, 'src', relativePath.substring(this.theme_dir.length)))
              request.path = path.join(__dirname, 'src', relativePath.substring(this.theme_dir.length))
              request.relativePath = path.relative(__dirname, request.path)
              return callback(null, request)
            }
          }
          callback()
        }
      })
	}
}

module.exports = MultiModulePlugin