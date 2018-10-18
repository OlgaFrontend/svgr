const elementToComponent = {
  svg: 'Svg',
  circle: 'Circle',
  clipPath: 'ClipPath',
  ellipse: 'Ellipse',
  g: 'G',
  linearGradient: 'LinearGradient',
  radialGradient: 'RadialGradient',
  line: 'Line',
  path: 'Path',
  pattern: 'Pattern',
  polygon: 'Polygon',
  polyline: 'Polyline',
  rect: 'Rect',
  symbol: 'Symbol',
  text: 'Text',
  textPath: 'TextPath',
  tspan: 'TSpan',
  use: 'Use',
  defs: 'Defs',
  stop: 'Stop',
  mask: 'Mask',
  image: 'Image',
}

const transformReactNativeSVG = ({ types: t }) => ({
  visitor: {
    JSXElement(path, state) {
      const { metadata } = state.file
      const { name } = path.node.openingElement.name

      // Replace element by react-native-svg components
      const component = elementToComponent[name]

      if (component) {
        const openingElementName = path.get('openingElement.name')
        openingElementName.replaceWith(t.jsxIdentifier(component))
        const closingElementName = path.get('closingElement.name')
        closingElementName.replaceWith(t.jsxIdentifier(component))
        metadata.reactNativeSvgReplacedComponents =
          metadata.reactNativeSvgReplacedComponents || new Set()
        metadata.reactNativeSvgReplacedComponents.add(component)
        return
      }

      // Remove element if not supported
      metadata.unsupportedComponents =
        metadata.unsupportedComponents || new Set()
      metadata.unsupportedComponents.add(name)
      path.remove()
    },
  },
})

export default transformReactNativeSVG
