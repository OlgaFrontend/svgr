const removeJSXEmptyExpression = () => ({
  visitor: {
    JSXExpressionContainer(path) {
      if (path.node.expression.type === 'JSXEmptyExpression') {
        path.remove()
      }
    },
  },
})

export default removeJSXEmptyExpression
