import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, options]],
  })

  return result
}

describe('plugin', () => {
  it('should transform elements', () => {
    const { code, metadata } = testPlugin('<svg><div /></svg>')
    expect(metadata.reactNativeSvgReplacedComponents.size).toBe(1)
    expect(metadata.unsupportedComponents.size).toBe(1)
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";

<Svg></Svg>;"
`)
  })
})
