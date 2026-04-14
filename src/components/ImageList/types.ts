import type { ReactNode } from "react";

/** 图片项数据类型 */
export interface ImageItem {
    id: string | number;
    url: string;
    name?: string;
    [key: string]: any;
}

/** 自定义列表项渲染函数的参数 */
export interface RenderItemParams {
    itemData: ImageItem;
    index: number;
    isSelected: boolean;
}

/** 操作按钮配置 */
export interface ActionButton {
    key: string;
    label: string;
    className?: string;
    onClick: (id: string | number) => void;
}

/** 组件Props类型 */
export interface ImageListProps {
    dataSource: ImageItem[];
    selectedId?: string | number;
    selectedIdList?: (string | number)[];
    onSelect?: (id: string | number) => void;
    onCheck?: (idList: (string | number)[], checked: boolean, id: string | number) => void;
    onDelete?: (id: string | number) => void;
    onDownload?: (id: string | number) => void;
    renderItem?: (params: RenderItemParams) => ReactNode;
    showCheckbox?: boolean;
    showActions?: boolean;
    customActions?: ActionButton[];
    columns?: number;
    gap?: number;
}
