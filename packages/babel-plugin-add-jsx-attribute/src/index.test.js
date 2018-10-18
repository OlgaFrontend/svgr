import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, options]],
  })

  return result.code
}

describe('plugin', () => {
  it('should add simple attribute', () => {
    expect(
      testPlugin('<div />', {
        element: 'div',
        name: 'disabled',
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div disabled />;"
`)
  })

  it('should add attribute with value', () => {
    expect(
      testPlugin('<div />', {
        element: 'div',
        name: 'disabled',
        value: true,
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div disabled={true} />;"
`)
    expect(
      testPlugin('<div />', {
        element: 'div',
        name: 'disabled',
        value: 'true',
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div disabled=\\"true\\" />;"
`)

    expect(
      testPlugin('<div />', {
        element: 'div',
        name: 'disabled',
        value: 200,
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div disabled={200} />;"
`)
  })

  it('should add literal attribute', () => {
    expect(
      testPlugin('<div />', {
        element: 'div',
        name: 'ref',
        value: 'ref',
        literal: true,
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div ref={ref} />;"
`)
  })

  it('should add spread attribute', () => {
    expect(
      testPlugin('<div><span /></div>', {
        element: 'div',
        spread: true,
        name: 'props',
        position: 'start',
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div {...props}><span /></div>;"
`)

    expect(
      testPlugin('<div><span foo="bar" /></div>', {
        element: 'span',
        spread: true,
        name: 'props',
        position: 'end',
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<div><span foo=\\"bar\\" {...props} /></div>;"
`)
  })
})
