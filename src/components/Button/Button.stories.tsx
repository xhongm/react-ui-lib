// src/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'], // 自动生成 Docs
    argTypes: {
        type: {
            control: 'select',
            options: ['default', 'primary', 'danger']
        },
        onClick: {
            action: 'clicked'
        }
    }
}

export default meta
type Story = StoryObj<typeof Button>

/** 默认按钮 */
export const Default: Story = {
    args: {
        children: '默认按钮'
    }
}

/** 主要按钮 */
export const Primary: Story = {
    args: {
        type: 'primary',
        children: '主要按钮'
    }
}

/** 危险按钮 */
export const Danger: Story = {
    args: {
        type: 'danger',
        children: '危险按钮'
    }
}

/** 禁用状态 */
export const Disabled: Story = {
    args: {
        disabled: true,
        children: '禁用按钮'
    }
}