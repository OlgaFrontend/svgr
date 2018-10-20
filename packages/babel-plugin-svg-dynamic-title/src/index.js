const elements = ['svg', 'Svg']

const plugin = ({ types: t }) => ({
  visitor: {
    JSXElement(path) {
      if (
        !elements.some(element =>
          path.get('openingElement.name').isJSXIdentifier({ name: element }),
        )
      ) {
        return
      }

      const titleElement = t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier('title'), []),
        t.jsxClosingElement(t.jsxIdentifier('title')),
        [t.jsxExpressionContainer(t.identifier('title'))],
      )

      const hasTitle = path.get('children').some(childPath => {
        if (childPath.node === titleElement) return false
        if (childPath.node.openingElement.name.name !== 'title') return false
        childPath.replaceWith(titleElement)
        return true
      })

      if (!hasTitle) {
        // path.unshiftContainer is not working well :(
        // path.unshiftContainer('children', titleElement)
        path.node.children.unshift(titleElement)
        path.replaceWith(path.node)
      }
    },
  },
})

export default plugin
