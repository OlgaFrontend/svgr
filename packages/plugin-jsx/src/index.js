import unified from 'unified'
import parse from 'rehype-parse'
import vfile from 'vfile'
import hastToBabelAst from '@svgr/hast-util-to-babel-ast'
import { transformFromAstSync } from '@babel/core'

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

  return transformFromAstSync(babelTree, code, {
    caller: {
      name: 'svgr',
    },
    presets: [['@svgr/babel-preset', { ...config, state }]],
    filename: filePath,
    babelrc: false,
    configFile: false,
    code: true,
    ast: false,
  }).code
}
