"use client"

import { useEffect, useState } from "react"
import { getUserToken, type TokenIcons } from "@/lib/api/backend"
import { useUserTokenStore } from "../store"

const isTokenValid = (token: TokenIcons | null) => {
  if (!token?.finish_date) {
    return false
  }

  const expiresAt = new Date(token.finish_date).getTime()
  return !Number.isNaN(expiresAt) && expiresAt > Date.now()
}

export const useUserToken = (userId: string | null, userRole: string) => {
  const [tokenData, setTokenData] = useState<TokenIcons | null>(() => {
    if (!userId || userRole !== "pro") {
      return null
    }

    const cachedToken = useUserTokenStore.getState().getTokenData(userId)
    return isTokenValid(cachedToken) ? cachedToken : null
  })

  useEffect(() => {
    let mounted = true

    const loadTokenData = async () => {
      if (!userId || userRole !== "pro") {
        setTokenData(null)
        return
      }

      const cachedToken = useUserTokenStore.getState().getTokenData(userId)
      if (isTokenValid(cachedToken)) {
        setTokenData(cachedToken)
        return
      }

      const result = await getUserToken()
      if (mounted) {
        setTokenData(result)
        useUserTokenStore.getState().setTokenData(userId, result)
      }
    }

    loadTokenData().catch(() => undefined)

    return () => {
      mounted = false
    }
  }, [userId, userRole])

  return tokenData
}
