---
title: React Virtual DOM
date: 2021-09-17 22:19:11
permalink: /pages/1f970b/
categories:
  - note
  - MV*
  - React
tags:
  - 
---

# ReactVirtualDOM
> 部分内容整理自网络资源
## 操作 DOM 是耗费性能的

由于 JS 是可操纵 DOM 的，如果在修改这些元素属性同时渲染界面（即 JS 线程和渲染线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。因此为了防止渲染出现不可预期的结果，浏览器设置 **渲染线程** 与 **JS 引擎线程** 为互斥的关系，当 JS 引擎执行时渲染线程会被挂起，GUI 更新则会被保存在一个队列中等到 JS 引擎线程空闲时立即被执行。

因此我们在操作 DOM 时，任何 DOM API 调用都要先将 JS 数据结构转为 DOM 数据结构，再挂起 JS 引擎线程并启动渲染引擎线程，执行过后再把可能的返回值反转数据结构，重启 JS 引擎继续执行。这种两个线程之间的上下文切换势必会很耗性能。

另外很多 DOM API 的读写都涉及页面布局的 **重绘（repaint）**和**回流（reflow）** ，这会更加的耗费性能。

综上所述，单次 DOM API 调用性能就不够好，频繁调用就会迅速积累上述损耗，但我们又不可能不去操作 DOM，因此解决问题的本质是要 **减少不必要的 DOM API 调用**。

## 什么是Virtual DOM

**React.js 相对于直接操作原生 DOM 最大的优势在于 batching 和 diff。**

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64a9c597bce949a7ba68ab0531e5f8a0~tplv-k3u1fbpfcp-watermark.image?)

VirtualDom 的本质是利用 **JS 变量** 对真实 DOM 进行抽象，既然每一次操作 DOM 都可能触发浏览器的重排消耗性能，那么就可以使用 VirtualDom 来缓存当前组件状态，对用户交互和数据的变动进行批次处理，直接计算出每一帧页面应该呈现的最终状态，而这个状态是以 **JS 变量** 的形式存在于内存中的。所以通过 VirtualDom 既能够保证用户看到的每一帧都响应了数据的变化，又能节约性能保证浏览器不出现卡顿。

React.js 相对于直接操作原生 DOM 最大的优势在于 batching 和 diff。为了尽量减少不必要的 DOM 操作， Virtual DOM 在执行 DOM 的更新操作后，不会直接操作真实 DOM，而是根据当前应用状态的数据，生成一个全新的 Virtual DOM，然后跟上一次生成 的 Virtual DOM 去 diff，得到一个 Patch，这样就可以找到变化了的 DOM 节点，只对变化的部分进行 DOM 更新，而不是重新渲染整个 DOM 树，这个过程就是 diff。还有所谓的`batching`就是将多次比较的结果合并后一次性更新到页面，从而有效地减少页面渲染的次数，提高渲染效率。batching 或者 diff, 说到底，都是为了尽量减少对 DOM 的调用。

## Virtual DOM 的优势

1.  为函数式的 UI 编程方式打开了大门，我们不需要再去考虑具体 DOM 的操作，框架已经替我们做了，我们就可以用更加声明式的方式书写代码。
1.  减少页面渲染的次数，提高渲染效率。
1.  提供了更好的跨平台的能力，因为 virtual DOM 是以 JavaScript 对象为基础而不依赖具体的平台环境，因此可以适用于其他的平台，如 node、weex、native 等。

## ReactElement

1.  ReactElement 是通过 createElement 函数创建的。
1.  createElement 函数接收 3 个参数，分别是 type, config, children

- type 指代这个 ReactElement 的类型，它可以是 DOM 元素类型，也可以是 React 组件类型。
- config 即是传入的 元素上的属性组成的对象。
- children 是一个数组，代表该元素的子元素。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca1c965a120b47d0a86a2ad5f1267e05~tplv-k3u1fbpfcp-watermark.image?)

- **$$typeof** 是一个常量 REACT_ELEMENT_TYPE，所有通过 React.createElement 生成的元素都有这个值，用来表示这是一个 React 元素。它还有一个取值，通过 createPortals 函数生成的 $$typeof 值就是 REACT_PORTAL_TYPE。
- key 和 ref 从 config 对象中作为一个特殊的配置，被单独抽取出来，放在 ReactElement 下。
- props 包含了两部分，第一部分是去除了 key 和 ref 的 config，第二部分是 children 数组，数组的成员也是通过 React.createElement 生成的对象。
- \_owner 就是 Fiber。

## Virtual DOM 安全

`$$typeof` ，这个属性会指向 `Symbol(React.element)` 。作为 **React** 元素的唯一标识的同时，这个标签也承担了安全方面的功能。我们已经知道了所谓的 ReactElement 其实就是一个 JS 对象。那么如果有用户恶意的向服务端数据库中存入了某个有侵入性功能的 **伪 React** 对象，在实际渲染过程中被当做页面元素渲染，那么将有可能威胁到用户的安全。而 `Symbol` 是无法在数据库中被存储的，换句话说， **React** 所渲染的所有元素，都必须是由 JSX 编译的拥有 `Symbol` 标识的元素。（如果在低版本不支持 Symbol 的浏览器中，将会使用字符串替代，也就没有这层安排保护了）