import type { getPublicKeys } from '~/server/environment.server'
import { environment } from '~/server/environment.server'

type PublicEnvs = ReturnType<typeof getPublicKeys>['publicKeys']

declare global {
    interface Window {
        ENV: PublicEnvs
    }
}
function PublicEnv({ nonce, publicEnvs }: {
    nonce: string,
    publicEnvs: PublicEnvs
}) {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `window.ENV = ${JSON.stringify(publicEnvs)}`,
            }}
        />
    )
}

function getPublicEnv<T extends keyof PublicEnvs>(key: T): PublicEnvs[T] {
    if (typeof window !== 'undefined' && !window.ENV) {
        throw new Error(
            `Missing the <PublicEnv /> component at the root of your app.`,
        )
    }

    return typeof window === 'undefined' ? environment()[key] : window.ENV[key]
}

export { PublicEnv, getPublicEnv }