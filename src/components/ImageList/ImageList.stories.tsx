import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import ImageList from "./ImageList";
import type { ImageItem } from "./types";

const meta: Meta<typeof ImageList> = {
    title: "Components/ImageList",
    component: ImageList,
    parameters: {
        layout: "padded"
    },
    tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof ImageList>;

// 示例数据
const mockData: ImageItem[] = [
    { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop", name: "山景1" },
    { id: 2, url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop", name: "自然风光" },
    { id: 3, url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop", name: "森林" },
    { id: 4, url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&h=300&fit=crop", name: "湖泊" },
    { id: 5, url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=300&fit=crop", name: "雪山" },
    { id: 6, url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop", name: "草原" }
];

export const Default: Story = {
    args: {
        dataSource: mockData,
        onDelete: (id) => console.log("删除:", id),
        onDownload: (id) => console.log("下载:", id)
    }
};

export const WithSelection: Story = {
    render: () => {
        const [selectedId, setSelectedId] = useState<string | number>();
        const [selectedIdList, setSelectedIdList] = useState<(string | number)[]>([]);

        return (
            <ImageList
                dataSource={mockData}
                selectedId={selectedId}
                selectedIdList={selectedIdList}
                onSelect={setSelectedId}
                onCheck={(idList) => setSelectedIdList(idList)}
                onDelete={(id) => console.log("删除:", id)}
                onDownload={(id) => console.log("下载:", id)}
            />
        );
    }
};

export const WithoutCheckbox: Story = {
    args: {
        dataSource: mockData,
        showCheckbox: false,
        onDelete: (id) => console.log("删除:", id),
        onDownload: (id) => console.log("下载:", id)
    }
};

export const WithoutActions: Story = {
    args: {
        dataSource: mockData,
        showActions: false
    }
};

export const CustomColumns: Story = {
    args: {
        dataSource: mockData,
        columns: 4,
        gap: 20,
        onDelete: (id) => console.log("删除:", id),
        onDownload: (id) => console.log("下载:", id)
    }
};

export const CustomActions: Story = {
    args: {
        dataSource: mockData,
        customActions: [
            {
                key: "edit",
                label: "编辑",
                className: "image-list__action-btn--download",
                onClick: (id) => console.log("编辑:", id)
            },
            {
                key: "share",
                label: "分享",
                className: "image-list__action-btn--download",
                onClick: (id) => console.log("分享:", id)
            }
        ]
    }
};

export const CustomRender: Story = {
    args: {
        dataSource: mockData,
        showActions: false,
        renderItem: ({ itemData, isSelected }) => (
            <div style={{ padding: "8px", textAlign: "center" }}>
                <img
                    src={itemData.url}
                    alt={itemData.name}
                    style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: isSelected ? "3px solid #2563eb" : "none"
                    }}
                />
                <div style={{ marginTop: "8px", fontWeight: "bold", color: isSelected ? "#2563eb" : "#374151" }}>{itemData.name}</div>
            </div>
        )
    }
};
