export const getProps = ({ types: t }, opts) => {
  const props = []

  if (opts.ref) {
    props.push(
      t.objectProperty(
        t.identifier('svgRef'),
        t.identifier('svgRef'),
        false,
        true,
      ),
    )
  }

  if (opts.titleProp) {
    props.push(
      t.objectProperty(
        t.identifier('title'),
        t.identifier('title'),
        false,
        true,
      ),
    )
  }

  if (opts.expandProps) {
    props.push(t.restElement(t.identifier('props')))
  }

  if (props.length === 0) {
    return null
  }

  if (props.length === 1 && opts.expandProps) {
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

export const getImport = ({ template }, opts, state) => {
  if (!opts.native) {
    return template.ast(`import React from 'react'`)
  }

  const {
    reactNativeSvgReplacedComponents = new Set(),
    unsupportedComponents = new Set(),
  } = state.file.metadata

  const components = getReactNativeSVGComponents(
    reactNativeSvgReplacedComponents,
  )
  const warnLog = getReactNativeSVGWarning(unsupportedComponents)

  let result = `import React from 'react';\n`
  result += `import Svg${components} from 'react-native-svg';\n`
  result += warnLog
  return template.ast(result)
}

export const getExport = ({ template }, opts) => {
  let result = ''
  let exportName = opts.state.componentName

  if (opts.ref) {
    exportName = 'ForwardRef'
    result += `const ForwardRef = React.forwardRef((props, ref) => <${
      opts.state.componentName
    } svgRef={ref} {...props} />)\n\n`
  }

  if (opts.state.webpack && opts.state.webpack.previousExport) {
    result += `export default ${opts.state.webpack.previousExport}\n`
    result += `export { ${exportName} as ReactComponent }`
    return template.ast(result)
  }

  if (opts.state.rollup && opts.state.rollup.previousExport) {
    result += `${opts.state.rollup.previousExport}\n`
    result += `export { ${exportName} as ReactComponent }`
    return template.ast(result)
  }

  result += `export default ${exportName}`
  return template.ast(result)
}
