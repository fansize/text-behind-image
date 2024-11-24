import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowDown, Lock } from 'lucide-react'

const STRINGS = {
    tabs: {
        save: 'Download Image',
        api: 'Download HD'
    },
    upgrade: {
        title: 'Upgrade',
        description: 'to a paid plan to remove the watermark and download HD images.'
    },
    savePanel: {
        title: 'Download Image',
        description: 'Download the image as a PNG.',
        learnMore: 'Learn more',
        learnMoreAbout: 'about Open Graph meta tags.',
        button: 'Download'
    }
} as const

// 升级提示组件
export function UpgradePanel() {
    return (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-4 text-sm">
            <Lock className="h-4 w-4" />
            <span className="font-medium">{STRINGS.upgrade.title}</span> {STRINGS.upgrade.description}
        </div>
    )
}

interface SavePanelProps {
    onDownload: () => void;
}

// 修改 SavePanel 组件接收 onDownload prop
export function SavePanel({ onDownload }: SavePanelProps) {
    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold">{STRINGS.savePanel.title}</h3>
                <p className="text-sm text-muted-foreground">{STRINGS.savePanel.description}</p>
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-center gap-2">
                    <a href="#" className="text-sm underline">{STRINGS.savePanel.learnMore}</a> {STRINGS.savePanel.learnMoreAbout}
                </div>

                <Button onClick={onDownload}>
                    <ArrowDown className="mr-2 h-4 w-4" />
                    {STRINGS.savePanel.button}
                </Button>
            </div>
        </div>
    )
}

interface ActionButtonsProps {
    onDownload: () => void;
}

// 修改 ActionButtons 组件传递 onDownload
export function ActionButtons({ onDownload }: ActionButtonsProps) {
    const [activeTab, setActiveTab] = useState('save')

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full">
                <TabsTrigger value="save" className="flex-1">
                    {STRINGS.tabs.save}
                </TabsTrigger>
                <TabsTrigger value="api" className="flex-1">
                    <Lock className="mr-2 h-4 w-4" />
                    {STRINGS.tabs.api}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="save">
                <SavePanel onDownload={onDownload} />
            </TabsContent>
            <TabsContent value="api">
                {/* API 内容区域暂时为空 */}
            </TabsContent>
        </Tabs>
    )
}

interface ActionPanelsProps {
    onDownload: () => void;
}

// 修改主组件接收并传递 onDownload
export function ActionPanels({ onDownload }: ActionPanelsProps) {
    return (
        <>
            <UpgradePanel />
            <ActionButtons onDownload={onDownload} />
        </>
    )
} 