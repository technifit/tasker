import { getPublicEnv } from './public-env'

export function TailwindIndicator() {
    if (getPublicEnv('NODE_ENV') === "production" || getPublicEnv('VERCEL_ENV') === 'production') return null

    return (
        <div className="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-primary/95 text-primary-foreground/95 p-3 font-mono text-xs">
            <div className="block sm:hidden">xs</div>
            <div className="hidden sm:block md:hidden">sm</div>
            <div className="hidden md:block lg:hidden">md</div>
            <div className="hidden lg:block xl:hidden">lg</div>
            <div className="hidden xl:block 2xl:hidden">xl</div>
            <div className="hidden 2xl:block">2xl</div>
        </div>
    )
}