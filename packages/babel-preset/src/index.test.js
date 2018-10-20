import { transform } from '@babel/core'
import preset from '.'

const testPreset = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx'],
    presets: [[preset, options]],
  })

  return result.code
}

describe('preset', () => {
  it('should handle svgProps', () => {
    expect(
      testPreset('<svg />', {
        svgProps: {
          foo: 'bar',
          x: '{y}',
        },
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<svg foo=\\"a\\" x={y} />;"
`)
  })

  it('should handle titleProp', () => {
    expect(
      testPreset('<svg></svg>', {
        titleProp: true,
      }),
    ).toMatchInlineSnapshot(`
"\\"use strict\\";

<svg><title>{title}</title></svg>;"
`)
  })
})
