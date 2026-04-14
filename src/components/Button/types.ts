// src/components/Button/types.ts

/**
 * Button 组件属性
 */
export interface ButtonProps {
  /**
   * 按钮类型
   * @default "default"
   */
  type?: "default" | "primary" | "danger";

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 点击事件
   */
  onClick?: () => void;

  /**
   * 按钮内容
   */
  children: React.ReactNode;
}
