import { useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery.ts";
import AvatarPickerContent from "./AvatarPickerContent.tsx";

const STYLES_DEFAULT = "identicon";

type Props = { value: string; onChange: (url: string) => void };

export default function AvatarPicker({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [activeStyle, setActiveStyle] = useState(STYLES_DEFAULT);
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const handleSelect = (url: string) => {
        onChange(url);
        setOpen(false);
    };

    const trigger = (
        <button type="button" onClick={() => setOpen(true)}
                className="relative w-16 h-16 rounded-full group cursor-pointer">
            {value
                ? <img src={value} alt="avatar" className="w-full h-full rounded-full object-cover" />
                : <span className="w-full h-full rounded-full border-2 border-dashed border-(--border-color) flex items-center justify-center text-xs text-(--secondary-text)">Avatar</span>}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="w-4 h-4 text-white" />
            </div>
        </button>
    );

    if (isDesktop) {
        return (
            <>
                {trigger}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-md m-5" showCloseButton={false}>
                        <DialogTitle className="text-base">Choisir un avatar</DialogTitle>
                        <AvatarPickerContent
                            value={value}
                            activeStyle={activeStyle}
                            onStyleChange={setActiveStyle}
                            onSelect={handleSelect}
                        />
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            {trigger}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="px-4 pb-6 rounded-4xl!">
                    <DrawerTitle className="text-base py-2">Choisir un avatar</DrawerTitle>
                    <AvatarPickerContent
                        value={value}
                        activeStyle={activeStyle}
                        onStyleChange={setActiveStyle}
                        onSelect={handleSelect}
                    />
                </DrawerContent>
            </Drawer>
        </>
    );
}