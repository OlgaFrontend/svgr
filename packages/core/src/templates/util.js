export const getProps = ({ types: t }, config) => {
  const props = []

  if (config.ref) {
    props.push(
      t.objectProperty(
        t.identifier('svgRef'),
        t.identifier('svgRef'),
        false,
        true,
      ),
    )
  }

  if (config.titleProp) {
    props.push(
      t.objectProperty(
        t.identifier('title'),
        t.identifier('title'),
        false,
        true,
      ),
    )
  }

  if (config.expandProps) {
    props.push(t.restElement(t.identifier('props')))
  }

  if (props.length === 0) {
    return null
  }

  if (props.length === 1 && config.expandProps) {
    return t.identifier('props')
  }

  return t.objectPattern(props)
}

const getReactNativeSVGComponents = components => {
  if (!components.size) return ''
  const componentsStr = [...components]
    .filter(component => component !== 'Svg')
    .join(', ')
  return `, { ${componentsStr} }`
}

const getReactNativeSVGWarning = components => {
  if (!components.size) return ''
  const componentList = [...components].join(', ')
  return `// SVGR has dropped some elements not supported by react-native-svg: ${componentList}`
}

export const getImport = ({ template }, config, state) => {
  if (!config.native) {
    return template.ast(`import React from 'react'`)
  }
  const {
    reactNativeSvgReplacedComponents = new Set(),
    unsupportedComponents = new Set(),
  } = state

  const components = getReactNativeSVGComponents(
    reactNativeSvgReplacedComponents,
  )
  const warnLog = getReactNativeSVGWarning(unsupportedComponents)

  let result = `import React from 'react';\n`
  result += `import Svg${components} from 'react-native-svg';\n`
  result += warnLog
  return template.ast(result)
}

export const getExport = ({ template }, config, state) => {
  let result = ''
  let exportName = state.componentName

  if (config.ref) {
    exportName = 'ForwardRef'
    result += `const ForwardRef = React.forwardRef((props, ref) => <${
      state.componentName
    } svgRef={ref} {...props} />)\n\n`
  }

  if (state.webpack && state.webpack.previousExport) {
    result += `export default ${state.webpack.previousExport}\n`
    result += `export { ${exportName} as ReactComponent }`
    return template.ast(result)
  }

  if (state.rollup && state.rollup.previousExport) {
    result += `${state.rollup.previousExport}\n`
    result += `export { ${exportName} as ReactComponent }`
    return template.ast(result)
  }

  result += `export default ${exportName}`
  return template.ast(result)
}
