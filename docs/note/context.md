---
title: 优化使用context带来的不必要渲染问题

date: 2021-08-06 20:08:37

permalink: /pages/context/

categories:
  - note

tags:
  -
---

## 预览

  <iframe
 height="850"
 width="90%"
 src="https://react-context-five.vercel.app/"
 frameborder=0
 allowfullscreen />

## 说明

如何体现出组件是否发生 render

```JSX
const getBg = (color) => {
  return {
    backgroundColor: `rgba(${color || "255,1,1"}, ${Math.random()})`
  };
};
```

## Stage1

setState 会让所有子组件更新（因为 createElement 重新执行）

```JSX
import React, { useState } from "react";
import { getBg } from "../getColor";

const Count = (props) => {
  return <div style={getBg()}>{props.count}</div>;
};

const Pure = () => {
  return <div style={getBg()}>pure</div>;
};

const SetCount = (props) => {
  return (
    <Button
      style={getBg()}
      onClick={() => props.setCount((count) => count + 1)}
    >
      SetCount
    </Button>
  );
};

const Stage1 = () => {
  const [count, setCount] = useState(0);
  const [, forceReRender] = useState({});
  console.log("render");
  return (
    <>
      <Button style={getBg()} onClick={() => forceReRender({})}>
        FORCE_RE_RENDER
      </Button>
      <Count count={count} />
      <SetCount setCount={setCount} />
      <Pure />
    </>
  );
};

export default Stage1;

```
