const requiredAttributes = ['width', 'height']
const attributeValue = '1em'

const svgIcon = ({ types: t }) => ({
  visitor: {
    JSXOpeningElement: {
      enter(path) {
        if (path.node.name.name !== 'svg') return
        const addedAttributes = []
        path.traverse({
          JSXAttribute(attributePath) {
            const { name } = attributePath.node.name
            if (requiredAttributes.includes(name)) {
              const value = attributePath.get('value')
              value.replaceWith(t.stringLiteral(attributeValue))
              addedAttributes.push(name)
            }
          },
        })

        requiredAttributes.forEach(attribute => {
          if (addedAttributes.includes(attribute)) return
          path.pushContainer(
            'attributes',
            t.jsxAttribute(
              t.jsxIdentifier(attribute),
              t.stringLiteral(attributeValue),
            ),
          )
        })
      },
    },
  },
})

export default svgIcon
