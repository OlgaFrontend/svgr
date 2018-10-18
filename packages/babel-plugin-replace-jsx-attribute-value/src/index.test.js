import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, options]],
  })

  return result.code
}

describe('plugin', () => {
  it('should replace attribute values', () => {
    expect(
      testPlugin('<div something="cool" />', {
        values: {
          cool: 'not cool',
        },
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div something=\\"not cool\\" />;"
`)
  })
})
