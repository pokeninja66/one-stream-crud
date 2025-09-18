import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 flex-shrink-0"
            {...props}
        >
            <rect width="32" height="32" rx="6" fill="hsl(var(--primary))" />
            <text
                x="16"
                y="22"
                textAnchor="middle"
                fill="white"
                fontSize="18"
                fontWeight="bold"
                fontFamily="system-ui, sans-serif"
            >
                1
            </text>
        </svg>
    );
}