---
title: webpack
date: 2021-11-08 21:15:50
permalink: /pages/6a9523/
categories:
  - interview
  - Webpack
tags:
  -
---

# webpack

## webpack 的工作原理?

WebPack 可以看做是模块打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块以及其它的一些浏览器不能直接运行的拓展语言（Sass，TypeScript 等），并将其转换和打包为合适的格式供浏览器使用。Webpack 还肩负起了优化项目的责任。

## webpack 打包原理

把一切都视为模块：不管是 css、JS、Image 还是 html 都可以互相引用，通过定义 entry.js，对所有依赖的文件进行跟踪，将各个模块通过 loader 和 plugins 处理，然后打包在一起。

按需加载：打包过程中 Webpack 通过 Code Splitting 功能将文件分为多个 chunks，还可以将重复的部分单独提取出来作为`commonChunk`，从而实现按需加载。把所有依赖打包成一个 bundle.js 文件，通过代码分割成单元片段并按需加载

## webpack 的构建流程是什么

- `初始化参数`：解析 webpack 配置参数，合并 shell 传入和 webpack.config.js 文件配置的参数,形成最后的配置结果；
- `开始编译`：上一步得到的参数初始化 compiler 对象，注册所有配置的插件，插件 监听 webpack 构建生命周期的事件节点，做出相应的反应，执行对象的 run 方法开始执行编译；
- `确定入口`：从配置的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去；
- `编译模块`：递归中根据文件类型和 loader 配置，调用所有配置的 loader 对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
- `完成模块编译并输出`：递归完事后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据 entry 或分包配置生成代码块 chunk;
- `输出完成`：输出所有的 chunk 到文件系统；

##### 简单说

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
- 编译：从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

## webpack 有哪些常⻅的 Loader

- `file-loader`：把⽂件输出到⼀个⽂件夹中，在代码中通过相对 URL 去引⽤输出的⽂件
- `url-loader`：和 file-loader 类似，但是能在⽂件很⼩的情况下以 base64 的⽅式把⽂件内容注⼊到代码中去
- `babel-loader`：把 ES6 转换成 ES5
- `css-loader`：加载 CSS，⽀持模块化、压缩、⽂件导⼊等特性
- `eslint-loader`：通过 ESLint 检查 JavaScript 代码

## webpack 常见的 plugin 有哪些

- `html-webpack-plugin`可以根据模板自动生成 html 代码，并自动引用 css 和 js 文件
- `HotModuleReplacementPlugin` 热更新
- `happypack`：通过多进程模型，来加速代码构建
- `clean-wenpack-plugin` 清理每次打包下没有使用的文件
- `webpack-bundle-analyzer`:可视化 Webpack 输出文件的体积（业务组件、依赖第三方模块

## Loader 和 Plugin 的不同？

##### Loader

Webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，配置里的`module.rules`数组配置了一组规则，告诉 Webpack 在遇到哪些文件时使用哪些 Loader 去加载和转换打包成 js。

##### Plugin

Plugin 是用来扩展 Webpack 功能的，通过在构建流程里注入钩子实现，它给 Webpack 带来了很大的灵活性。

## webpack 的热更新原理

模块热更新是 webpack 的一个功能，它可以使得代码修改之后，不用刷新浏览器就可以更新。

在应用过程中替换添加删出模块，无需重新加载整个页面，是高级版的自动刷新浏览器。

其实是自己`开启了express应用`，添加了对 webpack 编译的监听，添加了和浏览器的 websocket 长连接，当文件变化触发 webpack 进行编译并完成后，`会通过sokcet消息告诉浏览器准备刷新`。而为了减少刷新的代价，就是`不用刷新网页`，而是`刷新某个模块`，webpack-dev-server 可以支持热更新，通过生成 文件的 hash 值来比对需要更新的模块，浏览器再进行热替换

## 如何⽤**webpack**来优化前端性能？

⽤ webpack 优化前端性能是指优化 webpack 的输出结果，让打包的最终结果在浏览器运⾏快速⾼效。

- `压缩代码`：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤ webpack 的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩 JS ⽂件， 利⽤ cssnano （css-loader?minimize）来压缩 css
- `利⽤CDN加速`: 在构建过程中，将引⽤的静态资源路径修改为 CDN 上对应的路径。可以利⽤ webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径
- `Tree Shaking`: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动 webpack 时追加参数 --optimize-minimize 来实现
- `Code Splitting`: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存
- `提取公共第三⽅库`: SplitChunksPlugin 插件来进⾏公共模块抽取,利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码

## 你是如何提高 webpack 构件速度的?

多入口情况下，使用`CommonsChunkPlugin`来提取公共代码

通过`externals`配置来提取常用库

利用`DllPlugin`和`DllReferencePlugin`预编译资源模块通过`DllPlugin`来对那些我们

引用但是绝对不会修改的 npm 包来进行预编译，再通过`DllReferencePlugin`将预编译的模块加载进来。

使用`Happypack`实现多线程加速编译

使用`webpack-uglify-paralle`来提升`uglifyPlugin`的压缩速度。

原理上 webpack-uglify-parallel 采用了多核并行压缩来提升压缩速度

使用`Tree-shaking`和`Scope Hoisting`来剔除多余代码

## sourceMap

是一个映射关系，将打包后的文件隐射到源代码，用于定位报错位置

## 前端为什么要进行打包和构建？

代码层面：

- 体积更小（Tree-shaking、压缩、合并），加载更快
- 编译高级语言和语法（TS、ES6、模块化、scss）
- 兼容性和错误检查（polyfill,postcss,eslint）

研发流程层面：

- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司构建规范（提测、上线）

## 聊一聊 Babel 原理吧

- 解析：将源代码转换成 AST
- 转换：访问 AST 的节点进行变换操作生产新的 AST
- 生成：以新的 AST 为基础生成代码

#### AST 是什么

**抽象语法树**（**A**bstract **S**yntax **T**ree，AST）是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

功能：css 预处理器、开发 WebPack 插件、cli 前端自动化工具等等，这些底层原理都是基于 AST 来实现的

- https://www.mybj123.com/12007.html
