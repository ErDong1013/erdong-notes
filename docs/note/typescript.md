---
title: typescript不完整指南
date: 2021-07-26 14:00:49
permalink: /pages/typeScript/
categories:
  - note
tags:
  -
---

# TypeScript

> 怎样熟练使用 TypeScript ？

👨‍💻 用了一段时间的 TypeScript,深感 ts 的必要性，结合最近的项目开发经历，整理了一篇关于 typescript 的使用心得

## 1、为什么要学习 TypeScript

TypeScript 在推出之初就备受追捧又备受质疑，质疑如下：

- 静态语言会丧失 JavaScript 灵活性
- TypeScript 必定赴 coffeescript 后尘，会被标准取代

#### 优点

- typescript 的超集 JavaScript

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/622421c876704a2b8ac50522978d3a3a~tplv-k3u1fbpfcp-zoom-1.image)

- 静态类型

  一门语言在编译时报错，那么就是静态语言，如果在运行时报错，那么就是动态语言

  typescript 就是一门静态类型语言，它能够提前在编译期避免许多 bug，如很恶心的拼写问题等

很多项目，尤其是中大型项目，我们是需要团队多人协作的，那么如何保证协作呢?这个时候可能需要大量的文档和注释，显式类型就是最好的注释，而通过 TypeScript 提供的类型提示功能我们可以非常舒服地调用同伴的代码，由于 TypeScript 的存在我们可以节省大量沟通成本、代码阅读成本等等（各人认为不认同，是对 ts 学习的最大阻碍 🈲）。

#### 缺点

- 与实际框架结合会有很多坑
- 配置学习成本高
- TypeScript 的类型系统其实比较复杂

#### 使用总结

1. ⌛️ 规避大量低级错误，避免时间浪费，省时
2. 💪 减少多人协作项目的成本，大型项目友好，省力
3. ❤️ 良好代码提示，不用反复文件跳转或者翻文档，省心

## 2、基础类型

undefined | null | boolean | number | bigint | string | symbol | void | object | unknown | never | any

- 布尔类型：boolean
- 数字类型：number
- 字符串类型：string
- 空值：void
- Null and Undefined：null undefined
- Symbol 类型：symbol

#### 类型声明技巧

- 声明一个 void 类型的只能将它赋值为 undefined 和 null

  ```ts
  let unusable: void = undefined;
  ```

- 没有声明的变量 ts 也会进行类型推到不一定所有的变量都需要声明类型

  ```ts
  let name = 'xiaodong';
  // 等价于
  let name: string = 'xiaodong';
  ```

- 联合类型

  ```ts
  function getString(something: string | number): string {
    return something.toString();
  }
  ```

- any 类型的使用要慎重，是多人项目协作的大忌，稍有不慎就会变成 anyscript，（本人深有感触 🙄，同事备受摧残 💀 ）

- never 表示那些永远不存在的值，never 是任何类型的子类型，也可以赋值给任何类型

  ```ts
  // 抛出异常的函数没有返回值
  function error(message: string): never {
    throw new Error(message);
  }
  ```

- 数组分为两种类型定义:

  ```ts
  // 使用泛类
  const list: Array<number> = [1, 2, 3];
  // 元素类型后面直接加 []
  const list: number[] = [1, 2, 3];
  ```

## 3、枚举

#### 数组枚举

当我们声明一个枚举类型，虽然没有赋值，但是它们的值其实是默认数字类型，默认从 0 开始依次累加：

```ts
enum Days {
  Sun,
  Mon,
  Tue,
  Wed,
  ...
}
console.log(Days["Sun"]); // 0
// 反向映射
console.log(Days[0]); // 'Sun'

console.log(Days["Mon"]); // 1
console.log(Days[1]); // 'Mon'
```

因此我们给第一个值赋值后面也会根据第一个值进行累加：

```ts
enum Days2 {
  Sun = 7,
  Mon,
  Tue = 1,
  Wed,
	...
}
console.log(Days2["Sun"]); // 7
console.log(Days2["Mon"]); // 8
console.log(Days2["Tue"]); // 1
console.log(Days2["Wed"]); // 2
```

#### 字符串枚举

