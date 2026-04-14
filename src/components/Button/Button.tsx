// src/components/Button/Button.tsx
import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'
import type { ButtonProps } from './types'

/**
 * 通用按钮组件
 *
 * 用于页面中的主要和次要操作
 */
export const Button: React.FC<ButtonProps> = ({
    type = 'default',
    disabled = false,
    onClick,
    children
}) => {
    return (
        <button
            className={clsx(styles.button, styles[type])}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}