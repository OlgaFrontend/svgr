import { getProps, getImport, getExport } from './util'

function getTemplateCode(api, opts) {
  if (opts.template) return opts.template(api, opts)
  return `IMPORT
  const COMPONENT_NAME = (PROPS) => SVG_ELEMENT
  EXPORT
`
}

const plugin = (api, opts) => ({
  visitor: {
    Program(path, state) {
      const { template, types: t } = api
      const buildTemplate = template(getTemplateCode(api, opts))
      path.node.body = buildTemplate({
        COMPONENT_NAME: t.identifier(opts.state.componentName),
        PROPS: getProps(api, opts, state),
        IMPORT: getImport(api, opts, state),
        EXPORT: getExport(api, opts, state),
        SVG_ELEMENT: path.node.body[0].expression,
      })
      path.replaceWith(path.node)
    },
  },
})

export default plugin
