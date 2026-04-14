import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'

import ImageEditor from './ImageEditor'
import type { ImageEditorRef, CropRect, AspectRatio } from './types'

const meta = {
    title: 'Components/ImageEditor',
    component: ImageEditor,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'ImageEditor 是一个功能丰富的图像编辑组件，支持裁剪、涂抹、擦除等功能。\n\n' +
                    '**新功能特性：**\n' +
                    '- 🎯 **比例约束**：支持自由裁剪、1:1、4:3、16:9 等多种固定比例\n' +
                    '- 🔍 **视口模式**：大画布上图片适应容器，支持滚轮缩放和平移\n' +
                    '- 👁️ **裁剪框常显**：所有模式下裁剪框都可见可调整，便于同时编辑\n' +
                    '- 🎨 **坐标系统**：视口模式下自动处理坐标转换，保证精确编辑'
            }
        }
    }
} satisfies Meta<typeof ImageEditor>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 默认裁剪模式
 */
export const Default: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'crop',
        brushSize: 20
    }
}

/**
 * 涂抹模式 - 绘制白色笔迹
 */
export const PaintMode: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'paint',
        brushSize: 15
    },
    parameters: {
        docs: {
            description: {
                story: '在画布上涂抹白色笔迹，用于标记或突出显示内容。'
            }
        }
    }
}

/**
 * 擦除模式 - 清除蒙版
 */
export const EraseMode: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'erase',
        brushSize: 25
    },
    parameters: {
        docs: {
            description: {
                story: '擦除之前涂抹的内容，恢复原始图像。'
            }
        }
    }
}

/**
 * 自定义笔刷大小
 */
export const CustomBrushSize: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'paint',
        brushSize: 40
    },
    parameters: {
        docs: {
            description: {
                story: '演示不同的笔刷大小（40px），用于精细或粗糙的笔迹。'
            }
        }
    }
}

/**
 * 自定义裁剪区域
 */
export const CustomCropRect: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'crop',
        cropRect: {
            x: 100,
            y: 80,
            width: 300,
            height: 250
        }
    },
    parameters: {
        docs: {
            description: {
                story: '使用自定义的初始裁剪区域。可通过拖拽调整。'
            }
        }
    }
}

/**
 * 固定比例裁剪 - 1:1 正方形
 */
export const AspectRatio1x1: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'crop',
        aspectRatio: '1:1'
    },
    parameters: {
        docs: {
            description: {
                story: '裁剪框保持 1:1 正方形比例，拖动时自动约束。'
            }
        }
    }
}

/**
 * 固定比例裁剪 - 16:9 宽屏
 */
export const AspectRatio16x9: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'crop',
        aspectRatio: '16:9'
    },
    parameters: {
        docs: {
            description: {
                story: '裁剪框保持 16:9 宽屏比例，适合视频裁剪。'
            }
        }
    }
}

/**
 * 固定比例裁剪 - 4:3 标准
 */
export const AspectRatio4x3: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'crop',
        aspectRatio: '4:3'
    },
    parameters: {
        docs: {
            description: {
                story: '裁剪框保持 4:3 标准比例，常用于传统照片。'
            }
        }
    }
}

/**
 * 视口模式 - 大画布缩放
 */
export const ViewportMode: Story = {
    render: (args) => {
        return (
            <div style={{ width: '800px', height: '600px', border: '2px solid #ddd', borderRadius: '8px' }}>
                <ImageEditor {...args} />
            </div>
        )
    },
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800',
        mode: 'paint',
        useViewport: true,
        brushSize: 30
    },
    parameters: {
        docs: {
            description: {
                story: '视口模式：图片适应容器大小，支持滚轮缩放和 Shift+拖拽平移画布。'
            }
        }
    }
}

/**
 * 视口模式 + 固定比例
 */
export const ViewportWithAspectRatio: Story = {
    render: (args) => {
        return (
            <div style={{ width: '800px', height: '600px', border: '2px solid #ddd', borderRadius: '8px' }}>
                <ImageEditor {...args} />
            </div>
        )
    },
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800',
        mode: 'crop',
        useViewport: true,
        aspectRatio: '16:9'
    },
    parameters: {
        docs: {
            description: {
                story: '结合视口模式和固定比例裁剪，适合处理大图片。'
            }
        }
    }
}

/**
 * 涂抹模式下裁剪框可见
 */
