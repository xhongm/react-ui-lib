import { useState, useRef, useEffect, useCallback } from "react";
import type { ImageComparisonSliderProps } from "./types";
import "./ImageComparisonSlider.scss";

const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
    images,
    initialPosition = 0.5,
    sliderStyle = {},
    interaction = {},
    events = {},
    container = {}
}) => {
    const {
        lineType = "solid",
        lineColor = "#FFFFFF",
        lineWidth = 2,
        handleType = "circle",
        handleSize = 40,
        handleColor = "#FFFFFF",
        handleShadow = true,
        enableMask = false,
        maskColor = "rgba(0, 0, 0, 0.1)"
    } = sliderStyle;

    const {
        isDraggable = true,
        isClickable = true,
        isTouchable = true,
        minPosition = 0,
        maxPosition = 1,
        animation = { enable: true, duration: 300, easing: "ease-out" }
    } = interaction;

    const {
        width = "100%",
        height = "auto",
        fit = "contain",
        isResponsive = true
    } = container;

    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [imageLoadStatus, setImageLoadStatus] = useState({ before: false, after: false });

    const containerRef = useRef<HTMLDivElement>(null);
    const rafId = useRef<number | null>(null);

    // 图片加载处理
    const handleImageLoad = useCallback(
        (type: "before" | "after") => {
            setImageLoadStatus((prev) => {
                const newStatus = { ...prev, [type]: true };
                if (newStatus.before && newStatus.after) {
                    events.onImageLoad?.(newStatus);
                }
                return newStatus;
            });
        },
        [events]
    );

    const handleImageError = useCallback(
        (type: "before" | "after", error: Error) => {
            events.onImageError?.(type, error);
        },
        [events]
    );

    // 计算位置
    const calculatePosition = useCallback(
        (clientX: number) => {
            if (!containerRef.current) return position;
            const rect = containerRef.current.getBoundingClientRect();
            let newPosition = (clientX - rect.left) / rect.width;
            newPosition = Math.max(minPosition, Math.min(maxPosition, newPosition));
            return newPosition;
        },
        [position, minPosition, maxPosition]
    );

    // 拖拽开始
    const handleDragStart = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            if (!isDraggable) return;
            setIsDragging(true);
            events.onDragStart?.(position);
        },
        [isDraggable, position, events]
    );

    // 拖拽中
    const handleDrag = useCallback(
        (clientX: number) => {
            if (!isDragging) return;
            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => {
                const newPosition = calculatePosition(clientX);
                setPosition(newPosition);
                events.onDragging?.(newPosition);
            });
        },
        [isDragging, calculatePosition, events]
    );

    // 拖拽结束
    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        if (rafId.current) cancelAnimationFrame(rafId.current);
        events.onDragEnd?.(position);
    }, [isDragging, position, events]);

    // 监听鼠标/触摸事件
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => handleDrag(e.clientX);
        const handleTouchMove = (e: TouchEvent) => handleDrag(e.touches[0].clientX);

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleDragEnd);
            if (isTouchable) {
                document.addEventListener("touchmove", handleTouchMove);
                document.addEventListener("touchend", handleDragEnd);
            }
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleDragEnd);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleDragEnd);
        };
    }, [isDragging, handleDrag, handleDragEnd, isTouchable]);

    const containerStyle: React.CSSProperties = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        position: "relative",
        overflow: "hidden",
        userSelect: "none"
    };

    const imageStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        objectFit: fit,
        display: "block"
    };

    return (
        <div ref={containerRef} className="image-comparison-slider" style={containerStyle}>
            {/* Before 图片 */}
            <div className="image-comparison-slider__before" style={{ position: "absolute", inset: 0 }}>
                <img
                    src={images.before.url}
                    alt={images.before.alt || "Before"}
                    style={imageStyle}
                    onLoad={() => handleImageLoad("before")}
                    onError={(e) => handleImageError("before", new Error("Image load failed"))}
                />
            </div>

            {/* After 图片 */}
            <div
                className="image-comparison-slider__after"
                style={{
                    position: "absolute",
                    inset: 0,
                    clipPath: `inset(0 ${(1 - position) * 100}% 0 0)`
                }}
            >
                <img
                    src={images.after.url}
                    alt={images.after.alt || "After"}
                    style={imageStyle}
                    onLoad={() => handleImageLoad("after")}
                    onError={() => handleImageError("after", new Error("Image load failed"))}
                />
            </div>

            {/* 分割线和滑块 */}
            <div
                className="image-comparison-slider__divider"
                style={{
                    position: "absolute",
                    left: `${position * 100}%`,
                    top: 0,
                    bottom: 0,
                    width: `${lineWidth}px`,
                    backgroundColor: lineColor,
                    transform: "translateX(-50%)",
                    cursor: isDraggable ? "ew-resize" : "default",
                    transition: animation.enable && !isDragging ? `left ${animation.duration}ms ${animation.easing}` : "none"
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                {/* 拖拽按钮 */}
                <div
                    className={`image-comparison-slider__handle image-comparison-slider__handle--${handleType}`}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: `${handleSize}px`,
                        height: `${handleSize}px`,
                        backgroundColor: handleColor,
                        borderRadius: handleType === "circle" ? "50%" : "4px",
                        boxShadow: handleShadow ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                        cursor: isDraggable ? "ew-resize" : "default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {handleType === "arrow" && (
                        <div style={{ display: "flex", gap: "4px" }}>
                            <span style={{ fontSize: "16px" }}>◀</span>
                            <span style={{ fontSize: "16px" }}>▶</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageComparisonSlider;
