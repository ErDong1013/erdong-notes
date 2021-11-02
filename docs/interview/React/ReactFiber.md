---
title: ReactFiber
date: 2021-11-02 20:06:49
permalink: /pages/703160/
categories:
  - interview
tags:
  -
---

# React Fiber

## 为什么需要 Fiber

首先，在浏览器中，页面是一帧一帧绘制出来的，目前浏览器大多是 60Hz（60 帧/s），每一帧耗时也就是在 16ms 左右，js 引擎和页面渲染引擎是在同一个渲染线程之内，两者是互斥关系。如果在某个阶段执行任务特别长，超过了 16ms，那么就会阻塞页面的渲染，从而出现卡顿现象。

在未引入 Fiber 架构之前，react 会采用递归对比虚拟 DOM 树，找出需要变动的节点，然后同步更新它们，这种遍历是递归调用，执行栈会越来越深，而且不能中断，中断后就不能恢复了。递归如果非常深，就会十分卡顿。

Fiber ，把渲染/更新过程拆分为一个个小块的任务，再将多个粒度小的任务放入一个时间切片（一帧）中执行的一种方案，合理的调度机制来调控时间，适时地让出 CPU 执行权，可以让浏览器及时地响应用户的交互。

## 什么是 Fiber

Fiber 可以理解为是一个执行单元，也可以理解为是一种数据结构。

### 一个执行单元

Fiber 可以理解为一个执行单元，每次执行完一个执行单元，react 就会检查现在还剩多少时间，如果没有时间则将控制权让出去。

首先 React 向浏览器请求调度，浏览器在一帧中如果还有空闲时间，会去判断是否存在待执行任务，不存在就直接将控制权交给浏览器，如果存在就会执行对应的任务，执行完成后会判断是否还有时间，有时间且有待执行任务则会继续执行下一个任务，否则就会将控制权交给浏览器。

### 一种数据结构

Fiber 还可以理解为是一种数据结构，React Fiber 就是采用链表实现的。每个 Virtual DOM 都可以表示为一个 fiber，每个节点都是一个 fiber。

## Fiber 执行原理

从根节点开始渲染和调度的过程可以分为两个阶段：render 阶段、commit 阶段。

- render 阶段：这个阶段是可中断的，会找出所有节点的变更
- commit 阶段：这个阶段是不可中断的，会执行所有的变更

### render 阶段

此阶段会找出所有节点的变更，如节点新增、删除、属性变更等，这些变更 react 统称为副作用（effect），此阶段会构建一棵`Fiber tree`，以虚拟 dom 节点为维度对任务进行拆分，即一个虚拟 dom 节点对应一个任务，最后产出的结果是`effect list`，从中可以知道哪些节点更新、哪些节点增加、哪些节点删除了。

### commit 阶段

commit 阶段需要将上阶段计算出来的需要处理的副作用一次性执行，此阶段不能暂停，否则会出现 UI 更新不连续的现象。此阶段需要根据`effect list`，将所有更新都 commit 到 DOM 树上。

## 其他

### 双缓冲 Fiber tree
在 React 中最多会同时存在两棵fiber tree。当前屏幕上显示内容对应的fiber tree称为current fiber tree，正在内存中构建的fiber tree称为workInProgress fiber tree

React 应用的根节点通过current指针在不同fiber tree的rootFiber间切换来实现fiber tree的切换。双缓冲指的是当workInProgress fiber tree构建完成交给Renderer渲染在页面上后，应用根节点的current指针指向workInProgress fiber tree，此时workInProgress fiber tree就变为current fiber tree。每次状态更新都会产生新的workInProgress fiber tree，通过current与workInProgress的替换，完成 DOM 更新。

这样做的好处是：能够复用内部对象（fiber）；节省内存分配、GC 的时间开销。

### 遍历流程

`React Fiber`首先是将虚拟 DOM 树转化为`Fiber tree`，遍历`Fiber tree`时采用的是后序遍历方法：

先遍历儿子，再在弟弟，最后叔叔，完成说有的子节点后，自己才完成

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e617a3507074e498318332b579cd634~tplv-k3u1fbpfcp-watermark.awebp" alt="undefined" style="zoom:25%;" />

### requestAnimationFrame

在 Fiber 中使用到了[requestAnimationFrame](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame)，它是浏览器提供的绘制动画的 api 。它要求浏览器在下次重绘之前（即下一帧）调用指定的回调函数更新动画。

### requestIdleCallback

[requestIdleCallback](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestIdleCallback) 也是 react Fiber 实现的基础 api ，就是指在浏览器的空闲时段内调用的一些函数的回调。React 实现了功能更完备的 requestIdleCallbackpolyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**（调度器）还提供了多种调度优先级供任务设置



