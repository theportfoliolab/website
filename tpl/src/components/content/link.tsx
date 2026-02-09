interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function Link({ href, children, className }: LinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-brandGreen font-bold underline hover:text-green-500 ${className ?? ""}`}
        >
            {children}
        </a>
    );
}

