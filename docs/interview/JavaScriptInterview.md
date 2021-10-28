---
title: JavaScript Interview
date: 2021-10-28 19:50:51
permalink: /pages/2bcec2/
categories:
  - note
  - JavaScript
tags:
  -
---
# JavaScript Interview
> https://juejin.cn/user/430664257382462 @神三元

## 第一篇: JS 数据类型之问——概念篇

### 1.JS 原始数据类型有哪些？引用数据类型有哪些？

在 JS 中，存在着 7 种原始值，分别是：

- boolean
- null
- undefined
- number
- string
- symbol
- bigint

引用数据类型: 对象 Object（包含普通对象-Object，数组对象-Array，正则对象-RegExp，日期对象-Date，数学函数-Math，函数对象-Function）

### 2.说出下面运行的结果，解释原因。

```js
function test(person) {
  person.age = 26;
  person = {
    name: 'hzj',
    age: 18,
  };
  return person;
}
const p1 = {
  name: 'fyq',
  age: 19,
};
const p2 = test(p1);
console.log(p1); // -> ?
console.log(p2); // -> ?
复制代码;
```

结果:

```
p1：{name: “fyq”, age: 26}
p2：{name: “hzj”, age: 18}
复制代码
```

> 原因: 在函数传参的时候传递的是对象在堆中的内存地址值，test 函数中的实参 person 是 p1 对象的内存地址，通过调用 person.age = 26 确实改变了 p1 的值，但随后 person 变成了另一块内存空间的地址，并且在最后将这另外一份内存空间的地址返回，赋给了 p2。

### 3.null 是对象吗？为什么？

结论: null 不是对象。

解释: 虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以将它错误的判断为 object 。

### 4.'1'.toString()为什么可以调用？

其实在这个语句运行的过程中做了这样几件事情：

```js
var s = new Object('1');
s.toString();
s = null;
复制代码;
```

第一步: 创建 Object 类实例。注意为什么不是 String ？ 由于 Symbol 和 BigInt 的出现，对它们调用 new 都会报错，目前 ES6 规范也不建议用 new 来创建基本类型的包装类。

第二步: 调用实例方法。

第三步: 执行完方法立即销毁这个实例。

整个过程体现了`基本包装类型`的性质，而基本包装类型恰恰属于基本数据类型，包括 Boolean, Number 和 String。

> 参考:《JavaScript 高级程序设计(第三版)》P118

### 5.0.1+0.2 为什么不等于 0.3？

0.1 和 0.2 在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成 0.30000000000000004。

### 6.如何理解 BigInt?

#### 什么是 BigInt?

> BigInt 是一种新的数据类型，用于当整数值大于 Number 数据类型支持的范围时。这种数据类型允许我们安全地对`大整数`执行算术操作，表示高分辨率的时间戳，使用大整数 id，等等，而不需要使用库。

#### 为什么需要 BigInt?

在 JS 中，所有的数字都以双精度 64 位浮点格式表示，那这会带来什么问题呢？

这导致 JS 中的 Number 无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS 中的 Number 类型只能安全地表示-9007199254740991(-(2^53-1))和 9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

```js
console.log(999999999999999); //=>10000000000000000
复制代码;
```

同时也会有一定的安全性问题:

```js
9007199254740992 === 9007199254740993; // → true 居然是true!
复制代码;
```

#### 如何创建并使用 BigInt？

要创建 BigInt，只需要在数字末尾追加 n 即可。

```js
console.log(9007199254740995n); // → 9007199254740995n
console.log(9007199254740995); // → 9007199254740996
复制代码;
```

另一种创建 BigInt 的方法是用 BigInt()构造函数、

```js
BigInt('9007199254740995'); // → 9007199254740995n
复制代码;
```

简单使用如下:

```js
10n + 20n; // → 30n
10n - 20n; // → -10n
+10n; // → TypeError: Cannot convert a BigInt value to a number
-10n; // → -10n
10n * 20n; // → 200n
20n / 10n; // → 2n
23n % 10n; // → 3n
10n ** 3n; // → 1000n

const x = 10n;
++x; // → 11n
--x; // → 9n
console.log(typeof x); //"bigint"
复制代码;
```

#### 值得警惕的点

1. BigInt 不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js 代码。
2. 因为隐式类型转换可能丢失信息，所以不允许在 bigint 和 Number 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由 BigInt 或 Number 精确表示。

```js
10 + 10n; // → TypeError
复制代码;
```

1. 不能将 BigInt 传递给 Web api 和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报 TypeError 错误。

```js
Math.max(2n, 4n, 6n); // → TypeError
复制代码;
```

1. 当 Boolean 类型与 BigInt 类型相遇时，BigInt 的处理方式与 Number 类似，换句话说，只要不是 0n，BigInt 就被视为 truthy 的值。

```js
if (0n) {
  //条件判断为false
}
if (3n) {
  //条件为true
}
复制代码;
```

1. 元素都为 BigInt 的数组可以进行 sort。
2. BigInt 可以正常地进行位运算，如|、&、<<、>>和^

#### 浏览器兼容性

caniuse 的结果:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/22/16df110a69c0ae17~tplv-t2oaga2asx-watermark.awebp)

其实现在的兼容性并不怎么好，只有 chrome67、firefox、Opera 这些主流实现，要正式成为规范，其实还有很长的路要走。

我们期待 BigInt 的光明前途！

## 第二篇: JS 数据类型之问——检测篇

### 1. typeof 是否能正确判断类型？

对于原始类型来说，除了 null 都可以调用 typeof 显示正确的类型。

```js
typeof 1; // 'number'
typeof '1'; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
复制代码;
```

但对于引用数据类型，除了函数之外，都会显示"object"。

```js
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
复制代码;
```

因此采用 typeof 判断对象数据类型是不合适的，采用 instanceof 会更好，instanceof 的原理是基于原型链的查询，只要处于原型链中，判断永远为 true

```js
const Person = function() {};
const p1 = new Person();
p1 instanceof Person; // true

var str1 = 'hello world';
str1 instanceof String; // false

var str2 = new String('hello world');
str2 instanceof String; // true
复制代码;
```

### 2. instanceof 能否判断基本数据类型？

能。比如下面这种方式:

```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number';
  }
}
console.log(111 instanceof PrimitiveNumber); // true
复制代码;
```

如果你不知道 Symbol，可以看看[MDN 上关于 hasInstance 的解释](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FSymbol%2FhasInstance)。

其实就是自定义 instanceof 行为的一种方式，这里将原有的 instanceof 方法重定义，换成了 typeof，因此能够判断基本数据类型。

### 3. 能不能手动实现一下 instanceof 的功能？

核心: 原型链的向上查找。

```js
function myInstanceof(left, right) {
  //基本数据类型直接返回false
  if (typeof left !== 'object' || left === null)
    return false;
  //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
  let proto = Object.getPrototypeOf(left);
  while (true) {
    //查找到尽头，还没找到
    if (proto == null) return false;
    //找到相同的原型对象
    if (proto == right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

复制代码;
```

测试:

```js
console.log(myInstanceof('111', String)); //false
console.log(myInstanceof(new String('111'), String)); //true
复制代码;
```

### 4. Object.is 和===的区别？

Object 在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是+0 和-0，NaN 和 NaN。 源码如下：

```js
function is(x, y) {
  if (x === y) {
    //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
    //两个都是NaN的时候返回true
    return x !== x && y !== y;
  }


复制代码
```

## 第三篇: JS 数据类型之问——转换篇

### 1. [] == ![]结果是什么？为什么？

解析:

== 中，左右两边都需要转换为数字然后进行比较。

[]转换为数字为 0。

![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为 true,

因此![]为 false，进而在转换成数字，变为 0。

0 == 0 ， 结果为 true

### 2. JS 中类型转换有哪几种？

JS 中，类型转换只有三种：

- 转换成数字
- 转换成布尔值
- 转换成字符串

转换具体规则如下:

> 注意"Boolean 转字符串"这行结果指的是 true 转字符串的例子

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de9512eaf1158a~tplv-t2oaga2asx-watermark.awebp)

### 3. == 和 ===有什么区别？

```!
===叫做严格相等，是指：左右两边不仅值要相等，类型也要相等，例如'1'===1的结果是false，因为一边是string，另一边是number。
复制代码
```

==不像===那样严格，对于一般情况，只要值相等，就返回 true，但==还涉及一些类型转换，它的转换规则如下：

- 两边的类型是否相同，相同的话就比较值的大小，例如 1==2，返回 false
- 判断的是否是 null 和 undefined，是的话就返回 true
- 判断的类型是否是 String 和 Number，是的话，把 String 类型转换成 Number，再进行比较
- 判断其中一方是否是 Boolean，是的话就把 Boolean 转换成 Number，再进行比较
- 如果其中一方为 Object，且另一方为 String、Number 或者 Symbol，会将 Object 转换成字符串，再进行比较

```js
console.log({ a: 1 } == true); //false
console.log({ a: 1 } == '[object Object]'); //true
复制代码;
```

### 4. 对象转原始类型是根据什么流程运行的？

对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：

1. 如果 Symbol.toPrimitive()方法，优先调用再返回
2. 调用 valueOf()，如果转换为原始类型，则返回
3. 调用 toString()，如果转换为原始类型，则返回
4. 如果都没有返回原始类型，会报错

```js
var obj = {
  value: 3,
  valueOf() {
    return 4;
  },
  toString() {
    return '5';
  },
  [Symbol.toPrimitive]() {
    return 6;
  },
};
console.log(obj + 1); // 输出7
复制代码;
```

### 5. 如何让 if(a == 1 && a == 2)条件成立？

其实就是上一个问题的应用。

```js
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  },
};
console.log(a == 1 && a == 2); //true
复制代码;
```

## 第四篇: 谈谈你对闭包的理解

### 什么是闭包？

```!
红宝书(p178)上对于闭包的定义：闭包是指有权访问另外一个函数作用域中的变量的函数，
复制代码
MDN 对闭包的定义为：闭包是指那些能够访问自由变量的函数。

（其中自由变量，指在函数中使用的，但既不是函数参数arguments也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。）
复制代码
```

### 闭包产生的原因?

首先要明白作用域链的概念，其实很简单，在 ES5 中只存在两种作用域————全局作用域和函数作用域，`当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链`，值得注意的是，每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。 比如:

```js
var a = 1;
function f1() {
  var a = 2;
  function f2() {
    var a = 3;
    console.log(a); //3
  }
}
复制代码;
```

在这段代码中，f1 的作用域指向有全局作用域(window)和它本身，而 f2 的作用域指向全局作用域(window)、f1 和它本身。而且作用域是从最底层向上找，直到找到全局作用域 window 为止，如果全局还没有的话就会报错。就这么简单一件事情！

闭包产生的本质就是，当前环境中存在指向父级作用域的引用。还是举上面的例子:

```js
function f1() {
  var a = 2;
  function f2() {
    console.log(a); //2
  }
  return f2;
}
var x = f1();
x();
复制代码;
```

这里 x 会拿到父级作用域中的变量，输出 2。因为在当前环境中，含有对 f2 的引用，f2 恰恰引用了 window、f1 和 f2 的作用域。因此 f2 可以访问到 f1 的作用域的变量。

那是不是只有返回函数才算是产生了闭包呢？、

回到闭包的本质，我们只需要让父级作用域的引用存在即可，因此我们还可以这么做：

```js
var f3;
function f1() {
  var a = 2;
  f3 = function() {
    console.log(a);
  };
}
f1();
f3();
复制代码;
```

让 f1 执行，给 f3 赋值后，等于说现在`f3拥有了window、f1和f3本身这几个作用域的访问权限`，还是自底向上查找，`最近是在f1`中找到了 a,因此输出 2。

在这里是外面的变量`f3存在着父级作用域的引用`，因此产生了闭包，形式变了，本质没有改变。

### 闭包有哪些表现形式?

明白了本质之后，我们就来看看，在真实的场景中，究竟在哪些地方能体现闭包的存在？

1. 返回一个函数。刚刚已经举例。
2. 作为函数参数传递

```js
var a = 1;
function foo() {
  var a = 2;
  function baz() {
    console.log(a);
  }
  bar(baz);
}
function bar(fn) {
  // 这就是闭包
  fn();
}
// 输出2，而不是1
foo();
复制代码;
```

1. 在定时器、事件监听、Ajax 请求、跨窗口通信、Web Workers 或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。

以下的闭包保存的仅仅是 window 和当前作用域。

```js
// 定时器
setTimeout(function timeHandler(){
  console.log('111');
}，100)

// 事件监听
$('#app').click(function(){
  console.log('DOM Listener');
})
复制代码
```

1. IIFE(立即执行函数表达式)创建闭包, 保存了`全局作用域window`和`当前函数的作用域`，因此可以全局的变量。

```js
var a = 2;
(function IIFE() {
  // 输出2
  console.log(a);
})();
复制代码;
```

### 如何解决下面的循环输出问题？

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
}
复制代码;
```

为什么会全部输出 6？如何改进，让它输出 1，2，3，4，5？(方法越多越好)

因为 setTimeout 为宏任务，由于 JS 中单线程 eventLoop 机制，在主线程同步任务执行完后才去执行宏任务，因此循环结束后 setTimeout 中的回调才依次执行，但输出 i 的时候当前作用域没有，往上一级再找，发现了 i,此时循环已经结束，i 变成了 6。因此会全部输出 6。

解决方法：

1、利用 IIFE(立即执行函数表达式)当每次 for 循环时，把此时的 i 变量传递到定时器中

```js
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j);
    }, 0);
  })(i);
}
复制代码;
```

2、给定时器传入第三个参数, 作为 timer 函数的第一个函数参数

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j);
    },
    0,
    i,
  );
}
复制代码;
```

3、使用 ES6 中的 let

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
}
复制代码;
```

let 使 JS 发生革命性的变化，让 JS 有函数作用域变为了块级作用域，用 let 后作用域链不复存在。代码的作用域以块级为单位，以上面代码为例:

```
// i = 1
{
  setTimeout(function timer(){
    console.log(1)
  },0)
}
// i = 2
{
  setTimeout(function timer(){
    console.log(2)
  },0)
}
// i = 3
...
复制代码
```

因此能输出正确的结果。

## 第五篇: 谈谈你对原型链的理解

### 1.原型对象和构造函数有何关系？

在 JavaScript 中，每当定义一个函数数据类型(普通函数、类)时候，都会天生自带一个 prototype 属性，这个属性指向函数的原型对象。

当函数经过 new 调用时，这个函数就成为了构造函数，返回一个全新的实例对象，这个实例对象有一个**proto**属性，指向构造函数的原型对象。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de955a81892535~tplv-t2oaga2asx-watermark.awebp)

### 2.能不能描述一下原型链？

JavaScript 对象通过**proto** 指向父类对象，直到指向 Object 对象为止，这样就形成了一个原型指向的链条, 即原型链。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de955ca89f6091~tplv-t2oaga2asx-watermark.awebp)

- 对象的 hasOwnProperty() 来检查对象自身中是否含有该属性
- 使用 in 检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回 true

## 第六篇: JS 如何实现继承？

### 第一种: 借助 call

```js
function Parent1() {
  this.name = 'parent1';
}
function Child1() {
  Parent1.call(this);
  this.type = 'child1';
}
console.log(new Child1());
复制代码;
```

这样写的时候子类虽然能够拿到父类的属性值，但是问题是父类原型对象中一旦存在方法那么子类无法继承。那么引出下面的方法。

### 第二种: 借助原型链

```js
function Parent2() {
  this.name = 'parent2';
  this.play = [1, 2, 3];
}
function Child2() {
  this.type = 'child2';
}
Child2.prototype = new Parent2();

