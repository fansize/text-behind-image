import React from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker'; 
import { Button } from '../ui/button';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LucideTrash } from 'lucide-react';

interface TextCustomizerProps {
    textSet: {
        id: number;
        text: string;
        fontFamily: string;
        top: number;
        left: number;
        color: string;
        fontSize: number;
        fontWeight: number;
        opacity: number;
        rotation: number;
        shadowColor: string;
        shadowSize: number;
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet }) => {
    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>
                <div className='flex justify-between items-center'>
                <span>{textSet.text}</span>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation();
                        removeTextSet(textSet.id);
                    }} 
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                >
                    <LucideTrash className="h-4 w-4" />
                </Button>
                </div>
            </AccordionTrigger>
            <AccordionContent className='p-1'>
                <PositionSizeControls 
                    textSet={textSet}
                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                />
                
                <TextAndStyleControls 
                    textSet={textSet}
                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                />
            </AccordionContent>
        </AccordionItem>
    );
};

// 位置和大小控件组
const PositionSizeControls: React.FC<{
    textSet: TextCustomizerProps['textSet'];
    handleAttributeChange: (attribute: string, value: any) => void;
}> = ({ textSet, handleAttributeChange }) => {
    return (
        <div className="mb-4 px-4 pb-8 border rounded-lg">
            <SliderField
                attribute="left"
                label="X Position"
                min={-200}
                max={200}
                step={1} 
                currentValue={textSet.left}
                handleAttributeChange={handleAttributeChange}
            />
            <SliderField
                attribute="top"
                label="Y Position"
                min={-100}
                max={100}
                step={1}
                currentValue={textSet.top}
                handleAttributeChange={handleAttributeChange}
            />
            <SliderField
                attribute="fontSize"
                label="Text Size"
                min={10} 
                max={800}
                step={1}
                currentValue={textSet.fontSize}
                handleAttributeChange={handleAttributeChange}
            />
        </div>
    );
};

// 文字内容和样式控件组（合并后的组件）
const TextAndStyleControls: React.FC<{
    textSet: TextCustomizerProps['textSet'];
    handleAttributeChange: (attribute: string, value: any) => void;
}> = ({ textSet, handleAttributeChange }) => {
    return (
        <div className="mb-4 p-4 border rounded-lg">
            <InputField
                attribute="text"
                label="Text"
                currentValue={textSet.text}
                handleAttributeChange={handleAttributeChange}
            />
             <div className='flex flex-row justify-between items-center mt-8'>
            <FontFamilyPicker
                attribute="fontFamily" 
                currentFont={textSet.fontFamily} 
                handleAttributeChange={handleAttributeChange}
            /> 
           
                <ColorPicker
                    attribute="color" 
                    label="Text Color"
                    currentColor={textSet.color} 
                    handleAttributeChange={handleAttributeChange}
                />
            </div>
            <SliderField
                attribute="fontWeight"
                label="Font Weight"
                min={100}
                max={900}
                step={100}
                currentValue={textSet.fontWeight}
                handleAttributeChange={handleAttributeChange}
            />
            <SliderField
                attribute="opacity"
                label="Text Opacity"
                min={0}
                max={1}
                step={0.01}
                currentValue={textSet.opacity}
                handleAttributeChange={handleAttributeChange}
            />
            <SliderField
                attribute="rotation"
                label="Rotation"
                min={-360}
                max={360}
                step={1}
                currentValue={textSet.rotation}
                handleAttributeChange={handleAttributeChange}
            />
        </div>
    );
};

export default TextCustomizer;