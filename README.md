<p align="center">
  <a href="https://reach.tech/router/">
    <img alt="Reach Router" src="./logo-horizontal.png" width="400">
  </a>
</p>

<p align="center">
  Next Generation Routing for <a href="https://facebook.github.io/react">React</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@reach/router"><img src="https://img.shields.io/npm/v/@reach/router.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@reach/router"><img src="https://img.shields.io/npm/dm/@reach/router.svg?style=flat-square"></a>
  <a href="https://travis-ci.org/reach/router"><img src="https://img.shields.io/travis/reach/router/master.svg?style=flat-square"></a>
</p>

## Documentation

[Documentation Site](https://reach.tech/router)

You can also find the docs in the [website directory](./website/src/markdown).

## Code Review

所有代码看下来，感觉没有 react-router 的清晰，也没有它功能强大，更适合没有历史包袱的小型项目。但是代码思路更灵活，比如那个 Redirect。

util 中的 pick 和 resolve 比较有意思，reach-router 的包体积应该更小，因为 history 和 pick 是自己实现的简单版本，理论上代码量应该更少。想到 history 没有 hash 模式。

另外嵌套路由也比较有意思，但是思路其实跟 react-router 中的 switch 比较类似，并没有什么银弹。

- [x] [lib/history.js](./src/lib/history.js)
- [x] [lib/utils.js](./src/lib/utils.js)
- [x] [index.js](./src/index.js)

## Legal

MIT License
Copyright (c) 2018-present, Ryan Florence
