'use client'

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRef } from 'react';

interface UploadPromptProps {
    onImageSelect: (imageUrl: string, removedBgUrl?: string) => void;
}

const STRINGS = {
    title: 'Start Creating',
    subtitle: 'Upload an image or choose a template to begin',
    uploadButton: 'Upload Image',
    templateSection: 'Or Choose a Template',
    useTemplate: 'Use This Template',
    templates: [
        {
            id: 1,
            name: 'template1',
            originalUrl: '/templates/template1.jpg',
            removedBgUrl: '/templates/template1-nobg.png'
        },
        {
            id: 2,
            name: 'template2',
            originalUrl: '/templates/template2.png',
            removedBgUrl: '/templates/template2-nobg.png'
        },
        {
            id: 3,
            name: 'template3',
            originalUrl: '/templates/template3.jpg',
            removedBgUrl: '/templates/template3-nobg.png'
        },
    ]
} as const;

const defaultTemplates = STRINGS.templates;

const UploadPrompt = ({ onImageSelect }: UploadPromptProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            onImageSelect(imageUrl);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-[80vh] w-full gap-8'>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
            />

            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">{STRINGS.title}</h2>
                <p className="text-muted-foreground">{STRINGS.subtitle}</p>
            </div>

            <Button
                onClick={handleUploadImage}
                data-umami-event="Upload Image Main"
                data-umami-event-type="action"
                size="lg"
            >
                {STRINGS.uploadButton}
            </Button>

            <div className="text-center mt-8">
                <h3 className="text-lg font-medium mb-4">{STRINGS.templateSection}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {defaultTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="relative group cursor-pointer"
                            onClick={() => onImageSelect(template.originalUrl, template.removedBgUrl)}
                        >
                            <div className="relative w-[200px] h-[150px] overflow-hidden rounded-lg">
                                <Image
                                    src={template.originalUrl}
                                    alt={template.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                <span className="text-white font-medium">{STRINGS.useTemplate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadPrompt;