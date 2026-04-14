import { 
    type FC, 
    type MouseEvent, 
    type ChangeEvent, 
    useCallback 
} from "react";
import type { ImageListProps, RenderItemParams } from "./types";
import "./ImageList.scss";

const ImageList: FC<ImageListProps> = ({
    dataSource = [],
    selectedId,
    selectedIdList = [],
    onSelect,
    onCheck,
    onDelete,
    onDownload,
    renderItem,
    showCheckbox = true,
    showActions = true,
    customActions,
    columns,
    gap
}) => {
    // 单个图片项点击（单选）
    const handleItemClick = useCallback(
        (id: string | number) => {
            onSelect?.(id);
        },
        [onSelect]
    );

    // 复选框状态改变（多选）
    const handleCheckboxChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, id: string | number) => {
            const checked = e.target.checked;
            const newIdList = checked
                ? [...new Set([...selectedIdList, id])]
                : selectedIdList.filter((item) => item !== id);
            onCheck?.(newIdList, checked, id);
        },
        [selectedIdList, onCheck]
    );

    // 删除操作
    const handleDelete = useCallback(
        (e: MouseEvent<HTMLButtonElement>, id: string | number) => {
            e.stopPropagation();
            if (window.confirm("确认删除这张图片吗？")) {
                onDelete?.(id);
            }
        },
        [onDelete]
    );

    // 下载操作
    const handleDownload = useCallback(
        (e: MouseEvent<HTMLButtonElement>, id: string | number) => {
            e.stopPropagation();
            onDownload?.(id);
        },
        [onDownload]
    );

    // 默认列表项渲染
    const renderDefaultItem = useCallback(
        (params: RenderItemParams) => {
            const { itemData, index } = params;
            return (
                <div className="image-list__item-default">
                    <img
                        src={itemData.url}
                        alt={itemData.name || "图片"}
                        className="image-list__item-img"
                        onClick={() => handleItemClick(itemData.id)}
                    />
                    <div className="image-list__item-name">{itemData.name || `图片${index + 1}`}</div>
                </div>
            );
        },
        [handleItemClick]
    );

    // 渲染操作按钮
    const renderActions = useCallback(
        (id: string | number) => {
            if (!showActions) return null;

            if (customActions) {
                return (
                    <div className="image-list__item-actions">
                        {customActions.map((action) => (
                            <button
                                key={action.key}
                                type="button"
                                className={`image-list__action-btn ${action.className || ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(id);
                                }}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                );
            }

            return (
                <div className="image-list__item-actions">
                    {onDelete && (
                        <button type="button" className="image-list__action-btn image-list__action-btn--delete" onClick={(e) => handleDelete(e, id)}>
                            删除
                        </button>
                    )}
                    {onDownload && (
                        <button type="button" className="image-list__action-btn image-list__action-btn--download" onClick={(e) => handleDownload(e, id)}>
                            下载
                        </button>
                    )}
                </div>
            );
        },
        [showActions, customActions, onDelete, onDownload, handleDelete, handleDownload]
    );

    // 容器样式
    const containerStyle = {
        ...(columns && { gridTemplateColumns: `repeat(${columns}, 1fr)` }),
        ...(gap && { gap: `${gap}px` })
    };

    return (
        <div className="image-list-container">
            <div className="image-list" style={containerStyle}>
                {dataSource.map((item, index) => {
                    const isSelected = selectedId === item.id || selectedIdList.includes(item.id);

                    return (
                        <div key={item.id || index} className={`image-list__item ${isSelected ? "image-list__item--active" : ""}`}>
                            {showCheckbox && (
                                <input
                                    type="checkbox"
                                    className="image-list__checkbox"
                                    checked={selectedIdList.includes(item.id)}
                                    onChange={(e) => handleCheckboxChange(e, item.id)}
                                    aria-label={`选择 ${item.name || `图片${index + 1}`}`}
                                />
                            )}

                            {renderItem ? renderItem({ itemData: item, index, isSelected }) : renderDefaultItem({ itemData: item, index, isSelected })}

                            {renderActions(item.id)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

ImageList.displayName = "ImageList";

export default ImageList;
