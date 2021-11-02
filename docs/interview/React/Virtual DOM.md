---
title: Virtual DOM
date: 2021-11-02 20:25:20
permalink: /pages/01047f/
categories:
  - interview
tags:
  -
---

# Virtual DOM

## 操作 DOM 是耗费性能的

浏览器的 渲染线程 与 JS 引擎线程。

我们在操作 DOM 时，任何 DOM API 调用都要先将 JS 数据结构转为 DOM 数据结构，再挂起 JS 引擎线程，启动渲染引擎线程，执行过后再把可能的返回值反转数据结构，再重启 JS 引擎继续执行。这种两个线程之间的上下文切换势必会很耗性能。

另外很多 DOM API 的读写都涉及页面布局的 重绘（repaint）和回流（reflow） ，这会更加的耗费性能。

## 什么是 Virtual DOM

VirtualDom 的本质是利用 JS 变量 对真实 DOM 进行抽象，使用 VirtualDom 来缓存当前组件状态，对用户交互和数据的变动进行批次处理，直接计算出每一帧页面应该呈现的最终状态，而这个状态是以 `JS 变量` 的形式存在于内存中的。所以通过 VirtualDom 既能够保证用户看到的每一帧都响应了数据的变化，又能节约性能保证浏览器不出现卡顿。

React VirtualDom 相对于直接操作原生 DOM 最大的优势在于 batching(批处理) 和 diff。
**diff:** 为了尽量减少不必要的 DOM 操作， Virtual DOM 在执行 DOM 的更新操作后，不会直接操作真实 DOM，而是根据当前应用状态的数据，生成一个全新的 Virtual DOM，然后跟上一次生成 的 Virtual DOM 去 diff，得到一个 Patch（补丁），这样就可以找到变化了的 DOM 节点，只对变化的部分进行 DOM 更新，而不是重新渲染整个 DOM 树，这个过程就是 diff。

**batching：** 还有所谓的 batching 就是将多次比较的结果合并后一次性更新到页面，从而有效地减少页面渲染的次数。

## React Virtual DOM 是如何实现的

- ReactElement：ReactElement 即 react 元素，描述了我们在屏幕上所看到的内容，它是构成 React 应用的最小单元

- Fiber：Fiber 可以理解为是一个执行单元，也可以理解为是一种数据结构。

## Virtual DOM 的工作流程

- 初始化渲染，将 JSX 代码编译成 ReactELement 对象，它描述当前组件内容的数据结构。

- 根据生产的 ReactELement 对象构建 Fiber tree，它包含了组件 schedule、reconciler、render 所需的相关信息。

- 一旦有状态变化，触发更新，Scheduler 在接收到更新后，根据任务的优先级高低来进行调度，决定要执行的任务是什么。

- 接下来的工作交给 Reconciler 处理，Reconciler 通过对比找出变化了的 Virtual DOM ，为其打上代表增/删/更新的标记，当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer。

- Renderer 根据 Reconciler 为 Virtual DOM 打的标记，同步执行对应的 DOM 更新操作。
