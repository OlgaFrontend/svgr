function propsToAttributes(props) {
  return Object.keys(props).map(name => {
    const value = props[name]
    const literal =
      typeof value === 'string' && value.startsWith('{') && value.endsWith('}')

    return { name, value: value.slice(1, -1), literal }
  })
}

const plugin = (api, opts) => {
  let toRemoveAttributes = ['xmlns', 'xmlnsXlink', 'version']
  let toAddAttributes = []

  if (opts.svgProps) {
    toAddAttributes = [...toAddAttributes, ...propsToAttributes(opts.svgProps)]
  }

  if (opts.ref) {
    toAddAttributes = [
      ...toAddAttributes,
      {
        name: 'ref',
        value: 'svgRef',
        literal: true,
      },
    ]
  }

  if (opts.expandProps) {
    toAddAttributes = [
      ...toAddAttributes,
      {
        name: 'props',
        spread: true,
        position: opts.expandProps,
      },
    ]
  }

  if (!opts.dimensions) {
    toRemoveAttributes = [...toRemoveAttributes, 'width', 'height']
  }

  const plugins = [
    ['@svgr/babel-plugin-transform-svg-component', opts],
    [
      '@svgr/babel-plugin-remove-jsx-attribute',
      { elements: ['svg', 'Svg'], attributes: toRemoveAttributes },
    ],
    [
      '@svgr/babel-plugin-add-jsx-attribute',
      { elements: ['svg', 'Svg'], attributes: toAddAttributes },
    ],
    '@svgr/babel-plugin-remove-jsx-empty-expression',
  ]

  if (opts.replaceAttrValues) {
    plugins.push([
      '@svgr/babel-plugin-replace-jsx-attribute-value',
      { values: opts.replaceAttrValues },
    ])
  }

  if (opts.icon && opts.dimensions) {
    plugins.push('@svgr/babel-plugin-svg-em-dimensions')
  }

  if (opts.titleProp) {
    plugins.push('@svgr/babel-plugin-svg-dynamic-title')
  }

  if (opts.native) {
    plugins.push('@svgr/babel-plugin-transform-react-native-svg')
  }

  return { plugins }
}

export default plugin
