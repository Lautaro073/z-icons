"use client"

import { authClient } from "@/lib/auth/client"
import { ZIcon } from "@zcorvus/z-icons/react"

const ProviderSignup = () => {
  return (
    <>
      <button
        className="cursor-pointer"
        onClick={() => authClient.signIn.social({
          provider: "github"
        })}
      >
        <ZIcon type="mina" name="brand-github" variant="light" />
      </button>
      <button
        className="cursor-pointer"
        onClick={() => authClient.signIn.social({
          provider: "google"
        })}
      >
        <ZIcon type="mina" name="brand-google" variant="light" />
      </button>

    </>
  )
}

export { ProviderSignup }
