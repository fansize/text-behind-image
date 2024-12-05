import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getUser, getSubscription } from '@/utils/supabase/queries'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowDown, Lock, Crown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

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
        title: 'Download the image as a PNG',
        description: '800x800px, 100% quality',
        learnMore: 'Learn more',
        learnMoreAbout: 'about Open Graph meta tags.',
        button: 'Download'
    },
    saveHDPanel: {
        title: 'Download the image as a PNG',
        description: '1600x1600px, 100% quality',
        button: 'Download HD'
    }
} as const

// 升级提示组件
export function UpgradePanel() {
    return (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-4 text-sm">
            <Lock className="h-4 w-4" />
            <Link
                href="/pricing"
                className="font-medium hover:underline"
                data-umami-event="upgrade_link_click"
                data-umami-event-type="pricing"
            >
                {STRINGS.upgrade.title}
            </Link>
            {STRINGS.upgrade.description}
        </div>
    )
}

interface SavePanelProps {
    onDownload: () => void;
}

// 保存小图片
export function SavePanel({ onDownload }: SavePanelProps) {
    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-base font-semibold">{STRINGS.savePanel.title}</h3>
                    <p className="text-sm text-muted-foreground">{STRINGS.savePanel.description}</p>
                </div>

                <Button
                    onClick={onDownload}
                    data-umami-event="download_button_click"
                    data-umami-event-type="action"
                >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    {STRINGS.savePanel.button}
                </Button>
            </div>
        </div >
    )
}

// 保存大图片
export function SaveHDPanel({ onDownload }: SavePanelProps) {
    const { user } = useUser()
    const router = useRouter()

    const handleClick = () => {
        if (!user) {
            router.push('/signin')
            return
        }
        onDownload()
    }

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-base font-semibold">{STRINGS.saveHDPanel.title}</h3>
                    <p className="text-sm text-muted-foreground">{STRINGS.saveHDPanel.description}</p>
                </div>

                <Button
                    onClick={handleClick}
                    data-umami-event="download_hd_button_click"
                    data-umami-event-type="action"
                >
                    <ArrowDown className="mr-2 h-4 w-4" />
                    {STRINGS.saveHDPanel.button}
                </Button>
            </div>
        </div>
    )
}

interface ActionButtonsProps {
    onDownload: () => void;
    isProActive: boolean;
}

// 修改 ActionButtons 组件传递 onDownload
export function ActionButtons({ onDownload, isProActive }: ActionButtonsProps) {
    const [activeTab, setActiveTab] = useState('save')

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full">
                <TabsTrigger value="save" className="flex-1">
                    {STRINGS.tabs.save}
                </TabsTrigger>
                <TabsTrigger value="save-hd" className="flex-1">
                    {isProActive ? <Crown className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                    {STRINGS.tabs.api}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="save">
                <SavePanel onDownload={onDownload} />
            </TabsContent>
            <TabsContent value="save-hd">
                <SaveHDPanel onDownload={onDownload} />
            </TabsContent>
        </Tabs>
    )
}

interface ActionPanelsProps {
    onDownload: () => void;
    isProActive: boolean;
}

// 修改主组件接收并传递 onDownload
export function ActionPanels({ onDownload, isProActive }: ActionPanelsProps) {
    return (
        <>
            {!isProActive && <UpgradePanel />}
            <ActionButtons onDownload={onDownload} isProActive={isProActive} />
        </>
    )
} 