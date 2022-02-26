# Compound Component Pattern

> [Demo Code](https://codesandbox.io/s/compound-component-pattern-7ixd5e?file=/src/components/FlyOutMenu.tsx) @ Code Sandbox

## 適合使用的時機

- 多個元件需要相依在一起才能使用時
- CSS 彼此之間有父層和子層的相依關係
- 都需要在某個 Provider 內才能作用

## 實作

舉例來說，一個 FlyOut 中會包含 List、Item、Toggle 這三個元件，但 List、Item、Toggle 都需要 Flyout 提供的狀態（相依於 Flyout 的狀態），這時候如果我們使用 Compound Component Pattern，就可以讓開發者只需要 import FlyOut 這個元件：

### 使用方式

```tsx
import FlyOut from './FlyOut';

const FlyOutMenu = () => {
  return (
    <FlyOut>
      <FlyOut.Toggle />
      <FlyOut.List>
        <FlyOut.Item>Edit</FlyOut.Item>
        <FlyOut.Item>Delete</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  );
};
```

#### 實作方式

```tsx
import { ReactNode } from 'react';
import { FlyOutProvider } from './context';
import FlyOutToggle from './FlyOutToggle';
import FlyOutItem from './FlyOutItem';
import FlyOutList from './FlyOutList';

const FlyOut = ({ children }: { children: ReactNode }) => {
  return (
    <FlyOutProvider>
      <div className="flyout">{children}</div>
    </FlyOutProvider>
  );
};

// Compound Component Patter 的關鍵
FlyOut.Toggle = FlyOutToggle;
FlyOut.List = FlyOutList;
FlyOut.Item = FlyOutItem;

export default FlyOut;
```

## Props and Cons

### Props

- 對於開發者來說，可以在多個相關的元件中共享狀態
- 對於使用者來說，不需要明確載入 child component，而是只需要載入主元件後就能使用

### Cons

- 如果是使用 `React.Children.map` 的方式，只有 direct children 會取得那些 props，更 nested 在內的 props 就無法取得到父層傳下來的 props
- 使用 `React.cloneElement` 時會做的是 shallow merge，當 props 的名稱有衝突時，props 的值可能會被覆蓋

## 其他: React.Children

除了使用 React Context 在多個元件間共用狀態外，也可以使用 [React.Children](https://reactjs.org/docs/react-api.html#reactchildren) 提供的 `React.Children.map` 搭配 [`React.cloneElement`](https://reactjs.org/docs/react-api.html#cloneelement) 方法：

```tsx
export function FlyOut({ children }: { children: ReactNode }) {
  const [open, toggle] = React.useState(false);

  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, toggle })
      )}
    </div>
  );
}
```

## 實際使用此 pattern 的 UI Library

### Semantic UI React

- [semantic UI React](https://react.semantic-ui.com/modules/dropdown/#types-dropdown) @ Doc
- [Dropdown Modules](https://github.com/Semantic-Org/Semantic-UI-React/tree/master/src/modules/Dropdown) @ Github Source Code

### Ant Design

- [Menu Component](https://github.com/ant-design/ant-design/tree/master/components/menu) @ Github Source Code
- [List Component](https://github.com/ant-design/ant-design/tree/master/components/list) @ Github Source Code

## Reference

- [Compound Pattern](https://www.patterns.dev/posts/compound-pattern/) @ Patters.dev
- [React.Children](https://reactjs.org/docs/react-api.html#reactchildren) @ reactjs
- [cloneElement](https://reactjs.org/docs/react-api.html#cloneelement) @ reactjs
