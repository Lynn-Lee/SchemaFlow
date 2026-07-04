import React from 'react';
import { EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button/button';

export interface CanvasEmptyFilterOverlayProps {
    onResetFilter: () => void;
}

export const CanvasEmptyFilterOverlay: React.FC<
    CanvasEmptyFilterOverlayProps
> = ({ onResetFilter }) => {
    const { t } = useTranslation();

    return (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="pointer-events-auto flex items-center gap-3 rounded-lg border bg-background/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                <EyeOff className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {t('canvas.all_tables_hidden')}
                </span>
                <Button variant="outline" size="sm" onClick={onResetFilter}>
                    {t('canvas.show_all_tables')}
                </Button>
            </div>
        </div>
    );
};
