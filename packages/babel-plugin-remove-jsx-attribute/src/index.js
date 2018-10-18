const removeJSXAttribute = () => ({
  visitor: {
    JSXAttribute(path, state) {
      const { attribute, element } = state.opts
      if (element && path.parent.name.name !== element) return
      if (Array.isArray(attribute) && !attribute.includes(path.node.name.name))
        return
      if (path.node.name.name !== attribute) return

      path.remove()
    },
  },
})

export default removeJSXAttribute