console.log(new Child2());
复制代码;
```

看似没有问题，父类的方法和属性都能够访问，但实际上有一个潜在的不足。举个例子：

```js
var s1 = new Child2();
var s2 = new Child2();
s1.play.push(4);
console.log(s1.play, s2.play);
复制代码;
```

可以看到控制台：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de955fbdbd9d9c~tplv-t2oaga2asx-watermark.awebp)

明明我只改变了 s1 的 play 属性，为什么 s2 也跟着变了呢？很简单，因为两个实例使用的是同一个原型对象。

那么还有更好的方式么？

### 第三种：将前两种组合

```js
function Parent3() {
  this.name = 'parent3';
  this.play = [1, 2, 3];
}
function Child3() {
  Parent3.call(this);
  this.type = 'child3';
}
Child3.prototype = new Parent3();
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4);
console.log(s3.play, s4.play);
复制代码;
```

可以看到控制台：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de95621c0cdde1~tplv-t2oaga2asx-watermark.awebp)

之前的问题都得以解决。但是这里又徒增了一个新问题，那就是 Parent3 的构造函数会多执行了一次（Child3.prototype = new Parent3();）。这是我们不愿看到的。那么如何解决这个问题？

### 第四种: 组合继承的优化 1

```js
function Parent4() {
  this.name = 'parent4';
  this.play = [1, 2, 3];
}
function Child4() {
  Parent4.call(this);
  this.type = 'child4';
}
Child4.prototype = Parent4.prototype;
复制代码;
```

这里让将父类原型对象直接给到子类，父类构造函数只执行一次，而且父类属性和方法均能访问，但是我们来测试一下：

```js
var s3 = new Child4();
var s4 = new Child4();
console.log(s3);
复制代码;
```

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/20/16de956480812408~tplv-t2oaga2asx-watermark.awebp)

子类实例的构造函数是 Parent4，显然这是不对的，应该是 Child4。

### 第五种(最推荐使用): 组合继承的优化 1

```js
function Parent5() {
  this.name = 'parent5';
  this.play = [1, 2, 3];
}
function Child5() {
  Parent5.call(this);
  this.type = 'child5';
}
Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;
复制代码;
```

这是最推荐的一种方式，接近完美的继承，它的名字也叫做寄生组合继承。

### ES6 的 extends 被编译后的 JavaScript 代码

ES6 的代码最后都是要在浏览器上能够跑起来的，这中间就利用了 babel 这个编译工具，将 ES6 的代码编译成 ES5 让一些不支持新语法的浏览器也能运行。

那最后编译成了什么样子呢？

```js
function _possibleConstructorReturn(self, call) {
  // ...
  return call &&
    (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  // ...
  //看到没有
  subClass.prototype = Object.create(
    superClass && superClass.prototype,
    {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true,
      },
    },
  );
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var Parent = function Parent() {
  // 验证是否是 Parent 构造出来的 this
  _classCallCheck(this, Parent);
};

var Child = (function(_Parent) {
  _inherits(Child, _Parent);

  function Child() {
    _classCallCheck(this, Child);

    return _possibleConstructorReturn(
      this,
      (
        Child.__proto__ || Object.getPrototypeOf(Child)
      ).apply(this, arguments),
    );
  }

  return Child;
})(Parent);
复制代码;
```

核心是\_inherits 函数，可以看到它采用的依然也是第五种方式————寄生组合继承方式，同时证明了这种方式的成功。不过这里加了一个 Object.setPrototypeOf(subClass, superClass)，这是用来干啥的呢？

答案是用来继承父类的静态方法。这也是原来的继承方式疏忽掉的地方。

```!
追问: 面向对象的设计一定是好的设计吗？
复制代码
```

不一定。从继承的角度说，这一设计是存在巨大隐患的。

### 从设计思想上谈谈继承本身的问题

假如现在有不同品牌的车，每辆车都有 drive、music、addOil 这三个方法。

```js
class Car {
  constructor(id) {
    this.id = id;
  }
  drive() {
    console.log('wuwuwu!');
  }
  music() {
    console.log('lalala!');
  }
  addOil() {
    console.log('哦哟！');
  }
}
class otherCar extends Car {}
复制代码;
```

现在可以实现车的功能，并且以此去扩展不同的车。

但是问题来了，新能源汽车也是车，但是它并不需要 addOil(加油)。

如果让新能源汽车的类继承 Car 的话，也是有问题的，俗称"大猩猩和香蕉"的问题。大猩猩手里有香蕉，但是我现在明明只需要香蕉，却拿到了一只大猩猩。也就是说加油这个方法，我现在是不需要的，但是由于继承的原因，也给到子类了。

> 继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。

当然你可能会说，可以再创建一个父类啊，把加油的方法给去掉，但是这也是有问题的，一方面父类是无法描述所有子类的细节情况的，为了不同的子类特性去增加不同的父类，`代码势必会大量重复`，另一方面一旦子类有所变动，父类也要进行相应的更新，`代码的耦合性太高`，维护性不好。

那如何来解决继承的诸多问题呢？

用组合，这也是当今编程语法发展的趋势，比如 golang 完全采用的是面向组合的设计方式。

顾名思义，面向组合就是先设计一系列零件，然后将这些零件进行拼装，来形成不同的实例或者类。

```js
function drive() {
  console.log('wuwuwu!');
}
function music() {
  console.log('lalala!');
}
function addOil() {
  console.log('哦哟！');
}

let car = compose(drive, music, addOil);
let newEnergyCar = compose(drive, music);
复制代码;
```

代码干净，复用性也很好。这就是面向组合的设计方式。

## 第七篇: 函数的 arguments 为什么不是数组？如何转化成数组？

因为 arguments 本身并不能调用数组方法，它是一个另外一种对象类型，只不过属性从 0 开始排，依次为 0，1，2...最后还有 callee 和 length 属性。我们也把这样的对象称为类数组。

常见的类数组还有：

- 1. 用 getElementsByTagName/ClassName()获得的 HTMLCollection
- 1. 用 querySelector 获得的 nodeList

那这导致很多数组的方法就不能用了，必要时需要我们将它们转换成数组，有哪些方法呢？

### 1. Array.prototype.slice.call()

```js
function sum(a, b) {
  let args = Array.prototype.slice.call(arguments);
  console.log(args.reduce((sum, cur) => sum + cur)); //args可以调用数组原生的方法啦
}
sum(1, 2); //3
复制代码;
```

### 2. Array.from()

```js
function sum(a, b) {
  let args = Array.from(arguments);
  console.log(args.reduce((sum, cur) => sum + cur)); //args可以调用数组原生的方法啦
}
sum(1, 2); //3
复制代码;
```

这种方法也可以用来转换 Set 和 Map 哦！

### 3. ES6 展开运算符

```js
function sum(a, b) {
  let args = [...arguments];
  console.log(args.reduce((sum, cur) => sum + cur)); //args可以调用数组原生的方法啦
}
sum(1, 2); //3
复制代码;
```

### 4. 利用 concat+apply

```js
function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments); //apply方法会把第二个参数展开
  console.log(args.reduce((sum, cur) => sum + cur)); //args可以调用数组原生的方法啦
}
sum(1, 2); //3
复制代码;
```

当然，最原始的方法就是再创建一个数组，用 for 循环把类数组的每个属性值放在里面，过于简单，就不浪费篇幅了。

## 第八篇: forEach 中 return 有效果吗？如何中断 forEach 循环？

在 forEach 中用 return 不会返回，函数会继续执行。

```js
let nums = [1, 2, 3];
nums.forEach((item, index) => {
  return; //无效
});
复制代码;
```

中断方法：

1. 使用 try 监视代码块，在需要中断的地方抛出异常。
2. 官方推荐方法（替换方法）：用 every 和 some 替代 forEach 函数。every 在碰到 return false 的时候，中止循环。some 在碰到 return true 的时候，中止循环

## 第九篇: JS 判断数组中是否包含某个值

### 方法一：array.indexOf

> 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1。

```js
var arr = [1, 2, 3, 4];
var index = arr.indexOf(3);
console.log(index);
复制代码;
```

### 方法二：array.includes(searcElement[,fromIndex])

> 此方法判断数组中是否存在某个值，如果存在返回 true，否则返回 false

```js
var arr = [1, 2, 3, 4];
if (arr.includes(3)) console.log('存在');
else console.log('不存在');
复制代码;
```

### 方法三：array.find(callback[,thisArg])

> 返回数组中满足条件的**第一个元素的值**，如果没有，返回 undefined

```js
var arr = [1, 2, 3, 4];
var result = arr.find((item) => {
  return item > 3;
});
console.log(result);
复制代码;
```

### 方法四：array.findeIndex(callback[,thisArg])

> 返回数组中满足条件的第一个元素的下标，如果没有找到，返回`-1`]

```js
var arr = [1, 2, 3, 4];
var result = arr.findIndex((item) => {
  return item > 3;
});
console.log(result);
复制代码;
```

当然，for 循环当然是没有问题的，这里讨论的是数组方法，就不再展开了。

## 第十篇: JS 中 flat---数组扁平化

对于前端项目开发过程中，偶尔会出现层叠数据结构的数组，我们需要将多层级数组转化为一级数组（即提取嵌套数组元素最终合并为一个数组），使其内容合并且展开。那么该如何去实现呢？

需求:多维数组=>一维数组

```js
let ary = [1, [2, [3, [4, 5]]], 6]; // -> [1, 2, 3, 4, 5, 6]
let str = JSON.stringify(ary);
复制代码;
```

### 1. 调用 ES6 中的 flat 方法

```js
ary = ary.flat(Infinity);
复制代码;
```

### 2. replace + split

```js
ary = str.replace(/(\[|\])/g, '').split(',');
复制代码;
```

### 3. replace + JSON.parse

```js
str = str.replace(/(\[|\])/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
复制代码;
```

### 4. 普通递归

```js
let result = [];
let fn = function(ary) {
  for (let i = 0; i < ary.length; i++) {
    let item = ary[i];
    if (Array.isArray(ary[i])) {
      fn(item);
    } else {
      result.push(item);
    }
  }
};
复制代码;
```

### 5. 利用 reduce 函数迭代

```js
function flatten(ary) {
  return ary.reduce((pre, cur) => {
    return pre.concat(
      Array.isArray(cur) ? flatten(cur) : cur,
    );
  }, []);
}
let ary = [1, 2, [3, 4], [5, [6, 7]]];
console.log(flatten(ary));
复制代码;
```

### 6：扩展运算符

```js
//只要有一个元素有数组，那么循环继续
while (ary.some(Array.isArray)) {
  ary = [].concat(...ary);
}
复制代码;
```

这是一个比较实用而且很容易被问到的问题，欢迎大家交流补充。

## 第十一篇: JS 数组的高阶函数——基础篇

### 1.什么是高阶函数

概念非常简单，如下:

> `一个函数`就可以接收另一个函数作为参数或者返回值为一个函数，`这种函数`就称之为高阶函数。

那对应到数组中有哪些方法呢？

### 2.数组中的高阶函数

#### 1.map

- 参数:接受两个参数，一个是回调函数，一个是回调函数的 this 值(可选)。

其中，回调函数被默认传入三个值，依次为当前元素、当前索引、整个数组。

- 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
- 对原来的数组没有影响

```js
let nums = [1, 2, 3];
let obj = { val: 5 };
let newNums = nums.map(function(item, index, array) {
  return item + index + array[index] + this.val;
  //对第一个元素，1 + 0 + 1 + 5 = 7
  //对第二个元素，2 + 1 + 2 + 5 = 10
  //对第三个元素，3 + 2 + 3 + 5 = 13
}, obj);
console.log(newNums); //[7, 10, 13]
复制代码;
```

当然，后面的参数都是可选的 ，不用的话可以省略。

#### 2. reduce

- 参数: 接收两个参数，一个为回调函数，另一个为初始值。回调函数中四个默认参数，依次为积累值、当前值、当前索引和整个数组。

```js
let nums = [1, 2, 3];
// 多个数的加和
let newNums = nums.reduce(function(
  preSum,
  curVal,
  currentIndex,
  array,
) {
  return preSum + curVal;
},
0);
console.log(newNums); //6
复制代码;
```

不传默认值会怎样？

不传默认值会自动以第一个元素为初始值，然后从第二个元素开始依次累计。

#### 3. filter

参数: 一个函数参数。这个函数接受一个默认参数，就是当前元素。这个作为参数的函数返回值为一个布尔类型，决定元素是否保留。

filter 方法返回值为一个新的数组，这个数组里面包含参数里面所有被保留的项。

```js
let nums = [1, 2, 3];
// 保留奇数项
let oddNums = nums.filter((item) => item % 2);
console.log(oddNums);
复制代码;
```

#### 4. sort

参数: 一个用于比较的函数，它有两个默认参数，分别是代表比较的两个元素。

举个例子:

```js
let nums = [2, 3, 1];
//两个比较的元素分别为a, b
nums.sort(function(a, b) {
  if (a > b) return 1;
  else if (a < b) return -1;
  else if (a == b) return 0;
});
复制代码;
```

当比较函数返回值大于 0，则 a 在 b 的后面，即 a 的下标应该比 b 大。

反之，则 a 在 b 的后面，即 a 的下标比 b 小。

整个过程就完成了一次升序的排列。

当然还有一个需要注意的情况，就是比较函数不传的时候，是如何进行排序的？

> 答案是将数字转换为字符串，然后根据字母 unicode 值进行升序排序，也就是根据字符串的比较规则进行升序排序。

## 第十二篇: 能不能实现数组 map 方法 ?

依照 [ecma262 草案](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-array.prototype.map)，实现的 map 的规范如下:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e311d99e860405~tplv-t2oaga2asx-watermark.awebp)

下面根据草案的规定一步步来模拟实现 map 函数:

```js
Array.prototype.map = function(callbackFn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError(
      "Cannot read property 'map' of null or undefined",
    );
  }
  // 处理回调类型异常
  if (
    Object.prototype.toString.call(callbackfn) !=
    '[object Function]'
  ) {
    throw new TypeError(callbackfn + ' is not a function');
  }
  // 草案中提到要先转换为对象
  let O = Object(this);
  let T = thisArg;

  let len = O.length >>> 0;
  let A = new Array(len);
  for (let k = 0; k < len; k++) {
    // 还记得原型链那一节提到的 in 吗？in 表示在原型链查找
    // 如果用 hasOwnProperty 是有问题的，它只能找私有属性
    if (k in O) {
      let kValue = O[k];
      // 依次传入this, 当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, KValue, k, O);
      A[k] = mappedValue;
    }
  }
  return A;
};
复制代码;
```

这里解释一下, length >>> 0, 字面意思是指"右移 0 位"，但实际上是把前面的空位用 0 填充，这里的作用是保证 len 为数字且为整数。

举几个特例：

```js
null >>> 0  //0

undefined >>> 0  //0

void(0) >>> 0  //0

function a (){};  a >>> 0  //0

[] >>> 0  //0

var a = {}; a >>> 0  //0

123123 >>> 0  //123123

45.2 >>> 0  //45

0 >>> 0  //0

-0 >>> 0  //0

-1 >>> 0  //4294967295

-1212 >>> 0  //4294966084
复制代码
```

总体实现起来并没那么难，需要注意的就是使用 in 来进行原型链查找。同时，如果没有找到就不处理，能有效处理稀疏数组的情况。

最后给大家奉上 V8 源码，参照源码检查一下，其实还是实现得很完整了。

```js
function ArrayMap(f, receiver) {
  CHECK_OBJECT_COERCIBLE(this, 'Array.prototype.map');

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  if (!IS_CALLABLE(f))
    throw %make_type_error(kCalledNonCallable, f);
  var result = ArraySpeciesCreate(array, length);
  for (var i = 0; i < length; i++) {
    if (i in array) {
      var element = array[i];
      %CreateDataProperty(
        result,
        i,
        %_Call(f, receiver, element, i, array),
      );
    }
  }
  return result;
}
复制代码;
```

参考:

[V8 源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js%23L1132)

[Array 原型方法源码实现大揭秘](https://juejin.cn/post/6844903938890661896#comment)

[ecma262 草案](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-array.prototype.map)

## 第十三篇: 能不能实现数组 reduce 方法 ?

依照 [ecma262 草案](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-array.prototype.reduce)，实现的 reduce 的规范如下:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e311ed2bfa8fad~tplv-t2oaga2asx-watermark.awebp)

其中有几个核心要点:

1、初始值不传怎么处理

2、回调函数的参数有哪些，返回值如何处理。

```js
Array.prototype.reduce = function(
  callbackfn,
  initialValue,
) {
  // 异常处理，和 map 一样
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError(
      "Cannot read property 'reduce' of null or undefined",
    );
  }
  // 处理回调类型异常
  if (
    Object.prototype.toString.call(callbackfn) !=
    '[object Function]'
  ) {
    throw new TypeError(callbackfn + ' is not a function');
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let k = 0;
  let accumulator = initialValue;
  if (accumulator === undefined) {
    for (; k < len; k++) {
      // 查找原型链
      if (k in O) {
        accumulator = O[k];
        k++;
        break;
      }
    }
  }
  // 表示数组全为空
  if (k === len && accumulator === undefined)
    throw new Error('Each element of the array is empty');
  for (; k < len; k++) {
    if (k in O) {
      // 注意，核心！
      accumulator = callbackfn.call(
        undefined,
        accumulator,
        O[k],
        k,
        O,
      );
    }
  }
  return accumulator;
};
复制代码;
```

其实是从最后一项开始遍历，通过原型链查找跳过空项。

最后给大家奉上 V8 源码，以供大家检查:

```js
function ArrayReduce(callback, current) {
  CHECK_OBJECT_COERCIBLE(this, 'Array.prototype.reduce');

  // Pull out the length so that modifications to the length in the
  // loop will not affect the looping and side effects are visible.
  var array = TO_OBJECT(this);
  var length = TO_LENGTH(array.length);
  return InnerArrayReduce(
    callback,
    current,
    array,
    length,
    arguments.length,
  );
}

