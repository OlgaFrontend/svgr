# @svgr/webpack

[![Build Status][build-badge]][build]
[![version][version-badge]][package]
[![MIT License][license-badge]][license]

Webpack loader for SVGR.

```
npm install @svgr/webpack
```

## Usage

In your `webpack.config.js`:

```js
{
  test: /\.svg$/,
  use: ['@svgr/webpack'],
}
```

In your code:

```js
import Star from './star.svg'

const App = () => (
  <div>
    <Star />
  </div>
)
```

### Passing options

```js
{
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
      options: {
        native: true,
      },
    },
  ],
}
```

### Using with `url-loader` or `file-loader`

It is possible to use it with [`url-loader`](https://github.com/webpack-contrib/url-loader) or [`file-loader`](https://github.com/webpack-contrib/file-loader).

In your `webpack.config.js`:

```js
{
  test: /\.svg$/,
  use: ['@svgr/webpack', 'url-loader'],
}
```

In your code:

```js
import starUrl, { ReactComponent as Star } from './star.svg'

const App = () => (
  <div>
    <img src={starUrl} alt="star" />
    <Star />
  </div>
)
```

### Use your own Babel configuration

By default, `@svgr/webpack` includes a `babel-loader` with [optimized configuration](https://github.com/smooth-code/svgr/blob/master/packages/webpack/src/index.js). In some case you may want to apply a custom one (if you are using Preact for an example). You can turn off Babel transformation by specifying `babel: false` in options.

```js
// Example using preact
{
  test: /\.svg$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['preact', 'env'],
      },
    },
    {
      loader: '@svgr/webpack',
      options: { babel: false },
    }
  ],
}
```

### Handle SVG in CSS, Sass or Less

It is possible to detect the module that requires your SVG using [`Rule.issuer`](https://webpack.js.org/configuration/module/#rule-issuer) in Webpack. Using it you can specify two different configurations for JavaScript and the rest of your files.

```js
{
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    issuer: {
      test: /\.jsx?$/
    },
    use: ['babel-loader', '@svgr/webpack', 'url-loader']
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader'
  },
}
```

## License

MIT

[build-badge]: https://img.shields.io/travis/smooth-code/svgr.svg?style=flat-square
[build]: https://travis-ci.org/smooth-code/svgr
[version-badge]: https://img.shields.io/npm/v/@svgr/webpack.svg?style=flat-square
[package]: https://www.npmjs.com/package/@svgr/webpack
[license-badge]: https://img.shields.io/npm/l/@svgr/webpack.svg?style=flat-square
[license]: https://github.com/smooth-code/svgr/blob/master/LICENSE
