import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = (code, options) => {
  const result = transform(code, {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, options]],
    babelrc: false,
    configFile: false,
  })

  return result
}

describe('plugin', () => {
  it('should transform wall program', () => {
    const { code } = testPlugin('<svg><div /></svg>', {
      state: { componentName: 'foo' },
    })
    expect(code).toMatchInlineSnapshot(`
"import React from 'react';

const foo = () => <svg><div /></svg>;

export default foo;"
`)
  })
})
