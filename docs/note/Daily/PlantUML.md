---
title: PlantUML
date: 2021-09-07 20:53:43
permalink: /pages/plantUml/
categories:
  - note
tags:
  - 
---

## Vuepress 增加 PlantUML 支持

#### 插件安装
```shell
yarn add -D markdown-it-plantuml
```
编辑Vuepress的配置文件.config.js，增加插件的配置：

```JavaScript
module.exports = {
  ...
  extendMarkdown: md => {
    md.set({ breaks: true })
    md.use(require('markdown-it-plantuml'))
  },
  ...
}
```

#### 测试

```
@startmindmap
* root node
	* some first level node
		* second level node
		* another second level node
	* another first level node
@endmindmap
```
参考：[https://plantuml.com/zh/mindmap-diagram](https://plantuml.com/zh/mindmap-diagram)

@startmindmap
* root node
	* some first level node
		* second level node
		* another second level node
	* another first level node
@endmindmap