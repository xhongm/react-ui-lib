import type { Meta, StoryObj } from "@storybook/react";
import ImageComparisonSlider from "./ImageComparisonSlider";

const meta: Meta<typeof ImageComparisonSlider> = {
    title: "Components/ImageComparisonSlider",
    component: ImageComparisonSlider,
    parameters: {
        layout: "centered"
    },
    tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ImageComparisonSlider>;

// 示例图片 URL
const beforeImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop";
const afterImage = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop";

export const Default: Story = {
    args: {
        images: {
            before: { url: beforeImage, alt: "原图" },
            after: { url: afterImage, alt: "处理后" }
        },
        initialPosition: 0.5,
        container: {
            width: 800,
            height: 600
        }
    }
};

export const WithArrowHandle: Story = {
    args: {
        images: {
            before: { url: beforeImage, alt: "原图" },
            after: { url: afterImage, alt: "处理后" }
        },
        initialPosition: 0.5,
        sliderStyle: {
            handleType: "arrow",
            handleSize: 50,
            handleColor: "#4CAF50",
            lineColor: "#4CAF50",
            lineWidth: 3
        },
        container: {
            width: 800,
            height: 600
        }
    }
};

export const WithCustomPosition: Story = {
    args: {
        images: {
            before: { url: beforeImage, alt: "原图" },
            after: { url: afterImage, alt: "处理后" }
        },
        initialPosition: 0.3,
        container: {
            width: 800,
            height: 600
        }
    }
};

export const WithEvents: Story = {
    args: {
        images: {
            before: { url: beforeImage, alt: "原图" },
            after: { url: afterImage, alt: "处理后" }
        },
        initialPosition: 0.5,
        events: {
            onDragStart: (position) => console.log("拖拽开始:", position),
            onDragging: (position) => console.log("拖拽中:", position),
            onDragEnd: (position) => console.log("拖拽结束:", position),
            onImageLoad: (status) => console.log("图片加载状态:", status)
        },
        container: {
            width: 800,
            height: 600
        }
    }
};
