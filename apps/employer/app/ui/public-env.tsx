import type { PublicEnvironment } from '~/lib/environment/environment.server';
import { environment } from '~/lib/environment/environment.server'

declare global {
    interface Window {
        ENV: PublicEnvironment
    }
}

function PublicEnv({ nonce, publicEnvs }: {
    nonce: string,
    publicEnvs: PublicEnvironment
}) {
    return (
        <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify(publicEnvs)}`,
            }}
        />
    )
}

function getPublicEnv<T extends keyof PublicEnvironment>(key: T): PublicEnvironment[T] {
    if (typeof window !== 'undefined' && !window.ENV) {
        throw new Error(
            `Missing the <PublicEnv /> component at the root of your app.`,
        )
    }

    return typeof window === 'undefined' ? environment()[key] : window.ENV[key]
}

export { PublicEnv, getPublicEnv }