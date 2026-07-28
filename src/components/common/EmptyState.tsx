import type { ComponentType, SVGProps } from "react";

type Props = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    text: string;
    iconSize?: number;
    height?: string;
};

export default function EmptyState({ icon: Icon, text, iconSize = 32, height = "h-40" }: Props) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${height} text-(--secondary-text)`}>
            <Icon width={iconSize} height={iconSize} />
            <p style={{ fontSize: iconSize / 2.5 }}>{text}</p>
        </div>
    );
}