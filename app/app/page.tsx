'use client'

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Separator } from '@/components/ui/separator';
import Authenticate from '@/components/authenticate';
import { Button } from '@/components/ui/button';
import { removeBackground } from "@imgly/background-removal";
import { PlusIcon, ReloadIcon, DownloadIcon, UploadIcon } from '@radix-ui/react-icons';
import TextCustomizer from '@/components/editor/text-customizer';
import Image from 'next/image';
import { Accordion } from '@/components/ui/accordion';
import '@/app/fonts.css'
import { ModeToggle } from '@/components/mode-toggle';
import UploadPrompt from './_components/upload-prompt';
import { ActionPanels } from './_components/action-panels';

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

const Page = () => {
    const { user } = useUser();
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
    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bgImg = new (window as any).Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            // 计算缩放比例
            let width = bgImg.width;
            let height = bgImg.height;
            const ratio = Math.min(
                MAX_IMAGE_WIDTH / width,
                MAX_IMAGE_HEIGHT / height,
                1 // 如果图片本身较小，则不放大
            );

            // 设置 canvas 尺寸为缩放后的尺寸
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
            canvas.width = width;
            canvas.height = height;

            // 绘制背景
            ctx.drawImage(bgImg, 0, 0, width, height);

            // 绘制文本，使用相对尺寸
            textSets.forEach(textSet => {
                ctx.save();
                // 字体大小使用相对尺寸计算
                const scaledFontSize = (textSet.fontSize * width) / 1000; // 1000 是一个基准值，可以调整
                ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const x = width * (textSet.left + 50) / 100;
                const y = height * (50 - textSet.top) / 100;

                ctx.translate(x, y);
                ctx.rotate((textSet.rotation * Math.PI) / 180);
                ctx.fillText(textSet.text, 0, 0);
                ctx.restore();
            });

            // 绘制前景图
            if (removedBgImageUrl) {
                const removedBgImg = new (window as any).Image();
                removedBgImg.crossOrigin = "anonymous";
                removedBgImg.onload = () => {
                    ctx.drawImage(removedBgImg, 0, 0, width, height);
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
            link.download = STRINGS.downloadFileName;
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
            <div className='flex flex-row items-center justify-between p-5 px-5 md:px-10'>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png"
                />

                <Link href="/" className='text-lg font-semibold'>
                    {STRINGS.nav.title}
                </Link>

                <div className='flex flex-row gap-4 items-center'>
                    {user && (
                        <Avatar className='h-8 w-8'>
                            <AvatarImage src={user?.user_metadata.avatar_url} />
                        </Avatar>
                    )}

                    <ModeToggle />
                </div>
            </div>

            <Separator />

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

                        {/* <div className='flex flex-row justify-center gap-4'>
                            <Button
                                onClick={handleReupload}
                                variant={'outline'}
                                className='mb-8'
                                data-umami-event={STRINGS.analytics.reuploadImage.event}
                                data-umami-event-type={STRINGS.analytics.reuploadImage.type}
                            >
                                <UploadIcon className='mr-2' />
                                {STRINGS.buttons.reupload}
                            </Button>

                            <Button
                                onClick={saveCompositeImage}
                                variant={'outline'}
                                className='mb-8'
                                data-umami-event={STRINGS.analytics.saveImage.event}
                                data-umami-event-type={STRINGS.analytics.saveImage.type}
                                data-umami-event-text_count={textSets.length.toString()}
                            >
                                <DownloadIcon className='mr-2' />
                                {STRINGS.buttons.save}
                            </Button>
                        </div> */}

                        <ActionPanels onDownload={saveCompositeImage} />
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

export default Page;