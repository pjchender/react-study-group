# React 18 帶來的 SSR 2.0

## 參考資料

- [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc&ab_channel=ReactConf2021) @ youtube
- [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37) @ react 18
- [Selective Hydration](https://github.com/reactwg/react-18/discussions/130) @ react 18

## 前言

先說結論，沒有所謂「SSR 2.0」這個詞彙，這是我自創的，但 React 18 的確帶來了很不一樣的 SSR。

今天講的內容和 Server Component 無關。

讓我們先來看兩個最典型的網頁。

接者讓我們來想想：「相較於 CSR，SSR 帶來什麼好處？」、「為什麼要做 SSR？」

## 認識幾個 Web Performance 指標

- TTFB（Time to First Byte）
- FCP（First Contentful Paint）
- LCP（Large Contentful Paint）

## 相較於 CSR，SSR 想解決的問題

### CSR (Client Side Rendering)

「畫面渲染（包括 HTML 和事件處理）」和「資料拉取」都從 client 處理

- 專案越大，使用者要下載 bundle JS files 也越大
- 當 bundle size 越大時，**檔案下載完成前使用者看到的都是空白畫面（或 loading）**，可能導致 FCP、LCP 和 TTI 都變差
- 畫面上的不同區塊不用一次全部呈現，可以逐塊顯示

### SSR (Server Side Rendering)

透過 SSR 實際上希望改善 CSR 的不足：

- CSR 要下載很大的一包 JavaScript 後使用者才能看到內容（很久的 loading 畫面）
- 改善 FCP 和 LCP

但也衍生出了其他問題：

- TTFB 較差，畫面出現了但使用者仍能無法互動：仍然需要等待 JavaScript 下載、並執行 hydration 後，使用者才能和畫面上的元件互動

:::tip

SSR 最大的好處是提升使用者體驗，讓使用者可以先看到畫面內容，並同時於背景繼續下載和執行 bundle size 較小的 JavaScript（相較於 CSR 這種需要等待 JS 全部下載並執行完後才看得到畫面）。

:::

## 傳統 SSR 的流程

在 React 18 前，SSR 需要：

1. **先 fetch 完所有的資料後：因為 data 都是在 server 端進行 fetching**。
1. 產生 HTML 檔案，才能顯示頁面。

1. **先下載完所有的 JavaScript 後，才能開始 hydrate，而且 hydration 是在整個頁面一次處理完**。
   （在還沒完成 hydration 前，即使使用者已經可以看到頁面中的內容，但仍無法進行互動）

1. **需要全部 hydrate 完後，使用者才能開始在頁面進行互動**。

> `hydrate`：主要的動作是將 event handlers 綁定在 DOM 元素上，並且準備好對這些事件做反應；其次則是要強化 server rendered 的頁面，例如，自動播放影片、訂閱一些需 live 顯示的資料等等。

![Streaming Server Rendering with Suspense](https://i.imgur.com/IPGXaWN.png)

**由於傳統 SSR 每一個步驟都需要等待前一個步驟結束後才能開始執行，只要任何一個步驟變慢，都會使得使用者說需的時間增加。**

## 魚與熊掌不能兼得！？

## React 18 想解決的問題

簡單來說，在 React 18 以前的 SSR，「整個頁面」被視為最小單位，每個頁面都需要走完這四個步驟後，使用者才能有完整的體驗，在 React 18 之後，期待透過 `<Suspense>` 來做到 selective hydration 的效果，以「元件」作為最小單位。

![Streaming Server Rendering with Suspense](https://i.imgur.com/DTAWwgM.png)

## Suspense 要怎麼用？

在 React 18 以前，Suspense 不支援在 SSR 中使用，因此只能在 CSR 中使用 Suspense。它最大的好處就是拿來做 lazy loading：

```jsx
// https://reactjs.org/docs/react-api.html#reactsuspense

import { lazy, Suspsense } from 'react';
import Spinner from './Spinner';

// code-splitting
const OtherComponent = lazy(() => import('./SomeComponent'));

const MyComponent = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </Suspense>
  );
};
```

在 React 18 後可以在 SSR 中使用 Suspense 希望能夠帶來好處包括：

- React 會把被 Suspense 包起來的元件視為一個最小單位，意思是告訴 React 不需要等待這個元件，可以先串流該頁面其他的 HTML 給 client。此時 server 會先回傳該 Suspense 的 fallback 給 client（例如，loading 的畫面）。
- React 會先處理沒有被 Suspense 包起來的元件，也就是 fetch data、render as HTML、Load JS、Hydrate；對於被 Suspense 包起來的元件來說，則會先以 Spinner 來顯示（render spinner 的 HTML），並繼續在 server 執行 fetching data 的動作，一旦 data fetch 完後，server 會在同一個 stream 回傳該元件的 HTML（包含 script）。
- 當有多個元件被 Suspense 包起來時，這幾個元件都會以併發的方式被處理，這就是 React 18 的 [Concurrent Feature](https://reactjs.org/blog/2022/03/29/react-v18.html#what-is-concurrent-react)，這並不是指多個元件會以平行的方式同時被處理，而是 React 會判斷那個元件需要優先處理，且如果過程中偵測到有其他更急迫的任務，它是可以被中斷的，待其他更急迫的元件處理完後，才再回來處理剛剛被中斷的任務。

:::tip

Selective Hydration 最重要的目標就是要「根據使用者的互動來調整不同元件被 hydrate 的優先順序」。

:::

也就是說，在 React 18：

- 不需要等到整個頁面都載入後才能 hydrate；先 render 出來的 HTML 可以先被 hydrate
- 由於可以先對載入好的頁面就進行 hydrate，因此使用者就可以先對 hydrate 好的部分進行互動
- React 會根據使用者對元件的互動來調整對不同元件 hydrate 的優先順序

## Concurrent Feature 相關的 API

和 Concurrent Feature 有關的 API 包含但不限於：

- [`useDeferredValue`](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue)：當 value 改變時，useDeferredValue 並不會馬上回傳最新的資料狀態，而是會等到 React 處理完其他更急迫的任務後，才會回傳最新的 value 給 deferredValue，進而促使畫面不需要在 value 改變時就立即被更新，而是在 React 沒有其他更急迫的任務時才來做 re-render。

```tsx
const deferredValue = useDeferredValue(value);
```

- [`useTransition`](https://reactjs.org/docs/hooks-reference.html#usetransition)：把更新的優先權下降，所以如果有其他更急迫的更新（例如，點擊）會先被執行。

```tsx
// https://reactjs.org/docs/hooks-reference.html#usetransition

const App = () => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // startTransition 中所造成的會是 transition update
    startTransition(() => {
      setCount(count + 1);
    });
  };

  return (
    <div>
      {/* isPending 可以用來顯示當 transition 正在作用是的 pending state */}
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
};
```

在 React 18 可以：

- Streaming HTML：只需使用 React 提供的 `renderToPipeableStream`
- Selective Hydration：使用 `ReactDOMClient.hydrateRoot` 來取代 CSR 時用的 `ReactDOMClient.createRoot`，並將特定元件用 `<Suspense />` 包起來

## 理想是美好的，來看看目前實際的情況

Suspense 仍然只有 Lazy Loading，還不支援 data-fetching。

![image-20220602165548031](https://i.imgur.com/oFxmZ5V.png)

React 期待 Suspense 結合 data-fetching 的部分可以交由框架（例如，Next.js）來實作，但到目前為止，Next.js 支援在 Server Side 使用 Suspense，但同樣只支援 Lazy Loading 的使用。

![image-20220602165845173](https://i.imgur.com/w7ctC2U.png)

## 實際範例

### CSR 本來就能用 Suspense

![csr](https://i.imgur.com/vuyI4Kp.gif)

### 傳統的 SSR，一次載入所有的 JavaScript，並且同時 hydrate

從 Network 的檔案中搜尋 `hydrated`：

![ssr](https://i.imgur.com/YxqdQFo.gif)

### SSR + Suspense

視覺上和 CSR 的效果一樣，被拆成兩支不同的檔案，獨立 load 及 hydrate：

![ssr-suspense](https://i.imgur.com/xdexYRH.gif)

## 後記

- Next.js 尚無法解決的問題？

## Take Notes

- React 18 Suspense feature 期望的理想是什麼？
- 什麼是 selective hydration？