function InnerArrayReduce(
  callback,
  current,
  array,
  length,
  argumentsLength,
) {
  if (!IS_CALLABLE(callback)) {
    throw %make_type_error(kCalledNonCallable, callback);
  }

  var i = 0;
  find_initial: if (argumentsLength < 2) {
    for (; i < length; i++) {
      if (i in array) {
        current = array[i++];
        break find_initial;
      }
    }
    throw %make_type_error(kReduceNoInitial);
  }

  for (; i < length; i++) {
    if (i in array) {
      var element = array[i];
      current = callback(current, element, i, array);
    }
  }
  return current;
}
复制代码;
```

参考:

[V8 源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js%23L1132)

[ecma262 草案](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-array.prototype.map)

## 第十四篇: 能不能实现数组 push、pop 方法 ?

参照 ecma262 草案的规定，关于 push 和 pop 的规范如下图所示:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e311f4fa483cc2~tplv-t2oaga2asx-watermark.awebp)

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e311fa338c2ecb~tplv-t2oaga2asx-watermark.awebp)

首先来实现一下 push 方法:

```js
Array.prototype.push = function(...items) {
  let O = Object(this);
  let len = this.length >>> 0;
  let argCount = items.length >>> 0;
  // 2 ** 53 - 1 为JS能表示的最大正整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError(
      'The number of array is over the max value restricted!',
    );
  }
  for (let i = 0; i < argCount; i++) {
    O[len + i] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
};
复制代码;
```

亲测已通过 MDN 上所有测试用例。[MDN 链接](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray%2Fpush)

然后来实现 pop 方法:

```js
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  }
  len--;
  let value = O[len];
  delete O[len];
  O.length = len;
  return value;
};
复制代码;
```

亲测已通过 MDN 上所有测试用例。[MDN 链接](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray%2Fpop)

参考链接:

[V8 数组源码](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js)

[ecma262 规范草案](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262)

[MDN 文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray)

## 第十五篇: 能不能实现数组 filter 方法 ?

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e312629684aafb~tplv-t2oaga2asx-watermark.awebp)

代码如下:

```js
Array.prototype.filter = function(callbackfn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError(
      "Cannot read property 'filter' of null or undefined",
    );
  }
  // 处理回调类型异常
  if (
    Object.prototype.toString.call(callbackfn) !=
    '[object Function]'
  ) {
    throw new TypeError(callbackfn + ' is not a function');
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let resLen = 0;
  let res = [];
  for (let i = 0; i < len; i++) {
    if (i in O) {
      let element = O[i];
      if (callbackfn.call(thisArg, O[i], i, O)) {
        res[resLen++] = element;
      }
    }
  }
  return res;
};
复制代码;
```

MDN 上所有测试用例亲测通过。

参考:

[V8 数组部分源码第 1025 行](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js)

[MDN 中 filter 文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray%2Ffilter)

## 第十六篇: 能不能实现数组 splice 方法 ?

splice 可以说是最受欢迎的数组方法之一，api 灵活，使用方便。现在来梳理一下用法:

- 1. splice(position, count) 表示从 position 索引的位置开始，删除 count 个元素
- 1. splice(position, 0, ele1, ele2, ...) 表示从 position 索引的元素后面插入一系列的元素
- 1. splice(postion, count, ele1, ele2, ...) 表示从 position 索引的位置开始，删除 count 个元素，然后再插入一系列的元素
- 1. 返回值为`被删除元素`组成的`数组`。

接下来我们实现这个方法。

参照 ecma262 草案的规定，详情请[点击](https://link.juejin.cn?target=https%3A%2F%2Ftc39.es%2Fecma262%2F%23sec-array.prototype.splice)。

首先我们梳理一下实现的思路。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e3121dad3976ea~tplv-t2oaga2asx-watermark.awebp)

### 初步实现

```js
Array.prototype.splice = function(
  startIndex,
  deleteCount,
  ...addElements
) {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length;
  let deleteArr = new Array(deleteCount);

  // 拷贝删除的元素
  sliceDeleteElements(
    array,
    startIndex,
    deleteCount,
    deleteArr,
  );
  // 移动删除元素后面的元素
  movePostElements(
    array,
    startIndex,
    len,
    deleteCount,
    addElements,
  );
  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }
  array.length = len - deleteCount + addElements.length;
  return deleteArr;
};
复制代码;
```

先拷贝删除的元素，如下所示:

```js
const sliceDeleteElements = (
  array,
  startIndex,
  deleteCount,
  deleteArr,
) => {
  for (let i = 0; i < deleteCount; i++) {
    let index = startIndex + i;
    if (index in array) {
      let current = array[index];
      deleteArr[i] = current;
    }
  }
};
复制代码;
```

然后对删除元素后面的元素进行挪动, 挪动分为三种情况:

1. 添加的元素和删除的元素个数相等
2. 添加的元素个数小于删除的元素
3. 添加的元素个数大于删除的元素

当两者相等时，

```js
const movePostElements = (
  array,
  startIndex,
  len,
  deleteCount,
  addElements,
) => {
  if (deleteCount === addElements.length) return;
};
复制代码;
```

当添加的元素个数小于删除的元素时, 如图所示:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e31220582da903~tplv-t2oaga2asx-watermark.awebp)

```js
const movePostElements = (
  array,
  startIndex,
  len,
  deleteCount,
  addElements,
) => {
  //...
  // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
  if (deleteCount > addElements.length) {
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    // 一共需要挪动 len - startIndex - deleteCount 个元素
    for (let i = startIndex + deleteCount; i < len; i++) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i - (deleteCount - addElements.length);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
    // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
    // 目前长度为 len + addElements - deleteCount
    for (
      let i = len - 1;
      i >= len + addElements.length - deleteCount;
      i--
    ) {
      delete array[i];
    }
  }
};
复制代码;
```

当添加的元素个数大于删除的元素时, 如图所示:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e3122363235833~tplv-t2oaga2asx-watermark.awebp)

```js
const movePostElements = (
  array,
  startIndex,
  len,
  deleteCount,
  addElements,
) => {
  //...
  if (deleteCount < addElements.length) {
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
    for (
      let i = len - 1;
      i >= startIndex + deleteCount;
      i--
    ) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i + (addElements.length - deleteCount);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
  }
};
复制代码;
```

### 优化一: 参数的边界情况

当用户传来非法的 startIndex 和 deleteCount 或者负索引的时候，需要我们做出特殊的处理。

```js
const computeStartIndex = (startIndex, len) => {
  // 处理索引负数的情况
  if (startIndex < 0) {
    return startIndex + len > 0 ? startIndex + len : 0;
  }
  return startIndex >= len ? len : startIndex;
};

const computeDeleteCount = (
  startIndex,
  len,
  deleteCount,
  argumentsLen,
) => {
  // 删除数目没有传，默认删除startIndex及后面所有的
  if (argumentsLen === 1) return len - startIndex;
  // 删除数目过小
  if (deleteCount < 0) return 0;
  // 删除数目过大
  if (deleteCount > len - startIndex)
    return len - startIndex;
  return deleteCount;
};

Array.prototype.splice = function(
  startIndex,
  deleteCount,
  ...addElements
) {
  //,...
  let deleteArr = new Array(deleteCount);

  // 下面参数的清洗工作
  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(
    startIndex,
    len,
    deleteCount,
    argumentsLen,
  );

  // 拷贝删除的元素
  sliceDeleteElements(
    array,
    startIndex,
    deleteCount,
    deleteArr,
  );
  //...
};
复制代码;
```

### 优化二: 数组为密封对象或冻结对象

什么是密封对象?

> 密封对象是不可扩展的对象，而且已有成员的[[Configurable]]属性被设置为 false，这意味着不能添加、删除方法和属性。但是属性值是可以修改的。

什么是冻结对象？

> 冻结对象是最严格的防篡改级别，除了包含密封对象的限制外，还不能修改属性值。

接下来，我们来把这两种情况一一排除。

```js
// 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
if (
  Object.isSealed(array) &&
  deleteCount !== addElements.length
) {
  throw new TypeError('the object is a sealed object!');
} else if (
  Object.isFrozen(array) &&
  (deleteCount > 0 || addElements.length > 0)
) {
  throw new TypeError('the object is a frozen object!');
}
复制代码;
```

好了，现在就写了一个比较完整的 splice，如下:

```js
const sliceDeleteElements = (
  array,
  startIndex,
  deleteCount,
  deleteArr,
) => {
  for (let i = 0; i < deleteCount; i++) {
    let index = startIndex + i;
    if (index in array) {
      let current = array[index];
      deleteArr[i] = current;
    }
  }
};

const movePostElements = (
  array,
  startIndex,
  len,
  deleteCount,
  addElements,
) => {
  // 如果添加的元素和删除的元素个数相等，相当于元素的替换，数组长度不变，被删除元素后面的元素不需要挪动
  if (deleteCount === addElements.length) return;
  // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
  else if (deleteCount > addElements.length) {
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    // 一共需要挪动 len - startIndex - deleteCount 个元素
    for (let i = startIndex + deleteCount; i < len; i++) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i - (deleteCount - addElements.length);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
    // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
    // 目前长度为 len + addElements - deleteCount
    for (
      let i = len - 1;
      i >= len + addElements.length - deleteCount;
      i--
    ) {
      delete array[i];
    }
  } else if (deleteCount < addElements.length) {
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
    for (
      let i = len - 1;
      i >= startIndex + deleteCount;
      i--
    ) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i + (addElements.length - deleteCount);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
  }
};

const computeStartIndex = (startIndex, len) => {
  // 处理索引负数的情况
  if (startIndex < 0) {
    return startIndex + len > 0 ? startIndex + len : 0;
  }
  return startIndex >= len ? len : startIndex;
};

const computeDeleteCount = (
  startIndex,
  len,
  deleteCount,
  argumentsLen,
) => {
  // 删除数目没有传，默认删除startIndex及后面所有的
  if (argumentsLen === 1) return len - startIndex;
  // 删除数目过小
  if (deleteCount < 0) return 0;
  // 删除数目过大
  if (deleteCount > len - startIndex)
    return len - startIndex;
  return deleteCount;
};

Array.prototype.splice = function(
  startIndex,
  deleteCount,
  ...addElements
) {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length >>> 0;
  let deleteArr = new Array(deleteCount);

  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(
    startIndex,
    len,
    deleteCount,
    argumentsLen,
  );

  // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
  if (
    Object.isSealed(array) &&
    deleteCount !== addElements.length
  ) {
    throw new TypeError('the object is a sealed object!');
  } else if (
    Object.isFrozen(array) &&
    (deleteCount > 0 || addElements.length > 0)
  ) {
    throw new TypeError('the object is a frozen object!');
  }

  // 拷贝删除的元素
  sliceDeleteElements(
    array,
    startIndex,
    deleteCount,
    deleteArr,
  );
  // 移动删除元素后面的元素
  movePostElements(
    array,
    startIndex,
    len,
    deleteCount,
    addElements,
  );

  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }

  array.length = len - deleteCount + addElements.length;

  return deleteArr;
};
复制代码;
```

以上代码对照[MDN 文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FArray%2Fsplice)中的所有测试用例亲测通过。

相关测试代码请前往: [传送门](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fsanyuan0704%2Ffrontend_daily_question%2Fblob%2Fmaster%2Ftest_splice.js)

最后给大家奉上 V8 源码，供大家检查： [V8 数组 splice 源码第 660 行](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js%23L660)

## 第十七篇: 能不能实现数组 sort 方法？

估计大家对 JS 数组的 sort 方法已经不陌生了，之前也对它的用法做了详细的总结。那，它的内部是如何来实现的呢？如果说我们能够进入它的内部去看一看， 理解背后的设计，会使我们的思维和素养得到不错的提升。

sort 方法在 V8 内部相对与其他方法而言是一个比较高深的算法，对于很多边界情况做了反复的优化，但是这里我们不会直接拿源码来干讲。我们会来根据源码的思路，实现一个 跟引擎性能**一样**的排序算法，并且一步步拆解其中的奥秘。

### V8 引擎的思路分析

首先大概梳理一下源码中排序的思路:

设要排序的元素个数是 n：

- 当 n <= 10 时，采用`插入排序`

- 当 n > 10 时，采用

  ```
  三路快速排序
  ```

  - 10 < n <= 1000, 采用中位数作为哨兵元素
  - n > 1000, 每隔 200~215 个元素挑出一个元素，放到一个新数组，然后对它排序，找到中间位置的数，以此作为中位数

在动手之前，我觉得我们有必要**为什么**这么做搞清楚。

第一、为什么元素个数少的时候要采用插入排序？

虽然`插入排序`理论上说是 O(n^2)的算法，`快速排序`是一个 O(nlogn)级别的算法。但是别忘了，这只是理论上的估算，在实际情况中两者的算法复杂度前面都会有一个系数的， 当 n 足够小的时候，快速排序`nlogn`的优势会越来越小，倘若插入排序 O(n^2)前面的系数足够小，那么就会超过快排。而事实上正是如此，`插入排序`经过优化以后对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排。

因此，对于很小的数据量，应用`插入排序`是一个非常不错的选择。

第二、为什么要花这么大的力气选择哨兵元素？

因为`快速排序`的性能瓶颈在于递归的深度，最坏的情况是每次的哨兵都是最小元素或者最大元素，那么进行 partition(一边是小于哨兵的元素，另一边是大于哨兵的元素)时，就会有一边是空的，那么这么排下去，递归的层数就达到了 n, 而每一层的复杂度是 O(n)，因此快排这时候会退化成 O(n^2)级别。

这种情况是要尽力避免的！如果来避免？

就是让哨兵元素进可能地处于数组的中间位置，让最大或者最小的情况尽可能少。这时候，你就能理解 V8 里面所做的种种优化了。

接下来，我们来一步步实现的这样的官方排序算法。

### 插入排序及优化

最初的插入排序可能是这样写的:

```js
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for (let i = start; i < end; i++) {
    let j;
    for (j = i; j > start && arr[j - 1] > arr[j]; j--) {
      let temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
    }
  }
  return;
};
复制代码;
```

看似可以正确的完成排序，但实际上交换元素会有相当大的性能消耗，我们完全可以用变量覆盖的方式来完成，如图所示:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e3124af5479387~tplv-t2oaga2asx-watermark.awebp)

优化后代码如下:

```js
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for (let i = start; i < end; i++) {
    let e = arr[i];
    let j;
    for (j = i; j > start && arr[j - 1] > e; j--)
      arr[j] = arr[j - 1];
    arr[j] = e;
  }
  return;
};
复制代码;
```

接下来正式进入到 sort 方法。

### 寻找哨兵元素

sort 的骨架大致如下:

```js
Array.prototype.sort = (comparefn) => {
  let array = Object(this);
  let length = array.length >>> 0;
  return InnerArraySort(array, length, comparefn);
};

