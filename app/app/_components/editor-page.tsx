'use client'

import '@/app/fonts.css'
import React, { useRef, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { removeBackground } from "@imgly/background-removal";
import { PlusIcon, ReloadIcon, DownloadIcon, UploadIcon } from '@radix-ui/react-icons';
import TextCustomizer from '@/components/editor/text-customizer';
import Image from 'next/image';
import { Accordion } from '@/components/ui/accordion';
import UploadPrompt from './upload-prompt';
import { ActionPanels } from './action-panels';

const STRINGS = {
    nav: {
        title: "Text Behind Image",
        upload: "How to use"
    },
    buttons: {
        reupload: "Reupload",
        save: "Save Image",
        addText: "Add Text",
        remove: "Remove",
        duplicate: "Duplicate"
    },
    loading: "Processing image...",
    defaultText: "OHHH!",
    downloadFileName: "text-behind-image.png",
    analytics: {
        uploadImage: {
            event: "Upload Image",
            type: "action"
        },
        reuploadImage: {
            event: "Reupload Image",
            type: "action"
        },
        saveImage: {
            event: "Save Image",
            type: "action"
        },
        addText: {
            event: "Add Text Layer",
            type: "action"
        },
        removeText: {
            event: "Remove Text Layer",
            type: "action"
        },
        duplicateText: {
            event: "Duplicate Text Layer",
            type: "action"
        }
    },
    defaults: {
        text: {
            fontFamily: 'Inter',
            color: '#FCB900',
            fontSize: 150,
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0
        }
    }
} as const;

interface EditorPageProps {
    user: any; // 用户信息
    subscription: any; // 订阅信息
    isProActive: boolean; // 是否激活
}

const EditorPage = ({ user, subscription, isProActive }: EditorPageProps) => {
    const { session } = useSessionContext();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 添加常量定义
    const MAX_IMAGE_WIDTH = 1600; // 设置最大宽度
    const MAX_IMAGE_HEIGHT = 1200; // 设置最大高度

    // 处理图片选择
    const handleImageSelect = async (imageUrl: string, removedBgUrl?: string) => {
        setSelectedImage(imageUrl);
        if (removedBgUrl) {
            // 如果是模板图片，直接使用预处理的无背景版本
            const response = await fetch(removedBgUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
        } else {
            // 如果是用户上传的图片，使用removeBackground处理
            await setupImage(imageUrl);
        }
    };

    // 处理上传图片
    const handleUploadImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 处理文件变化
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            await setupImage(imageUrl);
        }
    };

    // 保存 Blob 文件
    const saveBlob = (blob: Blob, fileName: string) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // 处理图片，用removeBackground去除背景
    const setupImage = async (imageUrl: string) => {
        try {
            const imageBlob = await removeBackground(imageUrl);

            // 保存处理后的图片, 用于生成，上线时注释掉
            // saveBlob(imageBlob, 'processed-image.png');

            const url = URL.createObjectURL(imageBlob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
        } catch (error) {
            console.error(error);
        }
    };

    // 添加新的文本层
    const addNewTextSet = () => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: STRINGS.defaultText,
            fontFamily: STRINGS.defaults.text.fontFamily,
            top: 20,
            left: 0,
            color: STRINGS.defaults.text.color,
            fontSize: STRINGS.defaults.text.fontSize,
            fontWeight: STRINGS.defaults.text.fontWeight,
            opacity: STRINGS.defaults.text.opacity,
            shadowColor: STRINGS.defaults.text.shadowColor,
            shadowSize: STRINGS.defaults.text.shadowSize,
            rotation: STRINGS.defaults.text.rotation
        }]);
    };

    // 处理文本层属性变化
    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set =>
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    };

    // 复制文本层
    const duplicateTextSet = (textSet: any) => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    // 删除文本层
    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    // 保存合成图片
    const saveCompositeImage = (isHD: boolean = false) => {
        if (!canvasRef.current || !isImageSetupDone) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bgImg = new (window as any).Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            // 计算新的尺寸
            let newWidth = bgImg.width;
            let newHeight = bgImg.height;

            if (!isHD && newWidth > 800) {
                const ratio = 800 / newWidth;
                newWidth = 800;
                newHeight = bgImg.height * ratio;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // 绘制背景图片
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            textSets.forEach(textSet => {
                ctx.save(); // Save the current state
                ctx.font = `${textSet.fontWeight} ${textSet.fontSize * 3}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const x = canvas.width * (textSet.left + 50) / 100;
                const y = canvas.height * (50 - textSet.top) / 100;

                // Move the context to the text position and rotate
                ctx.translate(x, y);
                ctx.rotate((textSet.rotation * Math.PI) / 180); // Convert degrees to radians
                ctx.fillText(textSet.text, 0, 0); // Draw text at the origin (0, 0)
                ctx.restore(); // Restore the original state
            });

            if (removedBgImageUrl) {
                const removedBgImg = new (window as any).Image();
                removedBgImg.crossOrigin = "anonymous";
                removedBgImg.onload = () => {
                    ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
                    triggerDownload();
                };
                removedBgImg.src = removedBgImageUrl;
            } else {
                triggerDownload();
            }
        };
        bgImg.src = selectedImage || '';

        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'text-behind-image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    // 添加重置状态的函数
    const handleReupload = () => {
        setSelectedImage(null);
        setIsImageSetupDone(false);
        setRemovedBgImageUrl(null);
        setTextSets([]);
        handleUploadImage();
    };

    return (
        <div className='flex flex-col min-h-screen'>

            {selectedImage ? (
                <div className='flex flex-col md:flex-row items-start justify-start gap-10 w-full h-screen p-5 md:p-10'>
                    {/* 图片效果展示区 */}
                    <div className='flex flex-col w-full gap-4'>
                        <div className="min-h-[400px] w-full p-4 border rounded-lg relative overflow-hidden">
                            {isImageSetupDone ? (
                                <Image
                                    src={selectedImage}
                                    alt="Uploaded"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                />
                            ) : (
                                <span className='flex items-center w-full gap-2'><ReloadIcon className='animate-spin' /> {STRINGS.loading}</span>
                            )}
                            {isImageSetupDone && textSets.map(textSet => (
                                <div
                                    key={textSet.id}
                                    style={{
                                        position: 'absolute',
                                        top: `${50 - textSet.top}%`,
                                        left: `${textSet.left + 50}%`,
                                        transform: `translate(-50%, -50%) rotate(${textSet.rotation}deg)`,
                                        color: textSet.color,
                                        textAlign: 'center',
                                        fontSize: `${textSet.fontSize * 0.1}vw`,
                                        fontWeight: textSet.fontWeight,
                                        fontFamily: textSet.fontFamily,
                                        opacity: textSet.opacity,
                                        userSelect: 'none'
                                    }}
                                >
                                    {textSet.text}
                                </div>
                            ))}
                            {removedBgImageUrl && (
                                <Image
                                    src={removedBgImageUrl}
                                    alt="Removed bg"
                                    layout="fill"
                                    objectFit="contain"
                                    objectPosition="center"
                                    className="absolute top-0 left-0 w-full h-full"
                                />
                            )}
                        </div>

                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {/* 下载按钮面板 */}
                        <ActionPanels
                            onDownload={(isHD) => saveCompositeImage(isHD)}
                            isProActive={isProActive}
                        />
                    </div>

                    {/* 文本编辑区 */}
                    <div className='flex flex-col w-full'>
                        <Button
                            variant={'secondary'}
                            onClick={addNewTextSet}
                            data-umami-event={STRINGS.analytics.addText.event}
                            data-umami-event-type={STRINGS.analytics.addText.type}
                        >
                            <PlusIcon className='mr-2' />
                            {STRINGS.buttons.addText}
                        </Button>
                        <Accordion type="single" collapsible className="w-full mt-2">
                            {textSets.map(textSet => (
                                <TextCustomizer
                                    key={textSet.id}
                                    textSet={textSet}
                                    handleAttributeChange={handleAttributeChange}
                                    removeTextSet={removeTextSet}
                                    duplicateTextSet={duplicateTextSet}
                                />
                            ))}
                        </Accordion>
                    </div>
                </div>
            ) : (
                <UploadPrompt onImageSelect={handleImageSelect} />
            )}
        </div>
    );
}

export default EditorPage;