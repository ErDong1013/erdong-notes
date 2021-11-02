---
title: React Diff
date: 2021-11-02 21:09:23
permalink: /pages/3ecb42/
categories:
  - interview
tags:
  - 
---

# React Diff

## 什么是Diff

在调用 React 的 render() 方法，会创建一棵由 React 元素组成的树。更新时，相同的 render() 方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来进行比较，这个比较的过程就是俗称的 diff 算法。

Diff 算法的本质就是对比 current Fiber（页面中） 和 ReactElement 对象，生成 workInProgress Fiber（内存中）。

## Diff 策略

React 文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中 n 是树中元素的数量。如果在 React 中使用了该算法，那么展示 1000 个元素所需要执行的计算量将在十亿的量级范围。

- 只对同级元素进行 Diff，如果某一个节点在一次更新中跨域了层级，React 不会复用该节点，而是重新创建生成新的节点。
- 两个不同类型的元素会产生出不同的树，如果元素由 div 变为 p，React 会销毁 div 及其子孙节节点，并新建 p 及其子孙节点。
- 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定；