const InnerArraySort = (array, length, comparefn) => {
  // 比较函数未传入
  if (
    Object.prototype.toString.call(callbackfn) !==
    '[object Function]'
  ) {
    comparefn = function(x, y) {
      if (x === y) return 0;
      x = x.toString();
      y = y.toString();
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  const insertSort = () => {
    //...
  };
  const getThirdIndex = (a, from, to) => {
    // 元素个数大于1000时寻找哨兵元素
  };
  const quickSort = (a, from, to) => {
    //哨兵位置
    let thirdIndex = 0;
    while (true) {
      if (to - from <= 10) {
        insertSort(a, from, to);
        return;
      }
      if (to - from > 1000) {
        thirdIndex = getThirdIndex(a, from, to);
      } else {
        // 小于1000 直接取中点
        thirdIndex = from + ((to - from) >> 2);
      }
    }
    //下面开始快排
  };
};
复制代码;
```

我们先来把求取哨兵位置的代码实现一下:

```js
const getThirdIndex = (a, from, to) => {
  let tmpArr = [];
  // 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的
  let increment = 200 + ((to - from) & 15);
  let j = 0;
  from += 1;
  to -= 1;
  for (let i = from; i < to; i += increment) {
    tmpArr[j] = [i, a[i]];
    j++;
  }
  // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
  tmpArr.sort(function(a, b) {
    return comparefn(a[1], b[1]);
  });
  let thirdIndex = tmpArr[tmpArr.length >> 1][0];
  return thirdIndex;
};
复制代码;
```

### 完成快排

接下来我们来完成快排的具体代码：

```js
const _sort = (a, b, c) => {
  let arr = [a, b, c];
  insertSort(arr, 0, 3);
  return arr;
};

const quickSort = (a, from, to) => {
  //...
  // 上面我们拿到了thirdIndex
  // 现在我们拥有三个元素，from, thirdIndex, to
  // 为了再次确保 thirdIndex 不是最值，把这三个值排序
  [a[from], a[thirdIndex], a[to - 1]] = _sort(
    a[from],
    a[thirdIndex],
    a[to - 1],
  );
  // 现在正式把 thirdIndex 作为哨兵
  let pivot = a[thirdIndex];
  // 正式进入快排
  let lowEnd = from + 1;
  let highStart = to - 1;
  // 现在正式把 thirdIndex 作为哨兵, 并且lowEnd和thirdIndex交换
  let pivot = a[thirdIndex];
  a[thirdIndex] = a[lowEnd];
  a[lowEnd] = pivot;

  // [lowEnd, i)的元素是和pivot相等的
  // [i, highStart) 的元素是需要处理的
  for (let i = lowEnd + 1; i < highStart; i++) {
    let element = a[i];
    let order = comparefn(element, pivot);
    if (order < 0) {
      a[i] = a[lowEnd];
      a[lowEnd] = element;
      lowEnd++;
    } else if (order > 0) {
      do {
        highStart--;
        if (highStart === i) break;
        order = comparefn(a[highStart], pivot);
      } while (order > 0);
      // 现在 a[highStart] <= pivot
      // a[i] > pivot
      // 两者交换
      a[i] = a[highStart];
      a[highStart] = element;
      if (order < 0) {
        // a[i] 和 a[lowEnd] 交换
        element = a[i];
        a[i] = a[lowEnd];
        a[lowEnd] = element;
        lowEnd++;
      }
    }
  }
  // 永远切分大区间
  if (lowEnd - from > to - highStart) {
    // 继续切分lowEnd ~ from 这个区间
    to = lowEnd;
    // 单独处理小区间
    quickSort(a, highStart, to);
  } else if (lowEnd - from <= to - highStart) {
    from = highStart;
    quickSort(a, from, lowEnd);
  }
};
复制代码;
```

### 测试结果

测试结果如下:

一万条数据:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e3124fa130ab19~tplv-t2oaga2asx-watermark.awebp)

十万条数据:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e312533c86a644~tplv-t2oaga2asx-watermark.awebp)

一百万条数据:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e3125824bfe0f8~tplv-t2oaga2asx-watermark.awebp)

一千万条数据:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/3/16e3125b7ba2ad38~tplv-t2oaga2asx-watermark.awebp)

结果仅供大家参考，因为不同的 node 版本对于部分细节的实现可能不一样，我现在的版本是 v10.15。

从结果可以看到，目前版本的 node 对于有序程度较高的数据是处理的不够好的，而我们刚刚实现的排序通过反复确定哨兵的位置就能 有效的规避快排在这一场景下的劣势。

最后给大家完整版的 sort 代码:

```js
const sort = (arr, comparefn) => {
  let array = Object(arr);
  let length = array.length >>> 0;
  return InnerArraySort(array, length, comparefn);
};

const InnerArraySort = (array, length, comparefn) => {
  // 比较函数未传入
  if (
    Object.prototype.toString.call(comparefn) !==
    '[object Function]'
  ) {
    comparefn = function(x, y) {
      if (x === y) return 0;
      x = x.toString();
      y = y.toString();
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  const insertSort = (arr, start = 0, end) => {
    end = end || arr.length;
    for (let i = start; i < end; i++) {
      let e = arr[i];
      let j;
      for (
        j = i;
        j > start && comparefn(arr[j - 1], e) > 0;
        j--
      )
        arr[j] = arr[j - 1];
      arr[j] = e;
    }
    return;
  };
  const getThirdIndex = (a, from, to) => {
    let tmpArr = [];
    // 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的
    let increment = 200 + ((to - from) & 15);
    let j = 0;
    from += 1;
    to -= 1;
    for (let i = from; i < to; i += increment) {
      tmpArr[j] = [i, a[i]];
      j++;
    }
    // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
    tmpArr.sort(function(a, b) {
      return comparefn(a[1], b[1]);
    });
    let thirdIndex = tmpArr[tmpArr.length >> 1][0];
    return thirdIndex;
  };

  const _sort = (a, b, c) => {
    let arr = [];
    arr.push(a, b, c);
    insertSort(arr, 0, 3);
    return arr;
  };

  const quickSort = (a, from, to) => {
    //哨兵位置
    let thirdIndex = 0;
    while (true) {
      if (to - from <= 10) {
        insertSort(a, from, to);
        return;
      }
      if (to - from > 1000) {
        thirdIndex = getThirdIndex(a, from, to);
      } else {
        // 小于1000 直接取中点
        thirdIndex = from + ((to - from) >> 2);
      }
      let tmpArr = _sort(a[from], a[thirdIndex], a[to - 1]);
      a[from] = tmpArr[0];
      a[thirdIndex] = tmpArr[1];
      a[to - 1] = tmpArr[2];
      // 现在正式把 thirdIndex 作为哨兵
      let pivot = a[thirdIndex];
      [a[from], a[thirdIndex]] = [a[thirdIndex], a[from]];
      // 正式进入快排
      let lowEnd = from + 1;
      let highStart = to - 1;
      a[thirdIndex] = a[lowEnd];
      a[lowEnd] = pivot;
      // [lowEnd, i)的元素是和pivot相等的
      // [i, highStart) 的元素是需要处理的
      for (let i = lowEnd + 1; i < highStart; i++) {
        let element = a[i];
        let order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[lowEnd];
          a[lowEnd] = element;
          lowEnd++;
        } else if (order > 0) {
          do {
            highStart--;
            if (highStart === i) break;
            order = comparefn(a[highStart], pivot);
          } while (order > 0);
          // 现在 a[highStart] <= pivot
          // a[i] > pivot
          // 两者交换
          a[i] = a[highStart];
          a[highStart] = element;
          if (order < 0) {
            // a[i] 和 a[lowEnd] 交换
            element = a[i];
            a[i] = a[lowEnd];
            a[lowEnd] = element;
            lowEnd++;
          }
        }
      }
      // 永远切分大区间
      if (lowEnd - from > to - highStart) {
        // 单独处理小区间
        quickSort(a, highStart, to);
        // 继续切分lowEnd ~ from 这个区间
        to = lowEnd;
      } else if (lowEnd - from <= to - highStart) {
        quickSort(a, from, lowEnd);
        from = highStart;
      }
    }
  };
  quickSort(array, 0, length);
};
复制代码;
```

参考链接:

[V8 sort 源码(点开第 997 行)](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fv8%2Fv8%2Fblob%2Fad82a40509c5b5b4680d4299c8f08d6c6d31af3c%2Fsrc%2Fjs%2Farray.js%23997)

[冴羽排序源码专题](https://juejin.cn/post/6844903504654368781)

## 第十八篇: 能不能模拟实现一个 new 的效果？

`new`被调用后做了三件事情:

1. 让实例可以访问到私有属性
2. 让实例可以访问构造函数原型(constructor.prototype)所在原型链上的属性
3. 如果构造函数返回的结果不是引用数据类型

```js
function newOperator(ctor, ...args) {
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    let obj = Object.create(ctor.prototype);
    let res = ctor.apply(obj, args);

    let isObject = typeof res === 'object' && res !== null;
    let isFunction = typoof res === 'function';
    return isObect || isFunction ? res : obj;
};
复制代码
```

## 第十九篇: 能不能模拟实现一个 bind 的效果？

实现 bind 之前，我们首先要知道它做了哪些事情。

1. 对于普通函数，绑定 this 指向
2. 对于构造函数，要保证原函数的原型对象上的属性不能丢失

```js
Function.prototype.bind = function(context, ...args) {
  // 异常处理
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable',
    );
  }
  // 保存this的值，它代表调用 bind 的函数
  var self = this;
  var fNOP = function() {};

  var fbound = function() {
    self.apply(
      this instanceof self ? this : context,
      args.concat(Array.prototype.slice.call(arguments)),
    );
  };

  fNOP.prototype = this.prototype;
  fbound.prototype = new fNOP();

  return fbound;
};
复制代码;
```

也可以这么用 Object.create 来处理原型:

```js
Function.prototype.bind = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new Error(
      'Function.prototype.bind - what is trying to be bound is not callable',
    );
  }

  var self = this;

  var fbound = function() {
    self.apply(
      this instanceof self ? this : context,
      args.concat(Array.prototype.slice.call(arguments)),
    );
  };

  fbound.prototype = Object.create(self.prototype);

  return fbound;
};
复制代码;
```

## 第二十篇: 能不能实现一个 call/apply 函数？

引自`冴羽`大佬的代码，可以说比较完整了。

```js
Function.prototype.call = function(context) {
  let context = context || window;
  let fn = Symbol('fn');
  context.fn = this;

  let args = [];
  for (let i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }

  let result = eval('context.fn(' + args + ')');

  delete context.fn;
  return result;
};
复制代码;
```

不过我认为换成 ES6 的语法会更精炼一些:

```js
Function.prototype.call = function(context, ...args) {
  let context = context || window;
  let fn = Symbol('fn');
  context.fn = this;

  let result = eval('context.fn(...args)');

  delete context.fn;
  return result;
};
复制代码;
```

类似的，有 apply 的对应实现:

```js
Function.prototype.apply = function(context, args) {
  let context = context || window;
  context.fn = this;
  let result = eval('context.fn(...args)');

  delete context.fn;
  return result;
};
复制代码;
```

## 第二十一篇: 谈谈你对 JS 中 this 的理解。

其实 JS 中的 this 是一个非常简单的东西，只需要理解它的执行规则就 OK。

在这里不想像其他博客一样展示太多的代码例子弄得天花乱坠， 反而不易理解。

call/apply/bind 可以显式绑定, 这里就不说了。

主要这些场隐式绑定的场景讨论:

1. 全局上下文
2. 直接调用函数
3. 对象.方法的形式调用
4. DOM 事件绑定(特殊)
5. new 构造函数绑定
6. 箭头函数

### 1. 全局上下文

全局上下文默认 this 指向 window, 严格模式下指向 undefined。

### 2. 直接调用函数

比如:

```js
let obj = {
  a: function() {
    console.log(this);
  },
};
let func = obj.a;
func();
复制代码;
```

这种情况是直接调用。this 相当于全局上下文的情况。

### 3. 对象.方法的形式调用

还是刚刚的例子，我如果这样写:

```js
obj.a();
复制代码;
```

这就是`对象.方法`的情况，this 指向这个对象

### 4. DOM 事件绑定

onclick 和 addEventerListener 中 this 默认指向绑定事件的元素。

IE 比较奇异，使用 attachEvent，里面的 this 默认指向 window。

### 5. new+构造函数

此时构造函数中的 this 指向实例对象。

### 6. 箭头函数？

箭头函数没有 this, 因此也不能绑定。里面的 this 会指向当前最近的非箭头函数的 this，找不到就是 window(严格模式是 undefined)。比如:

```js
let obj = {
  a: function() {
    let do = () => {
      console.log(this);
    }
    do();
  }
}
obj.a(); // 找到最近的非箭头函数a，a现在绑定着obj, 因此箭头函数中的this是obj
复制代码
```

> 优先级: new > call、apply、bind > 对象.方法 > 直接调用。

## 第二十二篇: JS 中浅拷贝的手段有哪些？

### 重要: 什么是拷贝？

首先来直观的感受一下什么是拷贝。

```js
let arr = [1, 2, 3];
let newArr = arr;
newArr[0] = 100;

console.log(arr); //[100, 2, 3]
复制代码;
```

这是直接赋值的情况，不涉及任何拷贝。当改变 newArr 的时候，由于是同一个引用，arr 指向的值也跟着改变。

现在进行浅拷贝:

```js
let arr = [1, 2, 3];
let newArr = arr.slice();
newArr[0] = 100;

console.log(arr); //[1, 2, 3]
复制代码;
```

当修改 newArr 的时候，arr 的值并不改变。什么原因?因为这里 newArr 是 arr 浅拷贝后的结果，newArr 和 arr 现在引用的已经不是同一块空间啦！

这就是浅拷贝！

但是这又会带来一个潜在的问题:

```js
let arr = [1, 2, { val: 4 }];
let newArr = arr.slice();
newArr[2].val = 1000;

console.log(arr); //[ 1, 2, { val: 1000 } ]
复制代码;
```

咦!不是已经不是同一块空间的引用了吗？为什么改变了 newArr 改变了第二个元素的 val 值，arr 也跟着变了。

这就是浅拷贝的限制所在了。它只能拷贝一层对象。如果有对象的嵌套，那么浅拷贝将无能为力。但幸运的是，深拷贝就是为了解决这个问题而生的，它能 解决无限极的对象嵌套问题，实现彻底的拷贝。当然，这是我们下一篇的重点。 现在先让大家有一个基本的概念。

接下来，我们来研究一下 JS 中实现浅拷贝到底有多少种方式？

### 1. 手动实现

```js
const shallowClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop];
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
};
复制代码;
```

### 2. Object.assign

但是需要注意的是，Object.assgin() 拷贝的是对象的属性的引用，而不是对象本身。

```js
let obj = { name: 'sy', age: 18 };
const obj2 = Object.assign({}, obj, { name: 'sss' });
console.log(obj2); //{ name: 'sss', age: 18 }
复制代码;
```

### 3. concat 浅拷贝数组

```js
let arr = [1, 2, 3];
let newArr = arr.concat();
newArr[1] = 100;
console.log(arr); //[ 1, 2, 3 ]
复制代码;
```

### 4. slice 浅拷贝

开头的例子不就说的这个嘛！

### 5. ...展开运算符

```js
let arr = [1, 2, 3];
let newArr = [...arr]; //跟arr.slice()是一样的效果
复制代码;
```

## 第二十三篇: 能不能写一个完整的深拷贝？

上一篇已经解释了什么是深拷贝，现在我们来一起实现一个完整且专业的深拷贝。

### 1. 简易版及问题

```js
JSON.parse(JSON.stringify());
复制代码;
```

估计这个 api 能覆盖大多数的应用场景，没错，谈到深拷贝，我第一个想到的也是它。但是实际上，对于某些严格的场景来说，这个方法是有巨大的坑的。问题如下：

> 1. 无法解决`循环引用`的问题。举个例子：

```js
const a = { val: 2 };
a.target = a;
复制代码;
```

拷贝 a 会出现系统栈溢出，因为出现了`无限递归`的情况。

> 1. 无法拷贝一写`特殊的对象`，诸如 RegExp, Date, Set, Map 等。

> 1. 无法拷贝`函数`(划重点)。

因此这个 api 先 pass 掉，我们重新写一个深拷贝，简易版如下:

```js
const deepClone = (target) => {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop]);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
};
复制代码;
```

现在，我们以刚刚发现的三个问题为导向，一步步来完善、优化我们的深拷贝代码。

### 2. 解决循环引用

现在问题如下:

```js
let obj = { val: 100 };
obj.target = obj;

deepClone(obj); //报错: RangeError: Maximum call stack size exceeded
复制代码;
```

这就是循环引用。我们怎么来解决这个问题呢？

创建一个 Map。记录下已经拷贝过的对象，如果说已经拷贝过，那直接返回它行了。

```js
const isObject = (target) =>
  (typeof target === 'object' ||
    typeof target === 'function') &&
  target !== null;

const deepClone = (target, map = new Map()) => {
  if (map.get(target)) return target;

  if (isObject(target)) {
    map.set(target, true);
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
};
复制代码;
```

现在来试一试：

```js
const a = { val: 2 };
a.target = a;
let newA = deepClone(a);
console.log(newA); //{ val: 2, target: { val: 2, target: [Circular] } }
复制代码;
```

好像是没有问题了, 拷贝也完成了。但还是有一个潜在的坑, 就是 map 上的 key 和 map 构成了`强引用关系`，这是相当危险的。我给你解释一下与之相对的弱引用的概念你就明白了：

> 在计算机程序设计中，弱引用与强引用相对，

是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。 --百度百科

说的有一点绕，我用大白话解释一下，被弱引用的对象可以在`任何时候被回收`，而对于强引用来说，只要这个强引用还在，那么对象`无法被回收`。拿上面的例子说，map 和 a 一直是强引用的关系， 在程序结束之前，a 所占的内存空间一直`不会被释放`。

怎么解决这个问题？

很简单，让 map 的 key 和 map 构成`弱引用`即可。ES6 给我们提供了这样的数据结构，它的名字叫`WeakMap`，它是一种特殊的 Map, 其中的键是`弱引用`的。其键必须是对象，而值可以是任意的。

稍微改造一下即可:

```js
const deepClone = (target, map = new WeakMap()) => {
  //...
};
复制代码;
```

### 3. 拷贝特殊对象

#### 可继续遍历

对于特殊的对象，我们使用以下方式来鉴别:

```js
Object.prototype.toString.call(obj);
复制代码;
```

梳理一下对于可遍历对象会有什么结果：

```js
['object Map']['object Set']['object Array'][
  'object Object'
]['object Arguments'];
复制代码;
```

好，以这些不同的字符串为依据，我们就可以成功地鉴别这些对象。

```js
const getType = Object.prototype.toString.call(obj);

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};

const deepClone = (target, map = new Map()) => {
  if (!isObject(target)) return target;
  let type = getType(target);
  let cloneTarget;
  if (!canTraverse[type]) {
    // 处理不能遍历的对象
    return;
  } else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.prototype;
    cloneTarget = new ctor();
  }

  if (map.get(target)) return target;
  map.put(target, true);

  if (type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key), deepClone(item));
    });
  }

  if (type === setTag) {
    //处理Set
    target.forEach((item) => {
      target.add(deepClone(item));
    });
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = deepClone(target[prop]);
    }
  }
  return cloneTarget;
};
复制代码;
```

#### 不可遍历的对象

```js
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';
复制代码;
```

对于不可遍历的对象，不同的对象有不同的处理。

```js
const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
};

const handleFunc = (target) => {
  // 待会的重点部分
};

const handleNotTraverse = (target, tag) => {
  const Ctor = targe.constructor;
  switch (tag) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
};
复制代码;
```

### 4. 拷贝函数

虽然函数也是对象，但是它过于特殊，我们单独把它拿出来拆解。

提到函数，在 JS 种有两种函数，一种是普通函数，另一种是箭头函数。每个普通函数都是 Function 的实例，而箭头函数不是任何类的实例，每次调用都是不一样的引用。那我们只需要 处理普通函数的情况，箭头函数直接返回它本身就好了。

那么如何来区分两者呢？

答案是: 利用原型。箭头函数是不存在原型的。

代码如下:

```js
const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if (!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if (!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
};
复制代码;
```

到现在，我们的深拷贝就实现地比较完善了。不过在测试的过程中，我也发现了一个小小的 bug。

### 5. 小小的 bug

如下所示:

```js
const target = new Boolean(false);
const Ctor = target.constructor;
new Ctor(target); // 结果为 Boolean {true} 而不是 false。
复制代码;
```

对于这样一个 bug，我们可以对 Boolean 拷贝做最简单的修改， 调用 valueOf: new target.constructor(target.valueOf())。

但实际上，这种写法是不推荐的。因为在 ES6 后不推荐使用【new 基本类型()】这 样的语法，所以 es6 中的新类型 Symbol 是不能直接 new 的，只能通过 new Object(SymbelType)。

因此我们接下来统一一下:

```js
const handleNotTraverse = (target, tag) => {
  const Ctor = targe.constructor;
  switch (tag) {
    case boolTag:
      return new Object(
        Boolean.prototype.valueOf.call(target),
      );
    case numberTag:
      return new Object(
        Number.prototype.valueOf.call(target),
      );
    case stringTag:
      return new Object(
        String.prototype.valueOf.call(target),
      );
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
};
复制代码;
```

### 6. 完整代码展示

OK!是时候给大家放出完整版的深拷贝啦:

```js
const getType = (obj) =>
  Object.prototype.toString.call(obj);

const isObject = (target) =>
  (typeof target === 'object' ||
    typeof target === 'function') &&
  target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};
const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
};

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if (!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if (!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
};

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch (tag) {
    case boolTag:
      return new Object(
        Boolean.prototype.valueOf.call(target),
      );
    case numberTag:
      return new Object(
        Number.prototype.valueOf.call(target),
      );
    case stringTag:
      return new Object(
        String.prototype.valueOf.call(target),
      );
    case symbolTag:
      return new Object(
        Symbol.prototype.valueOf.call(target),
      );
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
};

const deepClone = (target, map = new WeakMap()) => {
  if (!isObject(target)) return target;
  let type = getType(target);
  let cloneTarget;
  if (!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  } else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if (map.get(target)) return target;
  map.set(target, true);

  if (type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(
        deepClone(key, map),
        deepClone(item, map),
      );
    });
  }

  if (type === setTag) {
    //处理Set
    target.forEach((item) => {
      cloneTarget.add(deepClone(item, map));
    });
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
};
```

## 第 24 篇: JavaScript 内存机制之问——数据是如何存储的？

网上的资料基本是这样说的: 基本数据类型用`栈`存储，引用数据类型用`堆`存储。

看起来没有错误，但实际上是有问题的。可以考虑一下闭包的情况，如果变量存在栈中，那函数调用完`栈顶空间销毁`，闭包变量不就没了吗？

其实还是需要补充一句:

> 闭包变量是存在堆内存中的。

具体而言，以下数据类型存储在栈中:

- boolean
- null
- undefined
- number
- string
- symbol
- bigint

而所有的对象数据类型存放在堆中。

值得注意的是，对于`赋值`操作，原始类型的数据直接完整地复制变量值，对象数据类型的数据则是复制引用地址。

因此会有下面的情况:

```js
let obj = { a: 1 };
let newObj = obj;
newObj.a = 2;
console.log(obj.a); //变成了2
复制代码;
```

之所以会这样，是因为 obj 和 newObj 是同一份堆空间的地址，改变 newObj，等于改变了共同的堆内存，这时候通过 obj 来获取这块内存的值当然会改变。

当然，你可能会问: 为什么不全部用栈来保存呢？

首先，对于系统栈来说，它的功能除了保存变量之外，还有创建并切换函数执行上下文的功能。举个例子:

```js
function f(a) {
  console.log(a);
}

