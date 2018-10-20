const removeJSXAttribute = (api, opts) => ({
  visitor: {
    JSXAttribute(path) {
      if (
        opts.elements &&
        !opts.elements.some(
          element =>
            !path.parentPath.get('name').isJSXIdentifier({ name: element }),
        )
      )
        return

      opts.attributes.some(({ name }) => {
        if (Array.isArray(name) && !name.includes(path.node.name.name))
          return false
        if (!path.get('name').isJSXIdentifier({ name })) return false
        path.remove()
        return true
      })
    },
  },
})

export default removeJSXAttribute