export const PaintModeWithCropBox: Story = {
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400',
        mode: 'paint',
        brushSize: 20,
        aspectRatio: '4:3',
        cropRect: {
            x: 100,
            y: 80,
            width: 400,
            height: 300
        }
    },
    parameters: {
        docs: {
            description: {
                story: '在涂抹模式下，裁剪框依然可见并可调整，方便同时编辑蒙版和裁剪区域。'
            }
        }
    }
}

/**
 * 交互式演示 - 完整功能测试
 */
export const Interactive: Story = {
    render: (args) => {
        const editorRef = useRef<ImageEditorRef>(null)
        const [mode, setMode] = useState<'crop' | 'paint' | 'erase'>('crop')
        const [brushSize, setBrushSize] = useState(20)
        const [aspectRatio, setAspectRatio] = useState<AspectRatio>('free')
        const [useViewport, setUseViewport] = useState(false)
        const [cropInfo, setCropInfo] = useState<CropRect>({
            x: 50,
            y: 50,
            width: 200,
            height: 200
        })
        const [exportedImage, setExportedImage] = useState<string>('')

        const handleExportImage = async () => {
            const blob = await editorRef.current?.exportImage()
            if (blob) {
                const url = URL.createObjectURL(blob)
                setExportedImage(url)
            }
        }

        const handleExportCroppedImage = async () => {
            const blob = await editorRef.current?.exportCroppedImage()
            if (blob) {
                const url = URL.createObjectURL(blob)
                setExportedImage(url)
            }
        }

        const handleReset = () => {
            editorRef.current?.reset()
            setExportedImage('')
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 控制面板 */}
                <div
                    style={{
                        padding: '16px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}
                >
                    <div>
                        <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
                            编辑模式：
                        </label>
                        <select title='请选择模式' value={mode} onChange={(e) => setMode(e.target.value as any)}>
                            <option value="crop">裁剪</option>
                            <option value="paint">涂抹</option>
                            <option value="erase">擦除</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
                            裁剪比例：
                        </label>
                        <select title='请选择裁剪比例' value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}>
                            <option value="free">自由裁剪</option>
                            <option value="1:1">1:1 正方形</option>
                            <option value="4:3">4:3 标准</option>
                            <option value="3:4">3:4 竖版</option>
                            <option value="16:9">16:9 宽屏</option>
                            <option value="9:16">9:16 竖屏</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
                            <input
                                type="checkbox"
                                checked={useViewport}
                                onChange={(e) => setUseViewport(e.target.checked)}
                                style={{ marginRight: '4px' }}
                            />
                            视口模式（支持缩放和平移）
                        </label>
                    </div>

                    <div>
                        <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
                            笔刷大小：{brushSize}px
                        </label>
                        <input
                            title='请选择笔刷大小'
                            type="range"
                            min="5"
                            max="50"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            style={{ width: '200px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleExportImage}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            导出裁剪 + 蒙版
                        </button>
                        <button
                            onClick={handleExportCroppedImage}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#52c41a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            导出仅裁剪
                        </button>
                        <button
                            onClick={handleReset}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff4d4f',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            重置
                        </button>
                    </div>

                    <div style={{ fontSize: '12px', color: '#666' }}>
                        裁剪区域: x={cropInfo.x.toFixed(0)}, y={cropInfo.y.toFixed(0)}, w={cropInfo.width.toFixed(0)}, h=
                        {cropInfo.height.toFixed(0)}
                    </div>

                    {useViewport && (
                        <div style={{ fontSize: '12px', color: '#1890ff', backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '4px' }}>
                            💡 提示：滚轮缩放画布，Shift+拖拽平移画布
                        </div>
                    )}
                </div>

                {/* 编辑器 */}
                <div style={useViewport ? { width: '800px', height: '600px', border: '2px solid #ddd', borderRadius: '8px' } : {}}>
                    <ImageEditor
                        {...args}
                        ref={editorRef}
                        mode={mode}
                        brushSize={brushSize}
                        aspectRatio={aspectRatio}
                        useViewport={useViewport}
                        onCropChange={setCropInfo}
                    />
                </div>

                {/* 导出预览 */}
                {exportedImage && (
                    <div>
                        <h3>导出预览：</h3>
                        <img
                            src={exportedImage}
                            alt="导出结果"
                            style={{
                                maxWidth: '300px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                )}
            </div>
        )
    },
    args: {
        image:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400'
    },
    parameters: {
        docs: {
            description: {
                story:
                    '完整的交互式演示，包含模式切换、比例选择、视口模式、笔刷调整、导出功能和重置操作。'
            }
        }
    }
}