function func(a) {
  f(a);
}

func(1);
复制代码;
```

假设用 ESP 指针来保存当前的执行状态，在系统栈中会产生如下的过程：

1. 调用 func, 将 func 函数的上下文压栈，ESP 指向栈顶。
2. 执行 func，又调用 f 函数，将 f 函数的上下文压栈，ESP 指针上移。
3. 执行完 f 函数，将 ESP 下移，f 函数对应的栈顶空间被回收。
4. 执行完 func，ESP 下移，func 对应的空间被回收。

图示如下:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b6b57b734c1~tplv-t2oaga2asx-watermark.awebp)

因此你也看到了，如果采用栈来存储相对基本类型更加复杂的对象数据，那么切换上下文的开销将变得巨大！

不过堆内存虽然空间大，能存放大量的数据，但与此同时垃圾内存的回收会带来更大的开销，下一篇就来分析一下堆内存到底是如何进行垃圾回收并进行优化的。

## 第 25 篇：V8 引擎如何进行垃圾内存的回收？

JS 语言不像 C/C++, 让程序员自己去开辟或者释放内存，而是类似 Java，采用自己的一套垃圾回收算法进行自动的内存管理。作为一名资深的前端工程师，对于 JS 内存回收的机制是需要非常清楚, 以便于在极端的环境下能够分析出系统性能的瓶颈，另一方面，学习这其中的机制，也对我们深入理解 JS 的闭包特性、以及对内存的高效使用，都有很大的帮助。

### V8 内存限制

在其他的后端语言中，如 Java/Go, 对于内存的使用没有什么限制，但是 JS 不一样，V8 只能使用系统的一部分内存，具体来说，在`64`位系统下，V8 最多只能分配`1.4G`, 在 32 位系统中，最多只能分配`0.7G`。你想想在前端这样的大内存需求其实并不大，但对于后端而言，nodejs 如果遇到一个 2G 多的文件，那么将无法全部将其读入内存进行各种操作了。

我们知道对于栈内存而言，当 ESP 指针下移，也就是上下文切换之后，栈顶的空间会自动被回收。但对于堆内存而言就比较复杂了，我们下面着重分析堆内存的垃圾回收。

上一篇我们提到过了，所有的对象类型的数据在 JS 中都是通过堆进行空间分配的。当我们构造一个对象进行赋值操作的时候，其实相应的内存已经分配到了堆上。你可以不断的这样创建对象，让 V8 为它分配空间，直到堆的大小达到上限。

那么问题来了，V8 为什么要给它设置内存上限？明明我的机器大几十 G 的内存，只能让我用这么一点？

究其根本，是由两个因素所共同决定的，一个是 JS 单线程的执行机制，另一个是 JS 垃圾回收机制的限制。

首先 JS 是单线程运行的，这意味着一旦进入到垃圾回收，那么其它的各种运行逻辑都要暂停; 另一方面垃圾回收其实是非常耗时间的操作，V8 官方是这样形容的:

> 以 1.5GB 的垃圾回收堆内存为例，V8 做一次小的垃圾回收需要 50ms 以上，做一次非增量式(ps:后面会解释)的垃圾回收甚至要 1s 以上。

可见其耗时之久，而且在这么长的时间内，我们的 JS 代码执行会一直没有响应，造成应用卡顿，导致应用性能和响应能力直线下降。因此，V8 做了一个简单粗暴的选择，那就是限制堆内存，也算是一种权衡的手段，因为大部分情况是不会遇到操作几个 G 内存这样的场景的。

不过，如果你想调整这个内存的限制也不是不行。配置命令如下:

```js
// 这是调整老生代这部分的内存，单位是MB。后面会详细介绍新生代和老生代内存
node --max-old-space-size=2048 xxx.js
复制代码
```

或者

```js
// 这是调整新生代这部分的内存，单位是 KB。
node --max-new-space-size=2048 xxx.js
复制代码
```

### 新生代内存的回收

V8 把堆内存分成了两部分进行处理——新生代内存和老生代内存。顾名思义，新生代就是临时分配的内存，存活时间短， 老生代是常驻内存，存活的时间长。V8 的堆内存，也就是两个内存之和。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b6ec3859a65~tplv-t2oaga2asx-watermark.awebp)

根据这两种不同种类的堆内存，V8 采用了不同的回收策略，来根据不同的场景做针对性的优化。

首先是新生代的内存，刚刚已经介绍了调整新生代内存的方法，那它的内存默认限制是多少？在 64 位和 32 位系统下分别为 32MB 和 16MB。够小吧，不过也很好理解，新生代中的变量存活时间短，来了马上就走，不容易产生太大的内存负担，因此可以将它设的足够小。

那好了，新生代的垃圾回收是怎么做的呢？

首先将新生代内存空间一分为二:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b71923adacb~tplv-t2oaga2asx-watermark.awebp)

其中 From 部分表示正在使用的内存，To 是目前闲置的内存。

当进行垃圾回收时，V8 将 From 部分的对象检查一遍，如果是存活对象那么复制到 To 内存中(在 To 内存中按照顺序从头放置的)，如果是非存活对象直接回收即可。

当所有的 From 中的存活对象按照顺序进入到 To 内存之后，From 和 To 两者的角色`对调`，From 现在被闲置，To 为正在使用，如此循环。

那你很可能会问了，直接将非存活对象回收了不就万事大吉了嘛，为什么还要后面的一系列操作？

注意，我刚刚特别说明了，在 To 内存中按照顺序从头放置的，这是为了应对这样的场景:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b73ac9e01cc~tplv-t2oaga2asx-watermark.awebp)

深色的小方块代表存活对象，白色部分表示待分配的内存，由于堆内存是连续分配的，这样零零散散的空间可能会导致稍微大一点的对象没有办法进行空间分配，这种零散的空间也叫做**内存碎片**。刚刚介绍的新生代垃圾回收算法也叫**Scavenge 算法**。

Scavenge 算法主要就是解决内存碎片的问题，在进行一顿复制之后，To 空间变成了这个样子:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b7741afdb10~tplv-t2oaga2asx-watermark.awebp)

是不是整齐了许多？这样就大大方便了后续连续空间的分配。

不过 Scavenge 算法的劣势也非常明显，就是内存只能使用新生代内存的一半，但是它只存放生命周期短的对象，这种对象`一般很少`，因此`时间`性能非常优秀。

### 老生代内存的回收

刚刚介绍了新生代的回收方式，那么新生代中的变量如果经过多次回收后依然存在，那么就会被放入到`老生代内存`中，这种现象就叫`晋升`。

发生晋升其实不只是这一种原因，我们来梳理一下会有那些情况触发晋升:

- 已经经历过一次 Scavenge 回收。
- To（闲置）空间的内存占用超过 25%。

现在进入到老生代的垃圾回收机制当中，老生代中累积的变量空间一般都是很大的，当然不能用`Scavenge`算法啦，浪费一半空间不说，对庞大的内存空间进行复制岂不是劳民伤财？

那么对于老生代而言，究竟是采取怎样的策略进行垃圾回收的呢？

第一步，进行标记-清除。这个过程在《JavaScript 高级程序设计(第三版)》中有过详细的介绍，主要分成两个阶段，即标记阶段和清除阶段。首先会遍历堆中的所有对象，对它们做上标记，然后对于代码环境中`使用的变量`以及被`强引用`的变量取消标记，剩下的就是要删除的变量了，在随后的`清除阶段`对其进行空间的回收。

当然这又会引发内存碎片的问题，存活对象的空间不连续对后续的空间分配造成障碍。老生代又是如何处理这个问题的呢？

第二步，整理内存碎片。V8 的解决方式非常简单粗暴，在清除阶段结束后，把存活的对象全部往一端靠拢。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b7a41c8c826~tplv-t2oaga2asx-watermark.awebp)

由于是移动对象，它的执行速度不可能很快，事实上也是整个过程中最耗时间的部分。

### 增量标记

由于 JS 的单线程机制，V8 在进行垃圾回收的时候，不可避免地会阻塞业务逻辑的执行，倘若老生代的垃圾回收任务很重，那么耗时会非常可怕，严重影响应用的性能。那这个时候为了避免这样问题，V8 采取了增量标记的方案，即将一口气完成的标记任务分为很多小的部分完成，每做完一个小的部分就"歇"一下，就 js 应用逻辑执行一会儿，然后再执行下面的部分，如果循环，直到标记阶段完成才进入内存碎片的整理上面来。其实这个过程跟 React Fiber 的思路有点像，这里就不展开了。

经过增量标记之后，垃圾回收过程对 JS 应用的阻塞时间减少到原来了 1 / 6, 可以看到，这是一个非常成功的改进。

JS 垃圾回收的原理就介绍到这里了，其实理解起来是非常简单的，重要的是理解它`为什么要这么做`，而不仅仅是`如何做的`，希望这篇总结能够对你有所启发。

## 第 26 篇: 描述一下 V8 执行一段 JS 代码的过程？

前端相对来说是一个比较新兴的领域，因此各种前端框架和工具层出不穷，让人眼花缭乱，尤其是各大厂商推出`小程序`之后`各自制定标准`，让前端开发的工作更加繁琐，在此背景下为了抹平平台之间的差异，诞生的各种`编译工具/框架`也数不胜数。但无论如何，想要赶上这些框架和工具的更新速度是非常难的，即使赶上了也很难产生自己的`技术积淀`，一个更好的方式便是学习那些`本质的知识`，抓住上层应用中不变的`底层机制`，这样我们便能轻松理解上层的框架而不仅仅是被动地使用，甚至能够在适当的场景下自己造出轮子，以满足开发效率的需求。

站在 V8 的角度，理解其中的执行机制，也能够帮助我们理解很多的上层应用，包括 Babel、Eslint、前端框架的底层机制。那么，一段 JavaScript 代码放在 V8 当中究竟是如何执行的呢？

首先需要明白的是，机器是读不懂 JS 代码，机器只能理解特定的机器码，那如果要让 JS 的逻辑在机器上运行起来，就必须将 JS 的代码翻译成机器码，然后让机器识别。JS 属于解释型语言，对于解释型的语言说，解释器会对源代码做如下分析:

- 通过词法分析和语法分析生成 AST(抽象语法树)
- 生成字节码

然后解释器根据字节码来执行程序。但 JS 整个执行的过程其实会比这个更加复杂，接下来就来一一地拆解。

### 1.生成 AST

生成 AST 分为两步——词法分析和语法分析。

词法分析即分词，它的工作就是将一行行的代码分解成一个个 token。 比如下面一行代码:

```js
let name = 'sanyuan';
复制代码;
```

其中会把句子分解成四个部分:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b7d3513ebf5~tplv-t2oaga2asx-watermark.awebp)

即解析成了四个 token，这就是词法分析的作用。

接下来语法分析阶段，将生成的这些 token 数据，根据一定的语法规则转化为 AST。举个例子:

```js
let name = 'sanyuan';
console.log(name);
复制代码;
```

最后生成的 AST 是这样的:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b7ff6b0f513~tplv-t2oaga2asx-watermark.awebp)

当生成了 AST 之后，编译器/解释器后续的工作都要依靠 AST 而不是源代码。顺便补充一句，babel 的工作原理就是将 ES6 的代码解析生成`ES6的AST`，然后将 ES6 的 AST 转换为 `ES5 的AST`,最后才将 ES5 的 AST 转化为具体的 ES5 代码。由于本文着重阐述原理，关于 babel 编译的细节就不展开了，推荐大家去读一读荒山的[babel 文章](https://juejin.cn/post/6844903956905197576), 帮你打开新世界的大门: )

回到 V8 本身，生成 AST 后，接下来会生成执行上下文，关于执行上下文，可以参考上上篇《JavaScript 内存机制之问——数据是如何存储的？》中对于上下文压栈出栈过程的讲解。

### 2. 生成字节码

开头就已经提到过了，生成 AST 之后，直接通过 V8 的解释器(也叫 Ignition)来生成字节码。但是`字节码`并不能让机器直接运行，那你可能就会说了，不能执行还转成字节码干嘛，直接把 AST 转换成机器码不就得了，让机器直接执行。确实，在 V8 的早期是这么做的，但后来因为机器码的体积太大，引发了严重的内存占用问题。

给一张对比图让大家直观地感受以下三者代码量的差异:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b822da9857c~tplv-t2oaga2asx-watermark.awebp)

很容易得出，字节码是比机器码轻量得多的代码。那 V8 为什么要使用字节码，字节码到底是个什么东西？

> 字节码是介于 AST 和 机器码之间的一种代码，但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码然后执行。

字节码仍然需要转换为机器码，但和原来不同的是，现在不用一次性将全部的字节码都转换成机器码，而是通过解释器来逐行执行字节码，省去了生成二进制文件的操作，这样就大大降低了内存的压力。

### 3. 执行代码

接下来，就进入到字节码解释执行的阶段啦！

在执行字节码的过程中，如果发现某一部分代码重复出现，那么 V8 将它记做`热点代码`(HotSpot)，然后将这么代码编译成`机器码`保存起来，这个用来编译的工具就是 V8 的`编译器`(也叫做`TurboFan`) , 因此在这样的机制下，代码执行的时间越久，那么执行效率会越来越高，因为有越来越多的字节码被标记为`热点代码`，遇到它们时直接执行相应的机器码，不用再次将转换为机器码。

其实当你听到有人说 JS 就是一门解释器语言的时候，其实这个说法是有问题的。因为字节码不仅配合了解释器，而且还和编译器打交道，所以 JS 并不是完全的解释型语言。而编译器和解释器的 根本区别在于前者会编译生成二进制文件但后者不会。

并且，这种字节码跟编译器和解释器结合的技术，我们称之为`即时编译`, 也就是我们经常听到的`JIT`。

这就是 V8 中执行一段 JS 代码的整个过程，梳理一下:

1. 首先通过词法分析和语法分析生成 `AST`
2. 将 AST 转换为字节码
3. 由解释器逐行执行字节码，遇到热点代码启动编译器进行编译，生成对应的机器码, 以优化执行效率

关于这个问题的拆解就到这里，希望对你有所启发。

## 第 28 篇：如何理解 EventLoop——宏任务和微任务篇

### 宏任务(MacroTask)引入

在 JS 中，大部分的任务都是在主线程上执行，常见的任务有:

1. 渲染事件
2. 用户交互事件
3. js 脚本执行
4. 网络请求、文件读写完成事件等等。

为了让这些事件有条不紊地进行，JS 引擎需要对之执行的顺序做一定的安排，V8 其实采用的是一种`队列`的方式来存储这些任务， 即先进来的先执行。模拟如下:

```js
bool keep_running = true;
void MainTherad(){
  for(;;){
    //执行队列中的任务
    Task task = task_queue.takeTask();
    ProcessTask(task);

    //执行延迟队列中的任务
    ProcessDelayTask()

    if(!keep_running) //如果设置了退出标志，那么直接退出线程循环
        break;
  }
}
复制代码
```

这里用到了一个 for 循环，将队列中的任务一一取出，然后执行，这个很好理解。但是其中包含了两种任务队列，除了上述提到的任务队列， 还有一个延迟队列，它专门处理诸如 setTimeout/setInterval 这样的定时器回调任务。

上述提到的，普通任务队列和延迟队列中的任务，都属于**宏任务**。

### 微任务(MicroTask)引入

对于每个宏任务而言，其内部都有一个微任务队列。那为什么要引入微任务？微任务在什么时候执行呢？

其实引入微任务的初衷是为了解决异步回调的问题。想一想，对于异步回调的处理，有多少种方式？总结起来有两点:

1. 将异步回调进行宏任务队列的入队操作。
2. 将异步回调放到当前宏任务的末尾。

如果采用第一种方式，那么执行回调的时机应该是在前面`所有的宏任务`完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成`应用卡顿`。

为了规避这样的问题，V8 引入了第二种方式，这就是`微任务`的解决方式。在每一个宏任务中定义一个**微任务队列**，当该宏任务执行完成，会检查其中的微任务队列，如果为空则直接执行下一个宏任务，如果不为空，则`依次执行微任务`，执行完成才去执行下一个宏任务。

常见的微任务有 MutationObserver、Promise.then(或.reject) 以及以 Promise 为基础开发的其他技术(比如 fetch API), 还包括 V8 的垃圾回收过程。

Ok, 这便是`宏任务`和`微任务`的概念，接下来正式介绍 JS 非常重要的运行机制——EventLoop。

## 第 29 篇: 如何理解 EventLoop——浏览器篇

干讲理论不容易理解，让我们直接以一个例子开始吧:

```js
console.log('start');
setTimeout(() => {
  console.log('timeout');
});
Promise.resolve().then(() => {
  console.log('resolve');
});
console.log('end');
复制代码;
```

我们来分析一下:

1. 刚开始整个脚本作为一个宏任务来执行，对于同步代码直接压入执行栈(关于执行栈，若不了解请移步之前的文章《JavaScript 内存机制之问——数据是如何存储的？》)进行执行，因此**先打印 start 和 end**
2. setTimeout 作为一个宏任务放入宏任务队列
3. Promise.then 作为一个为微任务放入到微任务队列
4. 当本次宏任务执行完，检查微任务队列，发现一个 Promise.then, **执行**
5. 接下来进入到下一个宏任务——setTimeout, **执行**

因此最后的顺序是:

```
start
end
resolve
timeout
复制代码
```

这样就带大家直观地感受到了浏览器环境下 EventLoop 的执行流程。不过，这只是其中的一部分情况，接下来我们来做一个更完整的总结。

1. 一开始整段脚本作为第一个**宏任务**执行
2. 执行过程中同步代码直接执行，**宏任务**进入宏任务队列，**微任务**进入微任务队列
3. 当前宏任务执行完出队，检查微任务队列，如果有则依次执行，直到微任务队列为空
4. 执行浏览器 UI 线程的渲染工作
5. 检查是否有 Web worker 任务，有则执行
6. 执行队首新的宏任务，回到 2，依此循环，直到宏任务和微任务队列都为空

最后给大家留一道题目练习:

```js
Promise.resolve().then(() => {
  console.log('Promise1');
  setTimeout(() => {
    console.log('setTimeout2');
  }, 0);
});
setTimeout(() => {
  console.log('setTimeout1');
  Promise.resolve().then(() => {
    console.log('Promise2');
  });
}, 0);
console.log('start');

