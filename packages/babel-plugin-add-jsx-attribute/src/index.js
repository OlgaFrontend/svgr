const positionMethod = {
  start: 'unshiftContainer',
  end: 'pushContainer',
}

const addJSXAttribute = ({ types: t }, opts) => {
  function getAttributeValue({ literal, value }) {
    if (typeof value === 'boolean') {
      return t.jsxExpressionContainer(t.booleanLiteral(value))
    }

    if (typeof value === 'number') {
      return t.jsxExpressionContainer(t.numericLiteral(value))
    }

    if (typeof value === 'string' && literal) {
      return t.jsxExpressionContainer(t.identifier(value))
    }

    if (typeof value === 'string') {
      return t.stringLiteral(value)
    }

    return null
  }

  function getAttribute({ spread, name, value, literal }) {
    if (spread) {
      return t.jsxSpreadAttribute(t.identifier(name))
    }

    return t.jsxAttribute(
      t.jsxIdentifier(name),
      getAttributeValue({ value, literal }),
    )
  }

  return {
    visitor: {
      JSXOpeningElement(path) {
        if (
          opts.elements &&
          !opts.elements.some(element =>
            path.get('name').isJSXIdentifier({ name: element }),
          )
        )
          return

        opts.attributes.forEach(
          ({
            name,
            value = null,
            spread = false,
            literal = false,
            position = 'end',
          }) => {
            const method = positionMethod[position]
            const newAttribute = getAttribute({ spread, name, value, literal })
            const attributes = path.get('attributes')

            const isEqualAttribute = attribute => {
              if (spread) {
                return attribute.get('argument').isIdentifier({ name })
              }

              return attribute.get('name').isJSXIdentifier({ name })
            }

            const replaced = attributes.some(attribute => {
              if (!isEqualAttribute(attribute)) return false
              attribute.replaceWith(newAttribute)
              return true
            })

            if (!replaced) {
              path[method]('attributes', newAttribute)
            }
          },
        )
      },
    },
  }
}

export default addJSXAttribute
