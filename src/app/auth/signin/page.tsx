'use client'

import { signIn, getProviders } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { GradientBg } from '@/components/ui/gradient-bg'
import { useEffect, useState } from 'react'
import type { LiteralUnion, ClientSafeProvider } from 'next-auth/react'
import type { BuiltInProviderType } from 'next-auth/providers/index'

export default function SignIn() {
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    setAuthProviders()
  }, [])

  return (
    <GradientBg className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Icons.logo className="mx-auto h-12 w-12" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Sign in to CareerAI
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get personalized career guidance from our AI counselor
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: '/chat' })}
                className="w-full"
                size="lg"
              >
                <Icons.google className="mr-2 h-5 w-5" />
                Sign in with {provider.name}
              </Button>
            ))}
        </div>
      </div>
    </GradientBg>
  )
}