// start
// Promise1
// setTimeout1
// Promise2
// setTimeout2
复制代码;
```

## 第 30 篇: 如何理解 EventLoop——nodejs 篇

nodejs 和 浏览器的 eventLoop 还是有很大差别的，值得单独拿出来说一说。

不知你是否看过关于 nodejs 中 eventLoop 的一些文章, 是否被这些流程图搞得眼花缭乱、一头雾水:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b8587ad911d~tplv-t2oaga2asx-watermark.awebp)

看到这你不用紧张，这里会抛开这些晦涩的流程图，以最清晰浅显的方式来一步步拆解 nodejs 的事件循环机制。

### 1. 三大关键阶段

首先，梳理一下 nodejs 三个非常重要的执行阶段:

1. 执行 `定时器回调` 的阶段。检查定时器，如果到了时间，就执行回调。这些定时器就是 setTimeout、setInterval。这个阶段暂且叫它`timer`。
2. 轮询(英文叫`poll`)阶段。因为在 node 代码中难免会有异步操作，比如文件 I/O，网络 I/O 等等，那么当这些异步操作做完了，就会来通知 JS 主线程，怎么通知呢？就是通过'data'、

'connect'等事件使得事件循环到达 `poll` 阶段。到达了这个阶段后:

如果当前已经存在定时器，而且有定时器到时间了，拿出来执行，eventLoop 将回到 timer 阶段。

如果没有定时器, 会去看回调函数队列。

- 如果队列`不为空`，拿出队列中的方法依次执行

- 如果队列

  ```
  为空
  ```

  ，检查是否有

  ```
  setImmdiate
  ```

  的回调

  - 有则前往`check阶段`(下面会说)
  - `没有则继续等待`，相当于阻塞了一段时间(阻塞时间是有上限的), 等待 callback 函数加入队列，加入后会立刻执行。一段时间后`自动进入 check 阶段`。

1. check 阶段。这是一个比较简单的阶段，直接`执行 setImmdiate` 的回调。

这三个阶段为一个循环过程。不过现在的 eventLoop 并不完整，我们现在就来一一地完善。

### 2. 完善

首先，当第 1 阶段结束后，可能并不会立即等待到异步事件的响应，这时候 nodejs 会进入到 `I/O异常的回调阶段`。比如说 TCP 连接遇到 ECONNREFUSED，就会在这个时候执行回调。

并且在 check 阶段结束后还会进入到 `关闭事件的回调阶段`。如果一个 socket 或句柄（handle）被突然关闭，例如 socket.destroy()， 'close' 事件的回调就会在这个阶段执行。

梳理一下，nodejs 的 eventLoop 分为下面的几个阶段:

1. timer 阶段
2. I/O 异常回调阶段
3. 空闲、预备状态(第 2 阶段结束，poll 未触发之前)
4. poll 阶段
5. check 阶段
6. 关闭事件的回调阶段

是不是清晰了许多？

### 3. 实例演示

好，我们以上次的练习题来实践一把:

```js
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(function() {
    console.log('promise1');
  });
}, 0);
setTimeout(() => {
  console.log('timer2');
  Promise.resolve().then(function() {
    console.log('promise2');
  });
}, 0);
复制代码;
```

这里我要说，node 版本 >= 11 和在 11 以下的会有不同的表现。

首先说 node 版本 >= 11 的，它会和浏览器表现一致，一个定时器运行完立即运行相应的微任务。

```
timer1
promise1
time2
promise2
复制代码
```

而 node 版本小于 11 的情况下，对于定时器的处理是:

> 若第一个定时器任务出队并执行完，发现队首的任务仍然是一个定时器，那么就将微任务暂时保存，`直接去执行`新的定时器任务，当新的定时器任务执行完后，`再一一执行`中途产生的微任务。

因此会打印出这样的结果:

```
timer1
timer2
promise1
promise2
复制代码
```

### 4.nodejs 和 浏览器关于 eventLoop 的主要区别

两者最主要的区别在于浏览器中的微任务是在`每个相应的宏任务`中执行的，而 nodejs 中的微任务是在`不同阶段之间`执行的。

### 5.关于 process.nextTick 的一点说明

process.nextTick 是一个独立于 eventLoop 的任务队列。

在每一个 eventLoop 阶段完成后会去检查这个队列，如果里面有任务，会让这部分任务`优先于微任务`执行。

## 第 31 篇: nodejs 中的异步、非阻塞 I/O 是如何实现的？

在听到 nodejs 相关的特性时，经常会对 `异步I/O`、`非阻塞I/O`有所耳闻，听起来好像是差不多的意思，但其实是两码事，下面我们就以原理的角度来剖析一下对 nodejs 来说，这两种技术底层是如何实现的？

### 什么是 I/O？

首先，我想有必要把 I/O 的概念解释一下。I/O 即 Input/Output, 输入和输出的意思。在浏览器端，只有一种 I/O，那就是利用 Ajax 发送网络请求，然后读取返回的内容，这属于`网络I/O`。回到 nodejs 中，其实这种的 I/O 的场景就更加广泛了，主要分为两种:

- 文件 I/O。比如用 fs 模块对文件进行读写操作。
- 网络 I/O。比如 http 模块发起网络请求。

### 阻塞和非阻塞 I/O

`阻塞`和`非阻塞` I/O 其实是针对操作系统内核而言的，而不是 nodejs 本身。阻塞 I/O 的特点就是一定要**等到操作系统完成所有操作后才表示调用结束**，而非阻塞 I/O 是调用后立马返回，不用等操作系统内核完成操作。

对前者而言，在操作系统进行 I/O 的操作的过程中，我们的应用程序其实是一直处于等待状态的，什么都做不了。那如果换成`非阻塞I/O`，调用返回后我们的 nodejs 应用程序可以完成其他的事情，而操作系统同时也在进行 I/O。这样就把等待的时间充分利用了起来，提高了执行效率，但是同时又会产生一个问题，nodejs 应用程序怎么知道操作系统已经完成了 I/O 操作呢？

为了让 nodejs 知道操作系统已经做完 I/O 操作，需要重复地去操作系统那里判断一下是否完成，这种重复判断的方式就是`轮询`。对于轮询而言，有以下这么几种方案:

1. 一直轮询检查 I/O 状态，直到 I/O 完成。这是最原始的方式，也是性能最低的，会让 CPU 一直耗用在等待上面。其实跟阻塞 I/O 的效果是一样的。
2. 遍历文件描述符(即 文件 I/O 时操作系统和 nodejs 之间的文件凭证)的方式来确定 I/O 是否完成，I/O 完成则文件描述符的状态改变。但 CPU 轮询消耗还是很大。
3. epoll 模式。即在进入轮询的时候如果 I/O 未完成 CPU 就休眠，完成之后唤醒 CPU。

总之，CPU 要么重复检查 I/O，要么重复检查文件描述符，要么休眠，都得不到很好的利用，我们希望的是:

> nodejs 应用程序发起 I/O 调用后可以直接去执行别的逻辑，操作系统默默地做完 I/O 之后给 nodejs 发一个完成信号，nodejs 执行回调操作。

这是理想的情况，也是异步 I/O 的效果，那如何实现这样的效果呢？

### 异步 I/O 的本质

Linux 原生存在这样的一种方式，即(AIO), 但两个致命的缺陷:

1. 只有 Linux 下存在，在其他系统中没有异步 I/O 支持。
2. 无法利用系统缓存。

#### nodejs 中的异步 I/O 方案

是不是没有办法了呢？在单线程的情况下确实是这样，但是如果把思路放开一点，利用多线程来考虑这个问题，就变得轻松多了。我们可以让一个进程进行计算操作，另外一些进行 I/O 调用，I/O 完成后把信号传给计算的线程，进而执行回调，这不就好了吗？没错，**异步 I/O 就是使用这样的线程池来实现的**。

只不过在不同的系统下面表现会有所差异，在 Linux 下可以直接使用线程池来完成，在 Window 系统下则采用 IOCP 这个系统 API(其内部还是用线程池完成的)。

有了操作系统的支持，那 nodejs 如何来对接这些操作系统从而实现异步 I/O 呢？

以文件为 I/O 我们以一段代码为例:

```js
let fs = require('fs');

fs.readFile('/test.txt', function(err, data) {
  console.log(data);
});
复制代码;
```

#### 执行流程

执行代码的过程中大概发生了这些事情:

1. 首先，fs.readFile 调用 Node 的核心模块 fs.js ；
2. 接下来，Node 的核心模块调用内建模块 node_file.cc，创建对应的文件 I/O 观察者对象(这个对象后面有大用！) ；
3. 最后，根据不同平台（Linux 或者 window），内建模块通过 libuv 中间层进行系统调用

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b899411b5a6~tplv-t2oaga2asx-watermark.awebp)

#### libuv 调用过程拆解

重点来了！libuv 中是如何来进行进行系统调用的呢？也就是 uv_fs_open() 中做了些什么？

##### 1. 创建请求对象

以 Windows 系统为例来说，在这个函数的调用过程中，我们创建了一个文件 I/O 的**请求对象**，并往里面注入了回调函数。

```cpp
req_wrap->object_->Set(oncomplete_sym, callback);
复制代码
```

req*wrap 便是这个请求对象，req_wrap 中 object* 的 oncomplete_sym 属性对应的值便是我们 nodejs 应用程序代码中传入的回调函数。

##### 2. 推入线程池，调用返回

在这个对象包装完成后，QueueUserWorkItem() 方法将这个对象推进线程池中等待执行。

好，至此现在 js 的调用就直接返回了，我们的 js 应用程序代码可以`继续往下执行`，当然，当前的 `I/O` 操作同时也在线程池中将被执行，这不就完成了异步么：）

等等，别高兴太早，回调都还没执行呢！接下来便是执行回调通知的环节。

##### 3. 回调通知

事实上现在线程池中的 I/O 无论是阻塞还是非阻塞都已经无所谓了，因为异步的目的已经达成。重要的是 I/O 完成后会发生什么。

在介绍后续的故事之前，给大家介绍两个重要的方法: `GetQueuedCompletionStatus` 和 `PostQueuedCompletionStatus`。

1. 还记得之前讲过的 eventLoop 吗？在每一个 Tick 当中会调用`GetQueuedCompletionStatus`检查线程池中是否有执行完的请求，如果有则表示时机已经成熟，可以执行回调了。
2. `PostQueuedCompletionStatus`方法则是向 IOCP 提交状态，告诉它当前 I/O 完成了。

名字比较长，先介绍是为了让大家混个脸熟，至少后面出来不会感到太突兀：）

我们言归正传，把后面的过程串联起来。

当对应线程中的 I/O 完成后，会将获得的结果`存储`起来，保存到`相应的请求对象`中，然后调用`PostQueuedCompletionStatus()`向 IOCP 提交执行完成的状态，并且将线程还给操作系统。一旦 EventLoop 的轮询操作中，调用`GetQueuedCompletionStatus`检测到了完成的状态，就会把`请求对象`塞给 I/O 观察者(之前埋下伏笔，如今终于闪亮登场)。

I/O 观察者现在的行为就是取出`请求对象`的`存储结果`，同时也取出它的`oncomplete_sym`属性，即回调函数(不懂这个属性的回看第 1 步的操作)。将前者作为函数参数传入后者，并执行后者。 这里，回调函数就成功执行啦！

总结 :

1. `阻塞`和`非阻塞` I/O 其实是针对操作系统内核而言的。阻塞 I/O 的特点就是一定要**等到操作系统完成所有操作后才表示调用结束**，而非阻塞 I/O 是调用后立马返回，不用等操作系统内核完成操作。
2. nodejs 中的异步 I/O 采用多线程的方式，由 `EventLoop`、`I/O 观察者`，`请求对象`、`线程池`四大要素相互配合，共同实现。

## 第 32 篇：JS 异步编程有哪些方案？为什么会出现这些方案？

关于 JS `单线程`、`EventLoop` 以及`异步 I/O` 这些底层的特性，我们之前做过了详细的拆解，不在赘述。在探究了底层机制之后，我们还需要对代码的组织方式有所理解，这是离我们最日常开发最接近的部分，异步代码的组织方式直接决定了`开发`和`维护`的`效率`，其重要性也不可小觑。尽管**底层机制**没变，但异步代码的组织方式却随着 ES 标准的发展，一步步发生了巨大的`变革`。接着让我们来一探究竟吧！

### 回调函数时代

相信很多 nodejs 的初学者都或多或少踩过这样的坑，node 中很多原生的 api 就是诸如这样的:

```js
fs.readFile('xxx', (err, data) => {});
复制代码;
```

典型的高阶函数，将回调函数作为函数参数传给了 readFile。但久而久之，就会发现，这种传入回调的方式也存在大坑, 比如下面这样:

```js
fs.readFile('1.json', (err, data) => {
  fs.readFile('2.json', (err, data) => {
    fs.readFile('3.json', (err, data) => {
      fs.readFile('4.json', (err, data) => {});
    });
  });
});
复制代码;
```

回调当中嵌套回调，也称`回调地狱`。这种代码的可读性和可维护性都是非常差的，因为嵌套的层级太多。而且还有一个严重的问题，就是每次任务可能会失败，需要在回调里面对每个任务的失败情况进行处理，增加了代码的混乱程度。

### Promise 时代

ES6 中新增的 Promise 就很好了解决了`回调地狱`的问题，同时了合并了错误处理。写出来的代码类似于下面这样:

```js
readFilePromise('1.json')
  .then((data) => {
    return readFilePromise('2.json');
  })
  .then((data) => {
    return readFilePromise('3.json');
  })
  .then((data) => {
    return readFilePromise('4.json');
  });
复制代码;
```

以链式调用的方式避免了大量的嵌套，也符合人的线性思维方式，大大方便了异步编程。

### co + Generator 方式

利用协程完成 Generator 函数，用 co 库让代码依次执行完，同时以同步的方式书写，也让异步操作按顺序执行。

```js
co(function*() {
  const r1 = yield readFilePromise('1.json');
  const r2 = yield readFilePromise('2.json');
  const r3 = yield readFilePromise('3.json');
  const r4 = yield readFilePromise('4.json');
});
复制代码;
```

### async + await 方式

这是 ES7 中新增的关键字，凡是加上 async 的函数都默认返回一个 Promise 对象，而更重要的是 async + await 也能让异步代码以同步的方式来书写，而不需要借助第三方库的支持。

```js
const readFileAsync = async function() {
  const f1 = await readFilePromise('1.json');
  const f2 = await readFilePromise('2.json');
  const f3 = await readFilePromise('3.json');
  const f4 = await readFilePromise('4.json');
};
复制代码;
```

这四种经典的异步编程方式就简单回顾完了，由于是鸟瞰大局，我觉得`知道是什么`比`了解细节`要重要, 因此也没有展开。不过没关系，接下来，让我们针对这些具体的解决方案，一步步深入异步编程，理解其中的本质。

## 第 33 篇: 能不能简单实现一下 node 中回调函数的机制？

`回调函数`的方式其实内部利用了`发布-订阅`模式，在这里我们以模拟实现 node 中的 Event 模块为例来写实现回调函数的机制。

```js
function EventEmitter() {
  this.events = new Map();
}
复制代码;
```

这个 EventEmitter 一共需要实现这些方法: `addListener`, `removeListener`, `once`, `removeAllListener`, `emit`。

首先是 addListener：

```js
// once 参数表示是否只是触发一次
const wrapCallback = (fn, once = false) => ({
  callback: fn,
  once,
});

