import { expandState } from './state'
import { loadConfig } from './config'
import { loadPlugin, resolvePlugins } from './plugins'

function run(code, config, state) {
  const expandedState = expandState(state)
  const plugins = resolvePlugins(config, state)
  return plugins.reduce(
    (nextCode, pluginModuleName) => {
      const plugin = loadPlugin(pluginModuleName)
      return plugin(nextCode, config, expandedState)
    },
    // Remove null-byte character (copy/paste from Illustrator)
    String(code).replace('\0', ''),
  )
}

async function convert(code, config = {}, state = {}) {
  config = await loadConfig(config, state)
  return run(code, config, state)
}

convert.sync = (code, config = {}, state = {}) => {
  config = loadConfig.sync(config, state)
  return run(code, config, state)
}

export default convert
