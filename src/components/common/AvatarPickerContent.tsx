const STYLES = ["identicon", "glyphs", "shapes", "rings", "bottts"];
const SEEDS = ["Felix", "Milo", "Luna", "Nova", "Zara", "Kai", "Echo", "Orion", "Sage", "Rex", "Ash", "Sky"];
const buildUrl = (style: string, seed: string) =>
    `https://api.dicebear.com/10.x/${style}/svg?seed=${seed}`;

type Props = {
    value: string;
    activeStyle: string;
    onStyleChange: (style: string) => void;
    onSelect: (url: string) => void;
};

export default function AvatarPickerContent({ value, activeStyle, onStyleChange, onSelect }: Props) {
    return (
        <>
            <div className="flex gap-1 flex-wrap">
                {STYLES.map(style => (
                    <button key={style} type="button"
                            onClick={() => onStyleChange(style)}
                            className={`px-4 py-1.5 sm:px-3 sm:py-1 rounded-full text-sm sm:text-xs capitalize transition-all cursor-pointer
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
                                onClick={() => onSelect(url)}
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
        </>
    );
}