EventEmitter.prototype.addListener = function(
  type,
  fn,
  once = false,
) {
  let handler = this.events.get(type);
  if (!handler) {
    // 为 type 事件绑定回调
    this.events.set(type, wrapCallback(fn, once));
  } else if (
    handler &&
    typeof handler.callback === 'function'
  ) {
    // 目前 type 事件只有一个回调
    this.events.set(type, [
      handler,
      wrapCallback(fn, once),
    ]);
  } else {
    // 目前 type 事件回调数 >= 2
    handler.push(wrapCallback(fn, once));
  }
};
复制代码;
```

removeLisener 的实现如下:

```js
EventEmitter.prototype.removeListener = function(
  type,
  listener,
) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (!Array.isArray(handler)) {
    if (handler.callback === listener.callback)
      this.events.delete(type);
    else return;
  }
  for (let i = 0; i < handler.length; i++) {
    let item = handler[i];
    if (item.callback === listener.callback) {
      // 删除该回调，注意数组塌陷的问题，即后面的元素会往前挪一位。i 要 --
      handler.splice(i, 1);
      i--;
      if (handler.length === 1) {
        // 长度为 1 就不用数组存了
        this.events.set(type, handler[0]);
      }
    }
  }
};
复制代码;
```

once 实现思路很简单，先调用 addListener 添加上了 once 标记的回调对象, 然后在 emit 的时候遍历回调列表，将标记了 once: true 的项 remove 掉即可。

```js
EventEmitter.prototype.once = function(type, fn) {
  this.addListener(type, fn, true);
};

EventEmitter.prototype.emit = function(type, ...args) {
  let handler = this.events.get(type);
  if (!handler) return;
  if (Array.isArray(handler)) {
    // 遍历列表，执行回调
    handler.map((item) => {
      item.callback.apply(this, args);
      // 标记的 once: true 的项直接移除
      if (item.once) this.removeListener(type, item);
    });
  } else {
    // 只有一个回调则直接执行
    handler.callback.apply(this, args);
  }
  return true;
};

复制代码;
```

最后是 removeAllListener：

```js
EventEmitter.prototype.removeAllListener = function(type) {
  let handler = this.events.get(type);
  if (!handler) return;
  else this.events.delete(type);
};
复制代码;
```

现在我们测试一下:

```js
let e = new EventEmitter();
e.addListener('type', () => {
  console.log('type事件触发！');
});
e.addListener('type', () => {
  console.log('WOW!type事件又触发了！');
});

function f() {
  console.log('type事件我只触发一次');
}
e.once('type', f);
e.emit('type');
e.emit('type');
e.removeAllListener('type');
e.emit('type');

// type事件触发！
// WOW!type事件又触发了！
// type事件我只触发一次
// type事件触发！
// WOW!type事件又触发了！
复制代码;
```

OK，一个简易的 Event 就这样实现完成了，为什么说它简易呢？因为还有很多细节的部分没有考虑:

1. 在`参数少`的情况下，call 的性能优于 apply，反之 apply 的性能更好。因此在执行回调时候可以根据情况调用 call 或者 apply。
2. 考虑到内存容量，应该设置`回调列表的最大值`，当超过最大值的时候，应该选择部分回调进行删除操作。
3. `鲁棒性`有待提高。对于`参数的校验`很多地方直接忽略掉了。

不过，这个案例的目的只是带大家掌握核心的原理，如果在这里洋洋洒洒写三四百行意义也不大，有兴趣的可以去看看 Node 中 [Event 模块](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FGozala%2Fevents%2Fblob%2Fmaster%2Fevents.js) 的源码，里面对各种细节和边界情况做了详细的处理。

## 第 34 篇: Promise 之问(一)——Promise 凭借什么消灭了回调地狱？

### 问题

首先，什么是回调地狱:

1. 多层嵌套的问题。
2. 每种任务的处理结果存在两种可能性（成功或失败），那么需要在每种任务执行结束后分别处理这两种可能性。

这两种问题在回调函数时代尤为突出。Promise 的诞生就是为了解决这两个问题。

### 解决方法

Promise 利用了三大技术手段来解决`回调地狱`:

- **回调函数延迟绑定**。
- **返回值穿透**。
- **错误冒泡**。

首先来举个例子:

```js
let readFilePromise = (filename) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
};
readFilePromise('1.json').then((data) => {
  return readFilePromise('2.json');
});
复制代码;
```

看到没有，回调函数不是直接声明的，而是在通过后面的 then 方法传入的，即延迟传入。这就是`回调函数延迟绑定`。

然后我们做以下微调:

```js
let x = readFilePromise('1.json').then((data) => {
  return readFilePromise('2.json'); //这是返回的Promise
});
x.then(/* 内部逻辑省略 */);
复制代码;
```

我们会根据 then 中回调函数的传入值创建不同类型的 Promise, 然后把返回的 Promise 穿透到外层, 以供后续的调用。这里的 x 指的就是内部返回的 Promise，然后在 x 后面可以依次完成链式调用。

这便是`返回值穿透`的效果。

这两种技术一起作用便可以将深层的嵌套回调写成下面的形式:

```js
readFilePromise('1.json')
  .then((data) => {
    return readFilePromise('2.json');
  })
  .then((data) => {
    return readFilePromise('3.json');
  })
  .then((data) => {
    return readFilePromise('4.json');
  });
复制代码;
```

这样就显得清爽了许多，更重要的是，它更符合人的线性思维模式，开发体验也更好。

两种技术结合产生了`链式调用`的效果。

这解决的是多层嵌套的问题，那另一个问题，即每次任务执行结束后`分别处理成功和失败`的情况怎么解决的呢？

Promise 采用了`错误冒泡`的方式。其实很简单理解，我们来看看效果:

```js
readFilePromise('1.json')
  .then((data) => {
    return readFilePromise('2.json');
  })
  .then((data) => {
    return readFilePromise('3.json');
  })
  .then((data) => {
    return readFilePromise('4.json');
  })
  .catch((err) => {
    // xxx
  });
复制代码;
```

这样前面产生的错误会一直向后传递，被 catch 接收到，就不用频繁地检查错误了。

### 解决效果

- 1. 实现链式调用，解决多层嵌套问题
- 1. 实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题

## 第 35 篇: Promise 之问(二)——为什么 Promise 要引入微任务？

在这里，如果你还没有接触过 Promise, 务必去看看 [MDN 文档](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FPromise)，了解使用方式，不然后面很会懵。

Promise 中的执行函数是同步进行的，但是里面存在着异步操作，在异步操作结束后会调用 resolve 方法，或者中途遇到错误调用 reject 方法，这两者都是作为微任务进入到 EventLoop 中。但是你有没有想过，Promise 为什么要引入微任务的方式来进行回调操作？

### 解决方式

回到问题本身，其实就是如何处理回调的问题。总结起来有三种方式:

1. 使用同步回调，直到异步任务进行完，再进行后面的任务。
2. 使用异步回调，将回调函数放在进行`宏任务队列`的队尾。
3. 使用异步回调，将回调函数放到`当前宏任务中`的最后面。

### 优劣对比

第一种方式显然不可取，因为同步的问题非常明显，会让整个脚本阻塞住，当前任务等待，后面的任务都无法得到执行，而这部分`等待的时间`是可以拿来完成其他事情的，导致 CPU 的利用率非常低，而且还有另外一个致命的问题，就是无法实现`延迟绑定`的效果。

如果采用第二种方式，那么执行回调(resolve/reject)的时机应该是在前面`所有的宏任务`完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成`应用卡顿`。

为了解决上述方案的问题，另外也考虑到`延迟绑定`的需求，Promise 采取第三种方式, 即`引入微任务`, 即把 resolve(reject) 回调的执行放在当前宏任务的末尾。

这样，利用`微任务`解决了两大痛点:

- 1. 采用**异步回调**替代同步回调解决了浪费 CPU 性能的问题。
- 1. 放到**当前宏任务最后**执行，解决了回调执行的实时性问题。

好，Promise 的基本实现思想已经讲清楚了，相信大家已经知道了它`为什么这么设计`，接下来就让我们一步步弄清楚它内部到底是`怎么设计的`。

## 第 36 篇: Promise 之问(三)——Promise 如何实现链式调用？

从现在开始，我们就来动手实现一个功能完整的 Promise，一步步深挖其中的细节。我们先从链式调用开始。

### 简易版实现

首先写出第一版的代码:

```js
//定义三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
  let self = this; // 缓存当前promise实例
  self.value = null;
  self.error = null;
  self.status = PENDING;
  self.onFulfilled = null; //成功的回调函数
  self.onRejected = null; //失败的回调函数

  const resolve = (value) => {
    if (self.status !== PENDING) return;
    setTimeout(() => {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled(self.value); //resolve时执行成功回调
    });
  };

  const reject = (error) => {
    if (self.status !== PENDING) return;
    setTimeout(() => {
      self.status = REJECTED;
      self.error = error;
      self.onRejected(self.error); //resolve时执行成功回调
    });
  };
  executor(resolve, reject);
}
MyPromise.prototype.then = function(
  onFulfilled,
  onRejected,
) {
  if (this.status === PENDING) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  } else if (this.status === FULFILLED) {
    //如果状态是fulfilled，直接执行成功回调，并将成功值传入
    onFulfilled(this.value);
  } else {
    //如果状态是rejected，直接执行失败回调，并将失败原因传入
    onRejected(this.error);
  }
  return this;
};
复制代码;
```

可以看到，Promise 的本质是一个`有限状态机`，存在三种状态:

- PENDING(等待)
- FULFILLED(成功)
- REJECTED(失败)

状态改变规则如下图:

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/11/23/16e96b8e92d3868d~tplv-t2oaga2asx-watermark.awebp)

对于 Promise 而言，状态的改变`不可逆`，即由等待态变为其他的状态后，就无法再改变了。

不过，回到目前这一版的 Promise, 还是存在一些问题的。

### 设置回调数组

首先只能执行一个回调函数，对于多个回调的绑定就无能为力，比如下面这样:

```js
let promise1 = new MyPromise((resolve, reject) => {
  fs.readFile('./001.txt', (err, data) => {
    if (!err) {
      resolve(data);
    } else {
      reject(err);
    }
  });
});

let x1 = promise1.then((data) => {
  console.log('第一次展示', data.toString());
});

let x2 = promise1.then((data) => {
  console.log('第二次展示', data.toString());
});

let x3 = promise1.then((data) => {
  console.log('第三次展示', data.toString());
});
复制代码;
```

这里我绑定了三个回调，想要在 resolve() 之后一起执行，那怎么办呢？

需要将 `onFulfilled` 和 `onRejected` 改为数组，调用 resolve 时将其中的方法拿出来一一执行即可。

```js
self.onFulfilledCallbacks = [];
self.onRejectedCallbacks = [];
复制代码;
MyPromise.prototype.then = function(
  onFulfilled,
  onRejected,
) {
  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value);
  } else {
    onRejected(this.error);
  }
  return this;
};
复制代码;
```

接下来将 resolve 和 reject 方法中执行回调的部分进行修改：

```js
// resolve 中
self.onFulfilledCallbacks.forEach((callback) =>
  callback(self.value),
);
//reject 中
self.onRejectedCallbacks.forEach((callback) =>
  callback(self.error),
);
复制代码;
```

### 链式调用完成

我们采用目前的代码来进行测试:

```js
let fs = require('fs');
let readFilePromise = (filename) => {
  return new MyPromise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};
readFilePromise('./001.txt')
  .then((data) => {
    console.log(data.toString());
    return readFilePromise('./002.txt');
  })
  .then((data) => {
    console.log(data.toString());
  });
// 001.txt的内容
// 001.txt的内容
复制代码;
```

咦？怎么打印了两个 `001`，第二次不是读的 `002` 文件吗？

问题出在这里:

```js
MyPromise.prototype.then = function(
  onFulfilled,
  onRejected,
) {
  //...
  return this;
};
复制代码;
```

这么写每次返回的都是第一个 Promise。then 函数当中返回的第二个 Promise 直接被无视了！

说明 then 当中的实现还需要改进, 我们现在需要对 then 中返回值重视起来。

```js
MyPromise.prototype.then = function(
  onFulfilled,
  onRejected,
) {
  let bridgePromise;
  let self = this;
  if (self.status === PENDING) {
    return (bridgePromise = new MyPromise(
      (resolve, reject) => {
        self.onFulfilledCallbacks.push((value) => {
          try {
            // 看到了吗？要拿到 then 中回调返回的结果。
            let x = onFulfilled(value);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
        self.onRejectedCallbacks.push((error) => {
          try {
            let x = onRejected(error);
            resolve(x);
          } catch (e) {
            reject(e);
          }
        });
      },
    ));
  }
  //...
};
复制代码;
```

假若当前状态为 PENDING，将回调数组中添加如上的函数，当 Promise 状态变化后，会遍历相应回调数组并执行回调。

但是这段程度还是存在一些问题:

1. 首先 then 中的两个参数不传的情况并没有处理，
2. 假如 then 中的回调执行后返回的结果(也就是上面的`x`)是一个 Promise, 直接给 resolve 了，这是我们不希望看到的。

怎么来解决这两个问题呢？

先对参数不传的情况做判断:

```js
// 成功回调不传给它一个默认函数
onFulfilled =
  typeof onFulfilled === 'function'
    ? onFulfilled
    : (value) => value;
// 对于失败回调直接抛错
onRejected =
  typeof onRejected === 'function'
    ? onRejected
    : (error) => {
        throw error;
      };
复制代码;
```

然后对`返回Promise`的情况进行处理:

```js
function resolvePromise(bridgePromise, x, resolve, reject) {
  //如果x是一个promise
  if (x instanceof MyPromise) {
    // 拆解这个 promise ，直到返回值不为 promise 为止
    if (x.status === PENDING) {
      x.then(
        (y) => {
          resolvePromise(bridgePromise, y, resolve, reject);
        },
        (error) => {
          reject(error);
        },
      );
    } else {
      x.then(resolve, reject);
    }
  } else {
    // 非 Promise 的话直接 resolve 即可
    resolve(x);
  }
}
复制代码;
```

然后在 then 的方法实现中作如下修改:

```js
resolve(x)  ->  resolvePromise(bridgePromise, x, resolve, reject);
复制代码
```

在这里大家好好体会一下拆解 Promise 的过程，其实不难理解，我要强调的是其中的递归调用始终传入的`resolve`和`reject`这两个参数是什么含义，其实他们控制的是最开始传入的`bridgePromise`的状态，这一点非常重要。

紧接着，我们实现一下当 Promise 状态不为 PENDING 时的逻辑。

成功状态下调用 then：

```js
if (self.status === FULFILLED) {
  return (bridgePromise = new MyPromise(
    (resolve, reject) => {
      try {
        // 状态变为成功，会有相应的 self.value
        let x = onFulfilled(self.value);
        // 暂时可以理解为 resolve(x)，后面具体实现中有拆解的过程
        resolvePromise(bridgePromise, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    },
  ));
}
复制代码;
```

失败状态下调用 then：

```js
if (self.status === REJECTED) {
  return (bridgePromise = new MyPromise(
    (resolve, reject) => {
      try {
        // 状态变为失败，会有相应的 self.error
        let x = onRejected(self.error);
        resolvePromise(bridgePromise, x, resolve, reject);
      } catch (e) {
        reject(e);
      }
    },
  ));
}
复制代码;
```

Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 `setTimeout`(属于**宏任务**的范畴) 来模拟，用 `setTimeout`将需要执行的任务包裹 ，当然，上面的 resolve 实现也是同理, 大家注意一下即可，其实并不是真正的微任务。

```js
if (self.status === FULFILLED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      //...
    })
}
复制代码
if (self.status === REJECTED) {
  return bridgePromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      //...
    })
}
复制代码
```

好了，到这里, 我们基本实现了 then 方法，现在我们拿刚刚的测试代码做一下测试, 依次打印如下:

```js
(001).txt的内容;
(002).txt的内容;
复制代码;
```

可以看到，已经可以顺利地完成链式调用。

### 错误捕获及冒泡机制分析

现在来实现 catch 方法:

```js
Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};
复制代码;
```

对，就是这么几行，catch 原本就是 then 方法的语法糖。

相比于实现来讲，更重要的是理解其中错误冒泡的机制，即中途一旦发生错误，可以在最后用 catch 捕获错误。

我们回顾一下 Promise 的运作流程也不难理解，贴上一行关键的代码:

```js
// then 的实现中
onRejected =
  typeof onRejected === 'function'
    ? onRejected
    : (error) => {
        throw error;
      };