```ts
enum Days3 {
  Sun = 'SUN',
  Mon = 'MON',
  Tue = 'TUE',
  Wed = 'WED',
	...
}
console.log(Days3['Sun'], Days3.MON); // SUN Mon
```

#### 枚举的本质

```js
'use strict';
var Days3;
(function(Days3) {
  Days3['Sun'] = 'SUN';
  Days3['Mon'] = 'MON';
  Days3['Tue'] = 'TUE';
  Days3['Wed'] = 'WED';
})(Days3 || (Days3 = {}));
```

## 4、函数 Function

函数的作用就不在这里过多叙述了，typescript 里函数仍然是主要的定义行为的地方。

#### 定义类型函数

```ts
const add = (x: number, y: number) => {
  return x + y;
};
```

#### 可选参数

❌ 可选参数后面不允许再出现必须参数

```ts
const add = (x: number, y?: number) => {
  return x + (y ? y : 0);
};
```

#### 默认参数

```ts
const add = (x: number, y: number = 1) => {
  return x + y;
};
```

#### 剩余参数

```ts
// rest 参数只能是最后一个参数，关于 rest 参数,是一个数组
const add = (x: number, ...rest: number[]) => {
  return rest.reduce((x, y) => x + y, x);
};
function push(array: any[], ...items: any[]) {
  items.forEach(function(item) {
    array.push(item);
  });
}
```

## 5、断言

处使用 ts 可能会遇到一些问题，比如：

```ts
const person = {};
person.name = 'xiaodong'; // Error: 'name' ‘{}’
person.age = 23; // Error: 'age' ‘{}’
```

由于类型推断，此时 person 的类型就是{},不存在其他属性，开发者知道 person 有这个属性只是一开始没有声明，此时就需要类型断言：

#### as 语法

```ts
interface Person {
  name: string;
  age: number;
}
const person = {} as Person;
person.name = 'xiaodong';
person.age = 23;
```

#### 尖括号语法

```ts
interface Person {
  name: string;
  age: number;
}
const person = <Person>{};
person.name = 'xiaodong';
person.age = 20;
```

#### 双重断言

双重断言有个前提，子类型可以被断言为父类型

双重断言断言可以实现子类型转换为另外一种子类型（ 子类型->父类型->子类型）

❌ 尽量不使用双重断言，会破坏原有类型关系

```ts
interface Person {
  name: string;
  age: number;
}
const person = 'xiaodong' as Person; // Error
const person = ('xiaodong' as any) as Person; // ok
```

## 6、接口 interface

在 ts 中，接口的作用就为你的代码或者第三方代码定义锲约

#### 接口的使用

注意：一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集

```ts
interface Person {
  readonly id: number; // 直读属性
  name: string;
  age?: number;
  say: () => void;
  // [propName: string]: string; // 错误示范
  [propName: string]: any; //任意属性
}

let xiaodong: Person = {
  id: 1013, // 只读
  name: 'ErDong',
  age: 25,
  gender: 'GG',
  say() {
    console.log('hello');
  },
};
```

#### 接口继承

```ts
interface VIP extends Person {
  playBasketball: () => void;
}
```

## 7、类 Class

#### 成员属性与静态属性

```ts
class Game {
  // 静态属性
  static gName: string = '王者荣耀';
  // 成员属性
  playing: string;

  // 构造函数 - 执行初始化操作
  constructor(type: string) {
    this.playing = type;
  }

  // 静态方法
  static getName(): string {
    return 'GameName is 王者荣耀';
  }

  // 成员方法
  play() {
    return '玩' + this.playing;
  }
}
```

如何解释成员属性与静态属性

```js
'use strict';
var Game = /** @class */ (function() {
  // 构造函数 - 执行初始化操作
  function Game(type) {
    this.playing = type;
  }
  // 静态方法
  Game.getName = function() {
    return 'GameName is 王者荣耀';
  };
  // 成员方法
  Game.prototype.play = function() {
    return '玩' + this.playing;
  };
  // 静态属性
  Game.gName = '王者荣耀';
  return Game;
})();
```

#### 访问限定符

##### public

修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的

##### private （#）

修饰的属性或方法是私有的，不能在声明它的类的外部访问

