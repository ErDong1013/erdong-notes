---
title: top-level await
date: 2021-07-26 16:04:15
permalink: /pages/top-level-await/
categories:
  - note
tags:
  -
---

![](https://tva1.sinaimg.cn/large/008eGmZEly1gpdxy76zntj30sg0hn0st.jpg)

## top-level await

我们都知道在异步编程中， await 只能在 aysnc function 里进行使用。await 提升了异步编程的体验，使我们能像同步函数那样处理异步函数。同时我们也会好奇 await 只能在 aysnc 中使用

ECMAScript 提案 [Top-level `await`](https://github.com/tc39/proposal-top-level-await) 允许开发者在 async 函数外使用 await 字段,目前已进入 tc39 Stage 3。

Top-level await 允许你将整个 JS 模块视为一个巨大的 async 函数，这样就可以直接在顶层使用 await，而不必用 async 函数包一层。

> 早在 2020-08-11 node 发布 14.8.0 版本开始支持 top-level await

![](https://tva1.sinaimg.cn/large/008eGmZEly1gpdy37rto9j30sq09pwf4.jpg)

### 1. 在引入 top-level await 之前

```js
// ------ method.js
export function double(num) {
  return num * 2;
}

export function square(num) {
  return num * num;
}

// ------ middleware.js
import { double, square } from './method.js';

let doubleOutput;
let squareOutput;

// IIFE
(async () => {
  await requestData();
  doubleOutput = double(10);
  squareOutput = square(10);
})();

// 模拟接口请求
function requestData(delays = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(console.log('❤️'));
    }, delays);
  });
}

export { doubleOutput, squareOutput };

// ------ index.js
import {
  doubleOutput,
  squareOutput,
} from './middleware.js';

console.log('doubleOutput-init', doubleOutput); // undefined
console.log('squareOutput-init', squareOutput); // undefined

setTimeout(
  () => console.log('doubleOutput-delay', doubleOutput),
  2000,
); // 20
setTimeout(
  () => console.log('squareOutput-delay', squareOutput),
  2000,
); // 100
```

<iframe src="https://codesandbox.io/embed/top-level-await-dome1-kh7sg?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="top-level-await-dome1"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   >
</iframe>

### 2.使用 Export Promise 来代替初始化

```js
// ------ method.js
export function double(num) {
  return num * 2;
}

export function square(num) {
  return num * num;
}

// ------ middleware.js
import { double, square } from './method.js';

let doubleOutput;
let squareOutput;

// IIFE
export default (async () => {
  await requestData();
  doubleOutput = double(10);
  squareOutput = square(10);
  return { doubleOutput, squareOutput };
})();

// 模拟接口请求
function requestData(delays = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(console.log('❤️'));
    }, delays);
  });
}

export { doubleOutput, squareOutput };

// ------ index.js
import promise from './middleware.js';

promise.then(({ doubleOutput, squareOutput }) => {
  console.log('doubleOutput-delay', doubleOutput); // 20
  console.log('squareOutput-delay', squareOutput); // 100
});
```

<iframe src="https://codesandbox.io/embed/elastic-tu-w4b5e?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="elastic-tu-w4b5e"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

所有引用都要写成 promise 结构，十分不方便

### 3. 使用 top-level await

```js
// ------ method.js
export function double(num) {
  return num * 2;
}

export function square(num) {
  return num * num;
}

// ------ middleware.js
import { double, square } from './method.js';

let doubleOutput;
let squareOutput;

// "plugins": ["@babel/plugin-syntax-top-level-await"]
await requestData();

doubleOutput = double(10);
squareOutput = square(10);

// 模拟接口请求
function requestData(delays = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(console.log('❤️'));
    }, delays);
  });
}

export { doubleOutput, squareOutput };

// ------ index.js
import {
  doubleOutput,
  squareOutput,
} from './middleware.js';

console.log('doubleOutput-init', doubleOutput); // 20
console.log('squareOutput-init', squareOutput); // 100
```

<iframe src="https://codesandbox.io/embed/top-level-await-dome3-61l3n?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="top-level-await-dome3"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 4. 过去

当 `async/await` 首次引用时，尝试在 `async` 函数外部使用 `await` 的结果是产生 `SyntaxError`。大多数开发者使用立即执行异步函数表达式的方式来使用该功能。

```js
await Promise.resolve(console.log('🎉'));
// → SyntaxError: await is only valid in async function
(async function() {
  await Promise.resolve(console.log('🎉'));
  // → 🎉
})();
```

### 5. 现在

在 top-level await 的支持下，下面代码可以替换模块中常见代码

```js
await Promise.resolve(console.log('🎉'));
// → 🎉
```

> 注意： top-level await 仅能工作在模块的顶层。在 class 代码块或非 `async` 函数不支持。

### 6. 何时使用

参考 [spec proposal repository](https://github.com/tc39/proposal-top-level-await#use-cases)

#### 6.1 动态依赖导入

```js
const strings = await import(`/i18n/${navigator.language}`);
```

这允许在模块的运行时环境中确认依赖项。

#### 6.2 资源初始化

```js
const connection = await dbConnector();
```

允许模块申请资源，同时也可以在模块不能使用时抛出错误。

#### 6.3 依赖回退

```js
let jQuery;
try {
  jQuery = await import('https://cdn-a.example.com/jQuery');
} catch {
  jQuery = await import('https://cdn-b.example.com/jQuery');
}
```

希望从 CDN A 加载 JavaScript 库，如果它加载失败，将加载 CDN B

### 结尾

top-level await 在某些特定场景有很方便的作用，但是目前这个一特性还没有很好的运用到生产代码中

![](https://tva1.sinaimg.cn/large/008eGmZEly1gpefp4ws6rj312308lgly.jpg)

> 本文整理自作者 Myles Borins 「Top-level await」，转载请注明来源链接
>
> https://v8.dev/features/top-level-await

**相关资源：**

- ###### [@babel/plugin-syntax-top-level-await](https://babeljs.io/docs/en/babel-plugin-syntax-top-level-await.html)

- ###### https://github.com/tc39/proposal-top-level-await
