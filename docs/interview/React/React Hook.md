---
title: React Hook
date: 2021-11-02 21:35:04
permalink: /pages/923ecd/
categories:
  - interview
  - React
tags:
  -
---

# React Hook

## hooks 带来了那些便利

1.  跨组件复用: 其实 render props / HOC 也是为了复用，相比于它们，Hooks 作为官方的底层 API，最为轻量，而且改造成本小，不会影响原来的组件层次结构和传说中的嵌套地狱；
2.  类定义更为复杂

- 不同的生命周期会使逻辑变得分散且混乱，不易维护和管理；
- 时刻需要关注 this 的指向问题；
- 代码复用代价高，高阶组件的使用经常会使整个组件树变得臃肿；

3.  状态与 UI 隔离: 正是由于 Hooks 的特性，状态逻辑会变成更小的粒度，并且极容易被抽象成一个自定义 Hooks，组件中的状态和 UI 变得更为清晰和隔离。