##### protected

修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

#### class 可以作为接口

通常我们会使用 interface 作为接口，实际上类 class 也可以作为接口使用

由于组件需要传入`props`的类型`Props`，同时还需要设置 defaultProps，这时候我们使用 class 来作为接口就会方便很多

我们先声明一个类，然后这个类包含 props 所需的类型和初始值：

```ts
export default class Props {
  public children:
    | Array<React.ReactElement<any>>
    | React.ReactElement<any>
    | never[] = [];
  public height: number = 181;
  public bodyWeight: string = '70KG';
  public handsome: boolean = true;
  public basketball: () => {};
}
```

当我们需要设置 props 的初始值事

```ts
public static defaultProps = new Props()
```

Props 的实例就是 defaultProps 的初始值，所有 class 作为类既可以当做接口还可以设置默认值，方便了统一管理，还减少了代码量。

## 8、泛类 generic

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gqcjo56kmjg30lo0dce83.gif" style="zoom:50%;" />

（图片来源：https://medium.com/better-programming/typescript-generics-90be93d8c292）

泛型就是解决类、接口方法的复用性、以及对不特定数据类型的支持

```ts
interface IStingLength {
  length: number;
}
function test<T extends IStingLength>(res: T): T {
  console.log(res.length); // 12
  return res;
}

const str = 'typescript学习';
// result 就是 string 类型
const result = test<string>(str);
console.log(result); // typescript学习
```

#### 多个类型参数

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}
swap([0, 'hello']); // ['hello', 0]
```

#### 泛类接口

```ts
interface ReturnItemFn<K> {
  (res: K): K;
}
const returnItem: ReturnItemFn<number> = (res) => res;
```

#### 泛型类

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
  return x + y;
};
console.log(myGenericNumber.add(20, 10)); // 30
```

#### 常见泛类变量

- T（Type）：表示一个 TypeScript 类型
- K（Key）：表示对象中的键类型
- V（Value）：表示对象中的值类型
- E（Element）：表示元素类型

## 9、高级类型

#### 索引类型

我们需要一个 pick 函数 ，这个函数可以从对象上取出指定属性，实现方法如下

##### JavaScript 版本

```js
function pick(obj, names) {
  return names.map((item) => obj[item]);
}
const user = {
  username: '晓冬',
  age: 24,
  height: 181,
};
const res = pick(user, ['username']);
console.log(res); // ["晓冬"]
```

##### TypeScript 简版

```ts
interface Obj {
  [key: string]: any;
}
function pick(obj: Obj, names: string[]) {
  return names.map((n) => obj[n]);
}
```

##### TypeScript 高级版

```ts
function pick<T, K extends keyof T>(
  obj: T,
  names: K[],
): T[K][] {
  return names.map((n) => obj[n]);
}
const res = pick(user, ['username', 'height']);
```

#### 映射类型

当我们有一个接口，现在需要把接口所有成员变成可选的，当然我们不可能一个一个在：前添加问号，作为程序猿当然会有更懒的方法，这时候就需要我们的映射了，映射类型的语法：`[P in Keys]`

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

#### 常见工具类

其实，TypeScript 提供一些工具类型来帮助常见的类型转换。这些类型是全局可见的

##### `Partial<T>`

构造类型 T，并将它所有的属性设置为可选的。它的返回类型表示输入类型的所有子类型。

##### `Readonly <T>`

构造类型 T，并将它所有的属性设置为 readonly，也就是说构造出的类型的属性不能被再次赋值。

##### `Record<K,T>`

构造一个类型，其属性名的类型为 K，属性值的类型为 T。这个工具可用来将某个类型的属性映射到另一个类型上。

……

## 10、tsconfig.json

**编译选项** （_https://www.tslang.cn/docs/handbook/compiler-options.html_）

> 引用「[深入理解 TypeScript-编译选项](https://jkchao.github.io/typescript-book-chinese/project/compilationContext.html#%E7%BC%96%E8%AF%91%E9%80%89%E9%A1%B9)」

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
```

## 参考资源

- [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)
- [TypeScript 中文文档](https://www.tslang.cn/docs/home.html)

---

/_ TODO _/ <br>
_更多内容待补充_
