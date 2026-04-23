import { create } from "zustand"
import type { TokenIcons } from "@/lib/api/backend"

interface UserTokenStore {
  tokenMap: Record<string, TokenIcons | null>
  setTokenData: (userId: string, tokenData: TokenIcons | null) => void
  getTokenData: (userId: string) => TokenIcons | null
}

export const useUserTokenStore = create<UserTokenStore>((set, get) => ({
  tokenMap: {},
  setTokenData: (userId, tokenData) =>
    set((state) => ({
      tokenMap: {
        ...state.tokenMap,
        [userId]: tokenData,
      },
    })),
  getTokenData: (userId) => get().tokenMap[userId] ?? null,
}))
