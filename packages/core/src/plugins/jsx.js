import unified from 'unified'
import parse from 'rehype-parse'
import vfile from 'vfile'
import hastToBabelAst from 'hast-util-to-babel-ast'
import { transformFromAstSync } from '@babel/core'

function configToPlugins(config) {
  const plugins = [
    [
      '@svgr/babel-plugin-remove-jsx-attribute',
      { element: 'svg', attribute: 'xmlns' },
      'removeXmlns',
    ],
    'babel-plugin-remove-jsx-empty-expression',
  ]
  // if (config.replaceAttrValues)
  //   plugins.push(replaceAttrValues(config.replaceAttrValues))
  if (!config.dimensions)
    plugins.push([
      '@svgr/babel-plugin-remove-jsx-attribute',
      { element: 'svg', attribute: ['width', 'height'] },
      'removeDimensions',
    ])
  if (config.icon && config.dimensions)
    plugins.push('@svgr/babel-plugin-svg-em-dimensions')
  if (config.ref)
    plugins.push([
      '@svgr/babel-plugin-add-jsx-attribute',
      {
        element: 'svg',
        name: 'ref',
        value: 'svgRef',
        literal: true,
      },
      'spreadProps',
    ])
  // if (config.svgProps) plugins.push(svgProps(config.svgProps))
  if (config.expandProps)
    plugins.push([
      '@svgr/babel-plugin-add-jsx-attribute',
      {
        element: 'svg',
        name: 'props',
        spread: true,
        position: config.expandProps,
      },
      'spreadProps',
    ])
  if (config.native)
    plugins.push('@svgr/babel-plugin-transform-react-native-svg')
  // if (config.titleProp) plugins.push(titleProp())
  return plugins
}

export default (code, config, state = {}) => {
  const filePath = state.filePath || 'unknown'
  const hastTree = unified()
    .use(parse, {
      fragment: true,
      space: 'svg',
      emitParseErrors: true,
      duplicateAttribute: false,
    })
    .parse(vfile({ path: filePath, contents: code }))

  const babelTree = hastToBabelAst(hastTree)

  const { code: transformedCode } = transformFromAstSync(babelTree, code, {
    plugins: configToPlugins(config),
    filename: filePath,
    babelrc: false,
    configFile: false,
  })

  return transformedCode
}
