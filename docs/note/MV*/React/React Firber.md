---
title: React Firber
date: 2021-09-16 20:04:11
permalink: /pages/e53db3/
categories:
  - note
  - MV*
  - React
tags:
  - React
---

# React Fiber

> 部分内容整理自网络资源

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/174732164558420ca92646b81853ab55~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/686143f2729a4eee885903f75ccdb420~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f5b5709610f4a09b32170dde18c3424~tplv-k3u1fbpfcp-watermark.image?)

1.  接受输入事件
1.  执行事件回调
1.  开始一帧
1.  执行 RAF (RequestAnimationFrame)
1.  页面布局，样式计算
1.  渲染
1.  执行 RIC (RequestIdelCallback)
    一帧包括了用户的交互行为的处理、js 的执行、requestAnimationFrame 的调用、layout 布局、paint 页面重绘等工作，假如某一帧里面要执行的任务不多，在不到 16ms（1000/60=16)的时间内就完成了上述任务的话，页面就会正常显示不会出现卡顿的现象，但是如果一旦 js 执行时间过长，超过了 16ms，这一帧的刷新就没有时间执 layout 和 paint 部分了，就可能会出现页面卡顿的现象。

- js 引擎和页面渲染引擎是在同一个渲染**线程**之内，两者是互斥关系。
- React16 中使用了 Fiber，但是 Vue 是没有 Fiber 的，为什么呢？原因是二者的优化思路不一样：
  1. Vue 是基于 template 和 watcher 的组件级更新，把每个更新任务分割得足够小，不需要使用到 Fiber 架构，将任务进行更细粒度的拆分
  2. React 是不管在哪里调用 setState，都是从根节点开始更新的，更新任务还是很大，需要使用到 Fiber 将大任务分割为多个小任务，可以中断和恢复，不阻塞主进程执行高优先级的任务
- [requestAnimationFrame](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestAnimationFrame 'https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame')
- [requestIdleCallback](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FrequestIdleCallback 'https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback')
-

react 团队重写了核心算法 --reconciliation。即 fiber reconciler 的架构在原来的基础上增加了 Scheduler（调度器）的概念：

- **Scheduler**（调度器）: 调度任务的优先级，高优任务优先进入**Reconciler。**

浏览器有个 api 叫**requestIdleCallback**，就是指在浏览器的空闲时段内调用的一些函数的回调。React 实现了功能更完备的 requestIdleCallbackpolyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。

### 总结

- 初始化渲染，调用函数组件、或 class 组件的 render 方法，将 JSX 代码编译成 ReactELement 对象，它描述当前组件内容的数据结构。

- 根据生产的 ReactELement 对象构建 Fiber tree，它包含了组件 **schedule**、**reconciler**、**render** 所需的相关信息。

- 一旦有状态变化，触发更新，**Scheduler** 在接收到更新后，根据任务的优先级高低来进行调度，决定要执行的任务是什么。

- 接下来的工作交给 **Reconciler** 处理，**Reconciler** 通过对比找出变化了的 Virtual DOM ，为其打上代表增/删/更新的标记，当所有组件都完成 **Reconciler** 的工作，才会统一交给**Renderer**。

- **Renderer** 根据 **Reconciler** 为 Virtual DOM 打的标记，同步执行对应的 DOM 更新操作。
