import unified from 'unified'
import parse from 'rehype-parse'
import vfile from 'vfile'
import hastToBabelAst from 'hast-util-to-babel-ast'
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

  const { code: transformedCode, metadata } = transformFromAstSync(
    babelTree,
    code,
    {
      presets: [['@svgr/babel-preset', config]],
      filename: filePath,
      babelrc: false,
      configFile: false,
    },
  )

  Object.assign(state, metadata)

  return transformedCode
}
