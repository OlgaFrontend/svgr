const replaceJSXAttribute = ({ types: t }) => ({
  visitor: {
    JSXAttribute(path, state) {
      const value = path.get('value')
      if (!value.isStringLiteral()) return
      const { values } = state.opts
      Object.keys(values).forEach(key => {
        if (value.node.value === key) {
          path.get('value').replaceWith(t.stringLiteral(values[key]))
        }
      })
    },
  },
})

export default replaceJSXAttribute
