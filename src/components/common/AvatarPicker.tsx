import { useState } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const STYLES = ["identicon", "glyphs", "shapes", "rings", "bottts"];
const SEEDS = ["Felix", "Milo", "Luna", "Nova", "Zara", "Kai", "Echo", "Orion", "Sage", "Rex", "Ash", "Sky"];

const buildUrl = (style: string, seed: string) =>
    `https://api.dicebear.com/10.x/${style}/svg?seed=${seed}`;

type Props = { value: string; onChange: (url: string) => void };

export default function AvatarPicker({ value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [activeStyle, setActiveStyle] = useState(STYLES[0]);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}
                    className="relative w-16 h-16 rounded-full group cursor-pointer">
                {value
                    ? <img src={value} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    : <span className="w-full h-full rounded-full border-2 border-dashed border-(--border-color) flex items-center justify-center text-xs text-(--secondary-text)">Avatar</span>}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-4 h-4 text-white" />
                </div>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogTitle className="text-base">Choisir un avatar</DialogTitle>

                    <div className="flex gap-1 flex-wrap">
                        {STYLES.map(style => (
                            <button key={style} type="button"
                                    onClick={() => setActiveStyle(style)}
                                    className={`px-3 py-1 rounded-full text-xs capitalize transition-all cursor-pointer
                  ${activeStyle === style
                                        ? "bg-(--primary) text-white"
                                        : "bg-(--input-bg) text-(--secondary-text) hover:bg-(--primary)/20"}`}>
                                {style}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                        {SEEDS.map(seed => {
                            const url = buildUrl(activeStyle, seed);
                            const selected = value === url;
                            return (
                                <button key={seed} type="button"
                                        onClick={() => { onChange(url); setOpen(false); }}
                                        className={`relative rounded-xl p-1 transition-all cursor-pointer border-2
                    ${selected ? "border-(--primary) bg-(--primary)/10" : "border-transparent hover:border-(--primary)/40"}`}>
                                    <img src={url} alt={seed} className="w-full aspect-square rounded-lg" />
                                    {selected && (
                                        <span className="absolute top-1 right-1 w-3 h-3 bg-(--primary) rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}