复制代码;
```

一旦其中有一个`PENDING状态`的 Promise 出现错误后状态必然会变为`失败`, 然后执行 `onRejected`函数，而这个 onRejected 执行又会抛错，把新的 Promise 状态变为`失败`，新的 Promise 状态变为失败后又会执行`onRejected`......就这样一直抛下去，直到用`catch` 捕获到这个错误，才停止往下抛。

这就是 Promise 的`错误冒泡机制`。

至此，Promise 三大法宝: `回调函数延迟绑定`、`回调返回值穿透`和`错误冒泡`。

## 第 37 篇: Promise 之问(四)——实现 Promise 的 resolve、reject 和 finally

### 实现 Promise.resolve

实现 resolve 静态方法有三个要点:

- 1. 传参为一个 Promise, 则直接返回它。
- 1. 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，`采用它的最终状态`作为`自己的状态`。
- 1. 其他情况，直接返回以该值为成功状态的 promise 对象。

具体实现如下:

```js
Promise.resolve = (param) => {
  if (param instanceof Promise) return param;
  return new Promise((resolve, reject) => {
    if (
      param &&
      param.then &&
      typeof param.then === 'function'
    ) {
      // param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
      param.then(resolve, reject);
    } else {
      resolve(param);
    }
  });
};
复制代码;
```

### 实现 Promise.reject

Promise.reject 中传入的参数会作为一个 reason 原封不动地往下传, 实现如下:

```js
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
复制代码;
```

### 实现 Promise.prototype.finally

无论当前 Promise 是成功还是失败，调用`finally`之后都会执行 finally 中传入的函数，并且将值原封不动的往下传。

```js
Promise.prototype.finally = function(callback) {
  this.then(
    (value) => {
      return Promise.resolve(callback()).then(() => {
        return value;
      });
    },
    (error) => {
      return Promise.resolve(callback()).then(() => {
        throw error;
      });
    },
  );
};
复制代码;
```

## 第 38 篇: Promise 之问(五)——实现 Promise 的 all 和 race

### 实现 Promise.all

对于 all 方法而言，需要完成下面的核心功能:

1. 传入参数为一个空的可迭代对象，则`直接进行resolve`。
2. 如果参数中`有一个`promise 失败，那么 Promise.all 返回的 promise 对象失败。
3. 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个`数组`

具体实现如下:

```js
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    let result = [];
    let index = 0;
    let len = promises.length;
    if (len === 0) {
      resolve(result);
      return;
    }

    for (let i = 0; i < len; i++) {
      // 为什么不直接 promise[i].then, 因为promise[i]可能不是一个promise
      Promise.resolve(promise[i])
        .then((data) => {
          result[i] = data;
          index++;
          if (index === len) resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};
复制代码;
```

### 实现 Promise.race

race 的实现相比之下就简单一些，只要有一个 promise 执行完，直接 resolve 并停止执行。

```js
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    let len = promises.length;
    if (len === 0) return;
    for (let i = 0; i < len; i++) {
      Promise.resolve(promise[i])
        .then((data) => {
          resolve(data);
          return;
        })
        .catch((err) => {
          reject(err);
          return;
        });
    }
  });
};
复制代码;
```

到此为止，一个完整的 Promise 就被我们实现完啦。从原理到细节，我们一步步拆解和实现，希望大家在知道 Promise 设计上的几大亮点之后，也能自己手动实现一个 Promise，让自己的思维层次和动手能力更上一层楼！

## 第 39 篇: 谈谈你对生成器以及协程的理解。

生成器(Generator)是 ES6 中的新语法，相对于之前的异步语法，上手的难度还是比较大的。因此这里我们先来好好熟悉一下 Generator 语法。

### 生成器执行流程

上面是生成器函数？

生成器是一个带`星号`的"函数"(注意：它并不是真正的函数)，可以通过`yield`关键字`暂停执行`和`恢复执行`的

举个例子:

```js
function* gen() {
  console.log('enter');
  let a = yield 1;
  let b = yield (function() {
    return 2;
  })();
  return 3;
}
var g = gen(); // 阻塞住，不会执行任何语句
console.log(typeof g); // object  看到了吗？不是"function"

console.log(g.next());
console.log(g.next());
console.log(g.next());
console.log(g.next());

// enter
// { value: 1, done: false }

// { value: 2, done: false }
// { value: 3, done: true }
// { value: undefined, done: true }
复制代码;
```

由此可以看到，生成器的执行有这样几个关键点:

1. 调用 gen() 后，程序会阻塞住，不会执行任何语句。
2. 调用 g.next() 后，程序继续执行，直到遇到 yield 程序暂停。
3. next 方法返回一个对象， 有两个属性: `value` 和 `done`。value 为`当前 yield 后面的结果`，done 表示`是否执行完`，遇到了`return` 后，`done` 会由`false`变为`true`。

### yield\*

当一个生成器要调用另一个生成器时，使用 yield\* 就变得十分方便。比如下面的例子:

```js
function* gen1() {
  yield 1;
  yield 4;
}
function* gen2() {
  yield 2;
  yield 3;
}
复制代码;
```

我们想要按照`1234`的顺序执行，如何来做呢？

在 `gen1` 中，修改如下:

```js
function* gen1() {
  yield 1;
  yield* gen2();
  yield 4;
}
复制代码;
```

这样修改之后，之后依次调用`next`即可。

### 生成器实现机制——协程

可能你会比较好奇，生成器究竟是如何让函数暂停, 又会如何恢复的呢？接下来我们就来对其中的执行机制——`协程`一探究竟。

#### 什么是协程？

协程是一种比线程更加轻量级的存在，协程处在线程的环境中，`一个线程可以存在多个协程`，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

#### 协程的运作过程

那你可能要问了，JS 不是单线程执行的吗，开这么多协程难道可以一起执行吗？

答案是：并不能。一个线程一次只能执行一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中将`JS 线程的控制权转交给 B协程`，那么现在 B 执行，A 就相当于处于暂停的状态。

举个具体的例子:

```js
function* A() {
  console.log('我是A');
  yield B(); // A停住，在这里转交线程执行权给B
  console.log('结束了');
}
function B() {
  console.log('我是B');
  return 100; // 返回，并且将线程执行权还给A
}
let gen = A();
gen.next();
gen.next();

// 我是A
// 我是B
// 结束了
复制代码;
```

在这个过程中，A 将执行权交给 B，也就是 `A 启动 B`，我们也称 A 是 B 的**父协程**。因此 B 当中最后`return 100`其实是将 100 传给了父协程。

需要强调的是，对于协程来说，它并不受操作系统的控制，完全由用户自定义切换，因此并没有进程/线程`上下文切换`的开销，这是`高性能`的重要原因。

OK, 原理就说到这里。可能你还会有疑问: 这个生成器不就暂停-恢复、暂停-恢复这样执行的吗？它和异步有什么关系？而且，每次执行都要调用 next，能不能让它一次性执行完毕呢？下一节我们就来仔细拆解这些问题。

## 第 40 篇: 如何让 Generator 的异步代码按顺序执行完毕？

这里面其实有两个问题:

1. `Generator` 如何跟`异步`产生关系？
2. 怎么把 `Generator` 按顺序执行完毕？

### thunk 函数

要想知道 `Generator` 跟异步的关系，首先带大家搞清楚一个概念——thunk 函数(即`偏函数`)，虽然这只是实现两者关系的方式之一。(另一种方式是`Promise`, 后面会讲到)

举个例子，比如我们现在要判断数据类型。可以写如下的判断逻辑:

```js
let isString = (obj) => {
  return (
    Object.prototype.toString.call(obj) ===
    '[object String]'
  );
};
let isFunction = (obj) => {
  return (
    Object.prototype.toString.call(obj) ===
    '[object Function]'
  );
};
let isArray = (obj) => {
  return (
    Object.prototype.toString.call(obj) === '[object Array]'
  );
};
let isSet = (obj) => {
  return (
    Object.prototype.toString.call(obj) === '[object Set]'
  );
};
// ...
复制代码;
```

可以看到，出现了非常多重复的逻辑。我们将它们做一下封装:

```js
let isType = (type) => {
  return (obj) => {
    return (
      Object.prototype.toString.call(obj) ===
      `[object ${type}]`
    );
  };
};
复制代码;
```

现在我们这样做即可:

```js
let isString = isType('String');
let isFunction = isType('Function');
//...
复制代码;
```

相应的 `isString`和`isFunction`是由`isType`生产出来的函数，但它们依然可以判断出参数是否为 String（Function），而且代码简洁了不少。

```js
isString('123');
isFunction((val) => val);
复制代码;
```

**isType**这样的函数我们称为**thunk 函数**。它的核心逻辑是接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。thunk 函数的实现会比单个的判断函数复杂一点点，但就是这一点点的复杂，大大方便了后续的操作。

### Generator 和 异步

#### thunk 版本

以`文件操作`为例，我们来看看 **异步操作** 如何应用于`Generator`。

```js
const readFileThunk = (filename) => {
  return (callback) => {
    fs.readFile(filename, callback);
  };
};
复制代码;
```

`readFileThunk`就是一个`thunk函数`。异步操作核心的一环就是绑定回调函数，而`thunk函数`可以帮我们做到。首先传入文件名，然后生成一个针对某个文件的定制化函数。这个函数中传入回调，这个回调就会成为异步操作的回调。这样就让 `Generator` 和`异步`关联起来了。

紧接者我们做如下的操作:

```js
const gen = function*() {
  const data1 = yield readFileThunk('001.txt');
  console.log(data1.toString());
  const data2 = yield readFileThunk('002.txt');
  console.log(data2.toString);
};
复制代码;
```

接着我们让它执行完:

```js
let g = gen();
// 第一步: 由于进场是暂停的，我们调用next，让它开始执行。
// next返回值中有一个value值，这个value是yield后面的结果，放在这里也就是是thunk函数生成的定制化函数，里面需要传一个回调函数作为参数
g.next().value((err, data1) => {
  // 第二步: 拿到上一次得到的结果，调用next, 将结果作为参数传入，程序继续执行。
  // 同理，value传入回调
  g.next(data1).value((err, data2) => {
    g.next(data2);
  });
});

复制代码;
```

打印结果如下:

```
001.txt的内容
002.txt的内容
复制代码
```

上面嵌套的情况还算简单，如果任务多起来，就会产生很多层的嵌套，可操作性不强，有必要把执行的代码封装一下:

```js
function run(gen) {
  const next = (err, data) => {
    let res = gen.next(data);
    if (res.done) return;
    res.value(next);
  };
  next();
}
run(g);
复制代码;
```

Ok,再次执行，依然打印正确的结果。代码虽然就这么几行，但包含了递归的过程，好好体会一下。

这是通过`thunk`完成异步操作的情况。

#### Promise 版本

还是拿上面的例子，用`Promise`来实现就轻松一些:

```js
const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).then((res) => res);
};
const gen = function*() {
  const data1 = yield readFilePromise('001.txt');
  console.log(data1.toString());
  const data2 = yield readFilePromise('002.txt');
  console.log(data2.toString);
};
复制代码;
```

执行的代码如下:

```js
let g = gen();
function getGenPromise(gen, data) {
  return gen.next(data).value;
}
getGenPromise(g)
  .then((data1) => {
    return getGenPromise(g, data1);
  })
  .then((data2) => {
    return getGenPromise(g, data2);
  });
复制代码;
```

打印结果如下:

```
001.txt的内容
002.txt的内容
复制代码
```

同样，我们可以对执行`Generator`的代码加以封装:

```js
function run(g) {
  const next = (data) => {
    let res = g.next();
    if (res.done) return;
    res.value.then((data) => {
      next(data);
    });
  };
  next();
}
复制代码;
```

同样能输出正确的结果。代码非常精炼，希望能参照刚刚链式调用的例子，仔细体会一下递归调用的过程。

### 采用 co 库

以上我们针对 `thunk 函数`和`Promise`两种`Generator异步操作`的一次性执行完毕做了封装，但实际场景中已经存在成熟的工具包了，如果大名鼎鼎的**co**库, 其实核心原理就是我们已经手写过了（就是刚刚封装的 Promise 情况下的执行代码），只不过源码会各种边界情况做了处理。使用起来非常简单:

```js
const co = require('co');
let g = gen();
co(g).then((res) => {
  console.log(res);
});
复制代码;
```

打印结果如下:

```js
(001).txt的内容;
(002).txt的内容;
100;
复制代码;
```

简单几行代码就完成了`Generator`所有的操作，真不愧`co`和`Generator`天生一对啊！

## 第 41 篇: 解释一下 async/await 的运行机制。

`async/await`被称为 JS 中**异步终极解决方案**。它既能够像 co + Generator 一样用同步的方式来书写异步代码，又得到底层的语法支持，无需借助任何第三方库。接下来，我们从原理的角度来重新审视这个语法糖背后究竟做了些什么。

### async

什么是 async ?

> MDN 的定义: async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。

注意重点: **返回结果为 Promise**。

举个例子:

```js
async function func() {
  return 100;
}
console.log(func());
// Promise {<resolved>: 100}
复制代码;
```

这就是隐式返回 Promise 的效果。

### await

我们来看看 `await`做了些什么事情。

以一段代码为例:

```js
async function test() {
  console.log(100);
  let x = await 200;
  console.log(x);
  console.log(200);
}
console.log(0);
test();
console.log(300);
复制代码;
```

我们来分析一下这段程序。首先代码同步执行，打印出`0`，然后将`test`压入执行栈，打印出`100`, 下面注意了，遇到了关键角色**await**。

放个慢镜头:

```js
await 100;
复制代码;
```

被 JS 引擎转换成一个 Promise :

```js
let promise = new Promise((resolve, reject) => {
  resolve(100);
});
复制代码;
```

这里调用了 resolve，resolve 的任务进入微任务队列。

然后，JS 引擎将暂停当前协程的运行，把线程的执行权交给`父协程`(父协程不懂是什么的，上上篇才讲，回去补课)。

回到父协程中，父协程的第一件事情就是对`await`返回的`Promise`调用`then`, 来监听这个 Promise 的状态改变 。

```js
promise.then((value) => {
  // 相关逻辑，在resolve 执行之后来调用
});
复制代码;
```

然后往下执行，打印出`300`。

根据`EventLoop`机制，当前主线程的宏任务完成，现在检查`微任务队列`, 发现还有一个 Promise 的 resolve，执行，现在父协程在`then`中传入的回调执行。我们来看看这个回调具体做的是什么。

```js
promise.then((value) => {
  // 1. 将线程的执行权交给test协程
  // 2. 把 value 值传递给 test 协程
});
复制代码;
```

Ok, 现在执行权到了`test协程`手上，test 接收到`父协程`传来的**200**, 赋值给 a ,然后依次执行后面的语句，打印`200`、`200`。

最后的输出为:

```js
0;
100;
300;
200;
200;
复制代码;
```

总结一下，`async/await`利用`协程`和`Promise`实现了同步方式编写异步代码的效果，其中`Generator`是对`协程`的一种实现，虽然语法简单，但引擎在背后做了大量的工作，我们也对这些工作做了一一的拆解。用`async/await`写出的代码也更加优雅、美观，相比于之前的`Promise`不断调用 then 的方式，语义化更加明显，相比于`co + Generator`性能更高，上手成本也更低，不愧是 JS 异步终极解决方案！

## 第 42 篇: forEach 中用 await 会产生什么问题?怎么解决这个问题？

### 问题

问题:**对于异步代码，forEach 并不能保证按顺序执行。**

举个例子:

```js
async function test() {
  let arr = [4, 2, 1];
  arr.forEach(async (item) => {
    const res = await handle(item);
    console.log(res);
  });
  console.log('结束');
}

function handle(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x);
    }, 1000 * x);
  });
}

test();
复制代码;
```

我们期望的结果是:

```js
4;
2;
1;
结束;
复制代码;
```

但是实际上会输出:

```js
结束;
1;
2;
4;
复制代码;
```

### 问题原因

这是为什么呢？我想我们有必要看看`forEach`底层怎么实现的。

```js
// 核心逻辑
for (var i = 0; i < length; i++) {
  if (i in array) {
    var element = array[i];
    callback(element, i, array);
  }
}
复制代码;
```

可以看到，forEach 拿过来直接执行了，这就导致它无法保证异步任务的执行顺序。比如后面的任务用时短，那么就又可能抢在前面的任务之前执行。

### 解决方案

如何来解决这个问题呢？

其实也很简单, 我们利用`for...of`就能轻松解决。

```js
async function test() {
  let arr = [4, 2, 1];
  for (const item of arr) {
    const res = await handle(item);
    console.log(res);
  }
  console.log('结束');
}
复制代码;
```

### 解决原理——Iterator

好了，这个问题看起来好像很简单就能搞定，你有想过这么做为什么可以成功吗？

其实，for...of 并不像 forEach 那么简单粗暴的方式去遍历执行，而是采用一种特别的手段——`迭代器`去遍历。

首先，对于数组来讲，它是一种`可迭代数据类型`。那什么是`可迭代数据类型`呢？

> 原生具有[Symbol.iterator]属性数据类型为可迭代数据类型。如数组、类数组（如 arguments、NodeList）、Set 和 Map。

可迭代对象可以通过迭代器进行遍历。

```js
let arr = [4, 2, 1];
// 这就是迭代器
let iterator = arr[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// {value: 4, done: false}
// {value: 2, done: false}
// {value: 1, done: false}
// {value: undefined, done: true}
复制代码;
```

因此，我们的代码可以这样来组织:

```js
async function test() {
  let arr = [4, 2, 1];
  let iterator = arr[Symbol.iterator]();
  let res = iterator.next();
  while (!res.done) {
    let value = res.value;
    console.log(value);
    await handle(value);
    res = iterater.next();
  }
  console.log('结束');
}
// 4
// 2
// 1
// 结束
复制代码;
```

多个任务成功地按顺序执行！其实刚刚的 for...of 循环代码就是这段代码的语法糖。

### 重新认识生成器

回头再看看用 iterator 遍历[4,2,1]这个数组的代码。

```js
let arr = [4, 2, 1];
// 迭代器
let iterator = arr[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// {value: 4, done: false}
// {value: 2, done: false}
// {value: 1, done: false}
// {value: undefined, done: true}
复制代码;
```

咦？返回值有`value`和`done`属性，生成器也可以调用 next,返回的也是这样的数据结构，这么巧?!

没错，**生成器**本身就是一个**迭代器**。

既然属于迭代器，那它就可以用 for...of 遍历了吧？

当然没错，不信来写一个简单的斐波那契数列(50 以内)：

```js
function* fibonacci() {
  let [prev, cur] = [0, 1];
  console.log(cur);
  while (true) {
    [prev, cur] = [cur, prev + cur];
    yield cur;
  }
}

for (let item of fibonacci()) {
  if (item > 50) break;
  console.log(item);
}
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
复制代码;
```

是不是非常酷炫？这就是迭代器的魅力：）同时又对`生成器`有了更深入的理解，没想到我们的老熟人`Generator`还有这样的身份。
