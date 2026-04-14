/** 单张图片的配置项 */
export interface ImageItem {
    url: string;
    alt?: string;
    placeholder?: string;
    isLoading?: boolean;
}

/** 滑块样式配置 */
export interface SliderStyleConfig {
    lineType?: "solid" | "dashed" | "dotted";
    lineColor?: string;
    lineWidth?: number;
    handleType?: "circle" | "arrow" | "custom";
    handleSize?: number;
    handleColor?: string;
    handleIcon?: string;
    handleShadow?: boolean;
    enableMask?: boolean;
    maskColor?: string;
}

/** 交互行为配置 */
export interface InteractionConfig {
    isDraggable?: boolean;
    isClickable?: boolean;
    isTouchable?: boolean;
    minPosition?: number;
    maxPosition?: number;
    animation?: {
        enable: boolean;
        duration: number;
        easing: string;
    };
}

/** 事件回调 */
export interface SliderEventHandlers {
    onDragStart?: (position: number) => void;
    onDragging?: (position: number) => void;
    onDragEnd?: (position: number) => void;
    onImageLoad?: (status: { before: boolean; after: boolean }) => void;
    onImageError?: (type: "before" | "after", error: Error) => void;
}

/** 容器尺寸配置 */
export interface ContainerConfig {
    width?: string | number;
    height?: string | number;
    fit?: "contain" | "cover" | "fill" | "none";
    isResponsive?: boolean;
}

/** 图片对比滑块组件核心接口 */
export interface ImageComparisonSliderProps {
    images: {
        before: ImageItem;
        after: ImageItem;
    };
    initialPosition?: number;
    sliderStyle?: SliderStyleConfig;
    interaction?: InteractionConfig;
    events?: SliderEventHandlers;
    container?: ContainerConfig;
}

/** 极简版入参（基础使用） */
export interface SimpleImageComparisonProps {
    beforeUrl: string;
    afterUrl: string;
    initialPosition?: number;
    onPositionChange?: (position: number) => void;
}
