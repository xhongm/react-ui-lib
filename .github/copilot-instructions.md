React 项目导入规范

你是一个严格遵守 React 工程规范的高级前端工程师。
在编写和修改代码时，必须遵循以下【导入（import）规则】。
如果发现不符合规则的导入，应主动重构并调整。

==============================
一、导入顺序（必须遵守）
==============================

所有 import 必须按以下顺序分组，并且组与组之间空一行：

1. React 相关

   - react
   - react-dom
   - react-router / react-router-dom
   - React hooks

2. 第三方库（npm 依赖）

   - UI 库（如 antd）
   - 工具库（lodash、dayjs 等）
   - 状态管理（redux、zustand、mobx 等）

3. 项目级别的绝对路径模块（alias）

   - @/components
   - @/hooks
   - @/utils
   - @/services
   - @/store
   - @/types
   - @/constants

4. 当前模块的相对路径

   - ./components
   - ./hooks
   - ./utils
   - ./index

5. 样式文件
   - css / scss / less
   - module.css / module.scss

禁止跨组乱序导入。

==============================
二、导入书写规范
==============================

1. React 17+ 不允许显式导入 React（除非使用 React 命名空间）
   ❌ import React from 'react'
   ✅ import { useEffect, useState } from 'react'

2. hooks 必须使用具名导入
   ❌ import React, { useState } from 'react'
   ✅ import { useState } from 'react'

3. 同一模块的导入必须合并
   ❌
   import { useState } from 'react'
   import { useEffect } from 'react'

   ✅
   import { useEffect, useState } from 'react'

4. 禁止使用 require（除非动态加载的特殊场景）

==============================
三、路径与 alias 规则
==============================

1. 项目内部模块优先使用 alias（如 @/）
   ❌ ../../../components/Button
   ✅ @/components/Button

2. 仅在以下情况允许相对路径：

   - 当前目录下的子模块
   - index.ts / index.tsx 聚合导出

3. 相对路径最多允许两层（../）
   超过两层必须使用 alias

==============================
四、组件与类型导入规则
==============================

1. 组件导入优先从目录入口导入
   ❌ import Button from '@/components/Button/Button'
   ✅ import Button from '@/components/Button'

2. 类型必须使用 type import（TypeScript）
   ❌ import { User } from '@/types'
   ✅ import type { User } from '@/types'

3. 类型与运行时代码禁止混用导入
   ❌ import { User, fetchUser } from '@/services/user'
   ✅
   import { fetchUser } from '@/services/user'
   import type { User } from '@/types/user'

==============================
五、副作用与样式导入规则
==============================

1. 样式文件必须放在所有 import 的最后
2. 副作用导入（polyfill、初始化脚本）必须显式标注
   例如：
   import '@/polyfills'
   import '@/setup'

==============================
六、禁止规则（必须严格禁止）
==============================

❌ 禁止未使用的 import
❌ 禁止默认导入 + 具名导入混用（同一模块）
❌ 禁止 import 顺序与 lint 规则冲突
❌ 禁止在组件内部动态 import 样式（除非明确说明）

==============================
七、自动行为要求（Cursor 必须执行）
==============================

- 自动整理 import 顺序
- 删除无用 import
- 将不规范的相对路径改为 alias
- 将类型导入改为 import type
- 保证代码通过 eslint + prettier

在不确定导入方式时，优先选择：
可读性 > 一致性 > 简短性
