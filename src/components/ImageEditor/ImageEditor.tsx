import {
    useRef,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import type { ImageEditorProps, CropRect, ResizeDirection, AspectRatio } from "./types";
import "./ImageEditor.scss";

function ImageEditor({
    imageEditorRef,
    image,
    cropRect,
    mode = "crop",
    brushSize = 20,
    brushOpacity = 0.3,
    aspectRatio = "free",
    useViewport = false,
    onCropChange,
    onMaskChange
}: ImageEditorProps) {
        const containerRef = useRef<HTMLDivElement>(null);
        const imageCanvasRef = useRef<HTMLCanvasElement>(null);
        const displayCanvasRef = useRef<HTMLCanvasElement>(null); // 显示层
        const realMaskCanvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas")); // 保存已完成笔画
        const strokeCanvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas")); // 当前笔画

        const [img, setImg] = useState<HTMLImageElement | null>(null);
        const [crop, setCrop] = useState<CropRect>(cropRect || { x: 0, y: 0, width: 0, height: 0 });

        // 视口相关状态
        const [scale, setScale] = useState(1);
        const [offset, setOffset] = useState({ x: 0, y: 0 });
        const isPanning = useRef(false);
        const panStart = useRef({ x: 0, y: 0 });

        const MIN_SIZE = 40;
        const resizeDir = useRef<ResizeDirection | null>(null);
        const startPoint = useRef({ x: 0, y: 0 });
        const startCrop = useRef<CropRect | null>(null);

        const isDrawing = useRef(false);
        const lastPoint = useRef<{ x: number; y: number } | null>(null);
        const pendingPoint = useRef<{ x: number; y: number } | null>(null);
        const rafId = useRef<number | null>(null);

        /* ---------- 加载图片 ---------- */
        useEffect(() => {
            const imageEl = typeof image === "string" ? new Image() : image;

            if (typeof image === "string") {
                imageEl.crossOrigin = "anonymous"; // 防止 canvas taint
                imageEl.src = image;
            }

            imageEl.onload = () => {
                setImg(imageEl);
                initCanvas(imageEl);
            };
        }, [image, useViewport]);

        /* ---------- 监听裁剪框变化，更新显示 ---------- */
        useEffect(() => {
            if (img && crop.width > 0 && crop.height > 0) {
                drawPreview();
            }
        }, [crop, img, scale, offset]);

        const initCanvas = (imageEl: HTMLImageElement) => {
            const w = imageEl.width;
            const h = imageEl.height;

            // 原图 canvas
            const imgCanvas = imageCanvasRef.current!;
            imgCanvas.width = w;
            imgCanvas.height = h;
            imgCanvas.getContext("2d")!.drawImage(imageEl, 0, 0);

            // 显示 canvas
            const displayCanvas = displayCanvasRef.current!;

            if (useViewport && containerRef.current) {
                // 视口模式：画布大小等于容器大小
                const containerRect = containerRef.current.getBoundingClientRect();
                displayCanvas.width = containerRect.width;
                displayCanvas.height = containerRect.height;

                // 计算图片适应容器的缩放
                const scaleX = containerRect.width / w;
                const scaleY = containerRect.height / h;
                const fitScale = Math.min(scaleX, scaleY, 1); // 不超过原图大小
                setScale(fitScale);

                // 居中显示
                const offsetX = (containerRect.width - w * fitScale) / 2;
                const offsetY = (containerRect.height - h * fitScale) / 2;
                setOffset({ x: offsetX, y: offsetY });
            } else {
                // 原始模式：画布大小等于图片大小
                displayCanvas.width = w;
                displayCanvas.height = h;
                setScale(1);
                setOffset({ x: 0, y: 0 });
            }

            // strokeCanvas
            strokeCanvasRef.current.width = w;
            strokeCanvasRef.current.height = h;

            // realMaskCanvas
            realMaskCanvasRef.current.width = w;
            realMaskCanvasRef.current.height = h;

            // 设置裁剪框为图片大小
            if (!cropRect) {
                setCrop({ x: 0, y: 0, width: w, height: h });
            }
        };

        const setupBrushContext = (ctx: CanvasRenderingContext2D, isStroke = false) => {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = brushSize;

            if (mode === "erase") {
                ctx.globalCompositeOperation = "source-over"; // 画路径本身
                ctx.strokeStyle = "rgba(0,0,0,1)"; // 不透明，擦除用
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = `rgba(255,0,0,1)`;
            }

            ctx.fillStyle = ctx.strokeStyle;
            ctx.globalAlpha = 1;
        };

        /* ---------- 获取比例值 ---------- */
        const getAspectRatioValue = (ratio: AspectRatio): number | null => {
            switch (ratio) {
                case "1:1": return 1;
                case "4:3": return 4 / 3;
                case "3:4": return 3 / 4;
                case "16:9": return 16 / 9;
                case "9:16": return 9 / 16;
                case "free": return null;
                default: return null;
            }
        };

        /* ---------- 坐标转换 ---------- */
        const canvasToImage = (x: number, y: number) => {
            if (!useViewport) return { x, y };
            return {
                x: (x - offset.x) / scale,
                y: (y - offset.y) / scale
            };
        };

        const imageToCanvas = (x: number, y: number) => {
            if (!useViewport) return { x, y };
            return {
                x: x * scale + offset.x,
                y: y * scale + offset.y
            };
        };

        /* ---------- 绘制逻辑 ---------- */
        const handleMouseDown = (e: React.MouseEvent) => {
            // 空格键 + 鼠标按下 = 平移
            if (useViewport && e.shiftKey) {
                isPanning.current = true;
                panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
                return;
            }

            if (mode !== "paint" && mode !== "erase") return;
            isDrawing.current = true;

            const rect = displayCanvasRef.current!.getBoundingClientRect();
            const canvasPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const imagePoint = canvasToImage(canvasPoint.x, canvasPoint.y);

            lastPoint.current = imagePoint;

            drawStrokePoint(imagePoint); // 单点处理
        };

        const handleMouseMove = (e: React.MouseEvent) => {
            // 处理平移
            if (isPanning.current) {
                setOffset({
                    x: e.clientX - panStart.current.x,
                    y: e.clientY - panStart.current.y
                });
                return;
            }

            if (!isDrawing.current || !lastPoint.current) return;

            const rect = displayCanvasRef.current!.getBoundingClientRect();
            const canvasPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            const imagePoint = canvasToImage(canvasPoint.x, canvasPoint.y);
            pendingPoint.current = imagePoint;

            if (rafId.current === null) {
                rafId.current = requestAnimationFrame(drawFrame);
            }
        };
        const handleMouseUp = () => {
            // 结束平移
            if (isPanning.current) {
                isPanning.current = false;
                return;
            }

            if (!isDrawing.current) return;
            isDrawing.current = false;

            const realCtx = realMaskCanvasRef.current.getContext("2d")!;
            const strokeCtx = strokeCanvasRef.current.getContext("2d")!;

            if (mode === "paint") {
                realCtx.globalCompositeOperation = "source-over";
                realCtx.globalAlpha = brushOpacity;
                realCtx.drawImage(strokeCanvasRef.current, 0, 0);
            } else if (mode === "erase") {
                realCtx.globalCompositeOperation = "destination-out";
                realCtx.globalAlpha = 1;
                realCtx.drawImage(strokeCanvasRef.current, 0, 0);
            }

            // 清空 strokeCanvas
            strokeCtx.clearRect(0, 0, strokeCanvasRef.current.width, strokeCanvasRef.current.height);

            lastPoint.current = null;
            pendingPoint.current = null;
            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = null;

            drawPreview();
            onMaskChange?.();
        };

        /* ---------- 滚轮缩放 ---------- */
        const handleWheel = (e: React.WheelEvent) => {
            if (!useViewport) return;
            e.preventDefault();

            const rect = displayCanvasRef.current!.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(0.1, Math.min(5, scale * delta));

            // 以鼠标为中心缩放
            const imagePoint = canvasToImage(mouseX, mouseY);
            const newOffset = {
                x: mouseX - imagePoint.x * newScale,
                y: mouseY - imagePoint.y * newScale
            };

            setScale(newScale);
            setOffset(newOffset);
        };

        const drawStrokePoint = (point: { x: number; y: number }) => {
            const ctx = strokeCanvasRef.current!.getContext("2d")!;
            setupBrushContext(ctx, true);
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x + 0.01, point.y + 0.01);
            ctx.stroke();
            drawPreview();
        };

        const drawFrame = () => {
            if (!lastPoint.current || !pendingPoint.current) {
                rafId.current = null;
                return;
            }
            const ctx = strokeCanvasRef.current!.getContext("2d")!;
            setupBrushContext(ctx, true);
            ctx.beginPath();
            ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
            ctx.lineTo(pendingPoint.current.x, pendingPoint.current.y);
            ctx.stroke();

            lastPoint.current = pendingPoint.current;
            pendingPoint.current = null;

            drawPreview();
            rafId.current = requestAnimationFrame(drawFrame);
        };

        const drawPreview = () => {
            const ctx = displayCanvasRef.current!.getContext("2d")!;
            ctx.clearRect(0, 0, displayCanvasRef.current!.width, displayCanvasRef.current!.height);

            if (useViewport) {
                // 视口模式：绘制变换后的图片
                ctx.save();
                ctx.translate(offset.x, offset.y);
                ctx.scale(scale, scale);

                // 绘制原图
                ctx.drawImage(imageCanvasRef.current!, 0, 0);

                // 显示已完成笔画
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
                ctx.drawImage(realMaskCanvasRef.current, 0, 0);

                // 显示当前笔画
                if (isDrawing.current) {
                    if (mode === "paint") {
                        ctx.globalCompositeOperation = "source-over";
                        ctx.globalAlpha = brushOpacity;
                    } else if (mode === "erase") {
                        ctx.globalCompositeOperation = "destination-out";
                        ctx.globalAlpha = 1;
                    }
                    ctx.drawImage(strokeCanvasRef.current, 0, 0);
                }

                ctx.restore();

                // 绘制黑色半透明遮罩（裁剪框外）
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

                const canvasCrop = {
                    x: crop.x * scale + offset.x,
                    y: crop.y * scale + offset.y,
                    width: crop.width * scale,
                    height: crop.height * scale
                };

                // 左边
                if (canvasCrop.x > 0) {
                    ctx.fillRect(0, 0, canvasCrop.x, displayCanvasRef.current!.height);
                }
                // 右边
                if (canvasCrop.x + canvasCrop.width < displayCanvasRef.current!.width) {
                    ctx.fillRect(canvasCrop.x + canvasCrop.width, 0, displayCanvasRef.current!.width - canvasCrop.x - canvasCrop.width, displayCanvasRef.current!.height);
                }
                // 上边
                if (canvasCrop.y > 0) {
                    ctx.fillRect(canvasCrop.x, 0, canvasCrop.width, canvasCrop.y);
                }
                // 下边
                if (canvasCrop.y + canvasCrop.height < displayCanvasRef.current!.height) {
                    ctx.fillRect(canvasCrop.x, canvasCrop.y + canvasCrop.height, canvasCrop.width, displayCanvasRef.current!.height - canvasCrop.y - canvasCrop.height);
                }
            } else {
                // 原始模式
                // 先绘制原图
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
                ctx.drawImage(imageCanvasRef.current!, 0, 0);

                // 显示已完成笔画
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;
                ctx.drawImage(realMaskCanvasRef.current, 0, 0);

                // 显示当前笔画
                if (isDrawing.current) {
                    if (mode === "paint") {
                        ctx.globalCompositeOperation = "source-over";
                        ctx.globalAlpha = brushOpacity;
                    } else if (mode === "erase") {
                        ctx.globalCompositeOperation = "destination-out";
                        ctx.globalAlpha = 1;
                    }
                    ctx.drawImage(strokeCanvasRef.current, 0, 0);
                }

                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1;

                // 绘制黑色半透明遮罩（裁剪框外）
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                // 左边
                if (crop.x > 0) {
                    ctx.fillRect(0, 0, crop.x, displayCanvasRef.current!.height);
                }
                // 右边
                if (crop.x + crop.width < displayCanvasRef.current!.width) {
                    ctx.fillRect(crop.x + crop.width, 0, displayCanvasRef.current!.width - crop.x - crop.width, displayCanvasRef.current!.height);
                }
                // 上边
                if (crop.y > 0) {
                    ctx.fillRect(crop.x, 0, crop.width, crop.y);
                }
                // 下边
                if (crop.y + crop.height < displayCanvasRef.current!.height) {
                    ctx.fillRect(crop.x, crop.y + crop.height, crop.width, displayCanvasRef.current!.height - crop.y - crop.height);
                }
            }
        };

        /* ---------- 导出 ---------- */
        useImperativeHandle(imageEditorRef, () => ({
            async exportImage() {
                const out = document.createElement("canvas");
                out.width = crop.width;
                out.height = crop.height;
                const ctx = out.getContext("2d")!;

                ctx.drawImage(
                    imageCanvasRef.current!,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                ctx.globalCompositeOperation = "destination-in";
                ctx.drawImage(
                    realMaskCanvasRef.current!,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                return new Promise((res) => out.toBlob((b) => res(b!), "image/png"));
            },

            async exportCroppedImage() {
                const out = document.createElement("canvas");
                out.width = crop.width;
                out.height = crop.height;
                out.getContext("2d")!.drawImage(
                    imageCanvasRef.current!,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                return new Promise((res) => out.toBlob((b) => res(b!), "image/png"));
            },

            async exportMask() {
                return new Promise((res) =>
                    realMaskCanvasRef.current.toBlob((b) => res(b!), "image/png")
                );
            },

            reset() {
                initCanvas(img!);
            }
        }));

        /* ---------- 裁剪框拖拽 ---------- */
        const onCropMouseDown = (e: React.MouseEvent, dir: ResizeDirection) => {
            e.stopPropagation();
            resizeDir.current = dir;

            const rect = displayCanvasRef.current!.getBoundingClientRect();
            startPoint.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            startCrop.current = { ...crop };

            document.addEventListener("mousemove", onCropMouseMove);
            document.addEventListener("mouseup", onCropMouseUp);
        };

        const onCropMouseMove = (e: MouseEvent) => {
            if (!resizeDir.current || !startCrop.current) return;

            const rect = displayCanvasRef.current!.getBoundingClientRect();
            const currentPoint = { x: e.clientX - rect.left, y: e.clientY - rect.top };

            // 计算画布坐标的偏移量
            let dx = currentPoint.x - startPoint.current.x;
            let dy = currentPoint.y - startPoint.current.y;

            // 如果是视口模式，需要将画布偏移量转换为图片坐标偏移量
            if (useViewport) {
                dx = dx / scale;
                dy = dy / scale;
            }

            const imgW = imageCanvasRef.current!.width;
            const imgH = imageCanvasRef.current!.height;

            let left = startCrop.current.x;
            let top = startCrop.current.y;
            let right = startCrop.current.x + startCrop.current.width;
            let bottom = startCrop.current.y + startCrop.current.height;

            const dir = resizeDir.current;
            const ratio = getAspectRatioValue(aspectRatio);

            if (dir === "move") {
                const width = right - left;
                const height = bottom - top;
                left = Math.min(Math.max(0, left + dx), imgW - width);
                top = Math.min(Math.max(0, top + dy), imgH - height);
                right = left + width;
                bottom = top + height;
            } else {
                // 调整边界
                if (dir.includes("e")) right = Math.min(imgW, Math.max(left + MIN_SIZE, right + dx));
                if (dir.includes("s")) bottom = Math.min(imgH, Math.max(top + MIN_SIZE, bottom + dy));
                if (dir.includes("w")) left = Math.max(0, Math.min(right - MIN_SIZE, left + dx));
                if (dir.includes("n")) top = Math.max(0, Math.min(bottom - MIN_SIZE, top + dy));

                // 应用比例约束
                if (ratio !== null) {
                    const width = right - left;
                    const height = bottom - top;

                    if (dir === "e" || dir === "w") {
                        // 横向调整，高度跟随
                        const newHeight = width / ratio;
                        if (top + newHeight <= imgH) {
                            bottom = top + newHeight;
                        } else {
                            bottom = imgH;
                            right = left + (bottom - top) * ratio;
                        }
                    } else if (dir === "n" || dir === "s") {
                        // 纵向调整，宽度跟随
                        const newWidth = height * ratio;
                        if (left + newWidth <= imgW) {
                            right = left + newWidth;
                        } else {
                            right = imgW;
                            bottom = top + (right - left) / ratio;
                        }
                    } else {
                        // 对角调整，保持比例
                        const currentRatio = width / height;
                        if (currentRatio > ratio) {
                            // 太宽了，调整宽度
                            const newWidth = height * ratio;
                            if (dir.includes("w")) {
                                left = right - newWidth;
                            } else {
                                right = left + newWidth;
                            }
                        } else {
                            // 太高了，调整高度
                            const newHeight = width / ratio;
                            if (dir.includes("n")) {
                                top = bottom - newHeight;
                            } else {
                                bottom = top + newHeight;
                            }
                        }
                    }
                }
            }

            setCrop({ x: left, y: top, width: right - left, height: bottom - top });
            onCropChange?.({ x: left, y: top, width: right - left, height: bottom - top });
        };

        const onCropMouseUp = () => {
            resizeDir.current = null;
            startCrop.current = null;
            document.removeEventListener("mousemove", onCropMouseMove);
            document.removeEventListener("mouseup", onCropMouseUp);
        };

        return (
            <div ref={containerRef} className="image-editor">
                <canvas ref={imageCanvasRef} className="image-editor__canvas" />
                <canvas
                    ref={displayCanvasRef}
                    className="image-editor__display-canvas"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onWheel={handleWheel}
                />

                {/* 裁剪框始终显示 */}
                <div
                    className="image-editor__crop-box"
                    style={
                        useViewport
                            ? {
                                  left: crop.x * scale + offset.x,
                                  top: crop.y * scale + offset.y,
                                  width: crop.width * scale,
                                  height: crop.height * scale
                              }
                            : {
                                  left: crop.x,
                                  top: crop.y,
                                  width: crop.width,
                                  height: crop.height
                              }
                    }
                    onMouseDown={(e) => onCropMouseDown(e, "move")}
                >
                    {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as ResizeDirection[]).map((dir) => (
                        <div
                            key={dir}
                            className={`image-editor__crop-handle image-editor__crop-handle--${dir}`}
                            onMouseDown={(e) => onCropMouseDown(e, dir)}
                        />
                    ))}
                </div>
            </div>
        );
}

ImageEditor.displayName = "ImageEditor";

export default ImageEditor;