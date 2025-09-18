import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex items-center justify-center rounded-md">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold hidden sm:block">One Stream Crud</span>
                <span className="mb-0.5 truncate leading-tight font-semibold sm:hidden">OSC</span>
            </div>
        </>
    );
}
