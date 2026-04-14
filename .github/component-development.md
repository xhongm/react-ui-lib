# 📘 组件开发规范（README）

> 本文档用于统一公司内部 React 组件库的开发规范，
> 确保组件 **一致性、可维护性、可扩展性**。

---

## 一、设计目标

组件库的目标不是「炫技」，而是：

- ✅ 提高业务开发效率
- ✅ 保证 UI / 交互一致
- ✅ 降低新成员上手成本
- ✅ 组件即文档（Storybook）

---

## 二、组件目录规范（强制）

### 1️⃣ 单组件目录结构

**每个组件必须遵循以下结构：**

```txt
ComponentName
├── ComponentName.tsx        # 组件实现
├── ComponentName.module.scss# 组件样式（CSS Modules）
├── ComponentName.stories.tsx# Storybook 文档（必须）
├── types.ts                 # Props 类型定义
└── index.ts                 # 组件出口
```

❌ 禁止把多个组件写在一个目录
❌ 禁止省略 `stories` 文件

---

## 三、组件命名规范

### 1️⃣ 组件名

- 使用 **PascalCase**
- 与目录名一致

```ts
Button;
Modal;
FormItem;
```

---

### 2️⃣ Storybook 标题命名

```ts
title: "Components/Button";
title: "Components/Form/Input";
```

✅ 用 `/` 表示层级
❌ 不要用中文标题

---

## 四、Props 设计规范（非常重要）

### 1️⃣ Props 必须有类型 + 注释

```ts
/**
 * Button 组件属性
 */
export interface ButtonProps {
  /**
   * 按钮类型
   * @default "default"
   */
  type?: "default" | "primary";

  /**
   * 是否禁用
   */
  disabled?: boolean;
}
```

> Storybook Docs 会自动生成 Props 表格

---

### 2️⃣ Props 设计原则

- ✅ 少而清晰
- ✅ 有默认值
- ❌ 不暴露内部实现细节
- ❌ 不随意加 boolean（如 `isBlue`）

---

## 五、样式规范

### 1️⃣ 样式方案

- 统一使用 **CSS Modules + SCSS**
- 文件名：`ComponentName.module.scss`

---

### 2️⃣ 样式隔离原则

```scss
.button {
  // 组件根节点样式
}
```

- ❌ 不允许全局样式污染
- ❌ 不直接修改 `body / html`

---

## 六、Storybook 规范（强制）

### 1️⃣ 每个组件必须有 Story

```ts
tags: ["autodocs"];
```

必须开启自动文档。

---

### 2️⃣ Story 命名规范

```ts
export const Default;
export const Primary;
export const Disabled;
```

❌ 禁止：

```ts
export const Test;
export const Demo;
```

---

### 3️⃣ Story 职责

- 用于 **展示组件能力**
- 用于 **给 PM / 设计看**
- 用于 **调试 Props**

❌ 不写业务逻辑
❌ 不写复杂状态管理

---

## 七、组件导出规范

### 1️⃣ 单组件出口

```ts
// components/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./types";
```

---

### 2️⃣ 组件库统一出口

```ts
// src/index.ts
export * from "./components/Button";
export * from "./components/Input";
```

❌ 禁止深路径引用：

```ts
import Button from "ui/src/components/Button"; // ❌
```

---

## 八、开发流程规范

### 新增一个组件的标准流程

1️⃣ 新建组件目录
2️⃣ 编写组件 + 类型
3️⃣ 编写 `.stories.tsx`
4️⃣ 在 Storybook 中验证
5️⃣ 确认 Docs 页面可读

---

## 九、禁止事项（踩坑总结）

❌ 不写 Story
❌ 不写类型注释
❌ 不直接在业务里改组件
❌ 不为某个业务写“特例 Props”

---

## 十、推荐实践（非强制）

- Props 保持向后兼容
- 组件职责单一
- 能组合，不要继承
- Storybook 作为唯一组件文档

---

## 十一、FAQ

### Q：组件改动影响业务怎么办？

- 遵循语义化改动
- 尽量保持 Props 向后兼容
- 大改动需同步更新 Storybook Docs

---

## 十二、结语

> **组件库的价值不在数量，而在规范。**
> Storybook 是我们的组件说明书，也是协作工具。
