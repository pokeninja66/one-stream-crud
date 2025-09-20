export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.png"
            alt="One Stream CRUD"
            className="h-12 w-auto"
            {...props}
        />
    );
}