import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, options]],
  })

  return result.code
}

describe('plugin', () => {
  it('should remove empty expression', () => {
    expect(testPlugin('<div>{/* Hello */}<a /></div>', { attribute: 'foo' }))
      .toMatchInlineSnapshot(`
"\\"use strict\\";

<div><a /></div>;"
`)
  })
})
