import type { Ref } from "react";

/**
 * 图像编辑器工作模式
 * @example
 * mode="crop"  // 裁剪模式
 * mode="paint" // 涂抹模式
 * mode="erase" // 擦除模式
 */
export type Mode = "crop" | "paint" | "erase";

/**
 * 裁剪框比例
 */
export type AspectRatio = "free" | "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

/**
 * 裁剪矩形区域定义
 */
export interface CropRect {
  /** 左边距 */
  x: number;
  /** 上边距 */
  y: number;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

/**
 * ImageEditor 组件 Ref 方法
 */
export interface ImageEditorRef {
  /**
   * 导出裁剪 + 蒙版后的图像
   */
  exportImage(): Promise<Blob>;

  /**
   * 导出仅裁剪的图像（不含蒙版）
   */
  exportCroppedImage(): Promise<Blob>;

  /**
   * 导出蒙版图像
   */
  exportMask(): Promise<Blob>;

  /**
   * 重置编辑器
   */
  reset(): void;
}

/**
 * ImageEditor 组件属性
 */
export interface ImageEditorProps {
  /**
   * 暴露导出/重置等命令式 API 的 ref。
   * 请使用本属性而非 JSX 的 `ref=`：后者会在 React 19 开发模式下为元素安装 `element.ref` 的兼容 getter，
   * Storybook 等工具若仍访问 `element.ref` 会触发控制台弃用警告。
   */
  imageEditorRef?: Ref<ImageEditorRef>;

  /**
   * 图像源（URL 或 HTMLImageElement）
   */
  image: string | HTMLImageElement;

  /**
   * 初始裁剪区域
   * @default { x: 50, y: 50, width: 200, height: 200 }
   */
  cropRect?: CropRect;

  /**
   * 蒙版图像 URL
   */
  maskImage?: string;

  /**
   * 编辑模式
   * @default "crop"
   */
  mode?: Mode;

  /**
   * 笔刷大小（像素）
   * @default 20
   */
  brushSize?: number;

  /**
   * 笔刷透明度
   * @default 0.3
   */
  brushOpacity?: number;

  /**
   * 裁剪框比例
   * @default "free"
   */
  aspectRatio?: AspectRatio;

  /**
   * 是否使用视口模式（图片适应容器，支持缩放和拖拽）
   * @default false
   */
  useViewport?: boolean;

  /**
   * 裁剪区域变化回调
   */
  onCropChange?: (rect: CropRect) => void;

  /**
   * 蒙版变化回调
   */
  onMaskChange?: () => void;
}

export type ResizeDirection =
  | "move"
  | "n"
  | "s"
  | "e"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw";
