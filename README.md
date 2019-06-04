# webpack-multi-themes-plugin
A plugin for enhanced-resolve (in Webpack) that replace relative imports with theme-specific substitutes.

# Install
```npm install --save-dev webpack-multi-themes-plugin```

This is a webpack plugin that allows a project sharing codes among multiple themes.

# Usage
This plugin is mainly designed to use multiple themes in Vue with webpack, but it allows to be used in any project using webpack with similar structure. Logically, once you enable the plugin and specify the theme as YOUR_THEME_NAME, it will replace files in `src` folder with files in `themes/YOUR_THEME_NAME` folder. For implementation, this plugin change the resolving processing in the webpack to work as is.

Below is a project structure example:

```
src
-components
--Hello.vue
-App.vue
themes
-YOUR_THEME_NAME
--components
---Hello.vue
```
and the codes in `src/App.vue` are:

```
...
import Hello from './components/Hello.vue'
...
```

Suppose this plugin is enabled and theme name is `'YOUR_THEME_NAME'`, the file `src/App.vue` will import `themes/YOUR_THEME_NAME/components/Hello.vue` rather than `src/components/Hello.vue`.

You only need to enable the plugin and specify the theme in your webpack configuration, below is an example with vue cli:

```
const MultiThemesPlugin = require('webpack-multi-themes-plugin')

module.exports = {
  chainWebpack: config => {
      config.resolve.plugin('MultiThemesPlugin').use(MultiThemesPlugin, ['YOUR_THEME_NAME', __dirname])
  }
}
```

You can change the `'YOUR_THEME_NAME'` to the specific theme name and the `__dirname` should be the project root path where this plugin to locate `src` and `themes` folders.

