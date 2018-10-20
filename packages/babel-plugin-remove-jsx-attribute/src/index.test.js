import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, options]],
  })

  return result.code
}

describe('plugin', () => {
  it('should remove attribute', () => {
    expect(testPlugin('<div foo bar />', { attributes: [{ name: 'foo' }] }))
      .toMatchInlineSnapshot(`
"\\"use strict\\";

<div bar />;"
`)

    expect(testPlugin('<div foo bar />', { attributes: [{ name: 'bar' }] }))
      .toMatchInlineSnapshot(`
"\\"use strict\\";

<div foo />;"
`)
  })

  it('should be possible to target an element', () => {
    expect(
      testPlugin('<div foo><span foo /></div>', {
        elements: ['span'],
        attributes: [{ name: 'foo' }],
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div><span foo /></div>;"
`)
  })
})
