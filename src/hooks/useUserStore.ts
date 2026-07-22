import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../services/profileService'
import { findNearestStore } from '../services/storeService'
import { getAuthErrorMessage } from '../utils/authErrors'
import type { Profile } from '../types/auth'
import type { StoreWithDistance } from '../types/store'

export function useUserStore() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [store, setStore] = useState<StoreWithDistance | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingStore, setLoadingStore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) {
      setProfile(null)
      setStore(null)
      setError('')
      setLoadingProfile(false)
      setLoadingStore(false)
      return
    }

    let mounted = true
    const userId = user.id

    async function loadUserStore() {
      setLoadingProfile(true)
      setLoadingStore(false)
      setError('')
      setStore(null)

      try {
        const profileData = await getProfile(userId)
        if (!mounted) return

        setProfile(profileData)
        setLoadingProfile(false)
        setLoadingStore(true)

        const nearestStore = await findNearestStore(profileData)
        if (mounted) {
          setStore(nearestStore)
        }
      } catch (err) {
        if (mounted) {
          setProfile(null)
          setStore(null)
          const message =
            err instanceof Error ? err.message : 'Não foi possível carregar os dados.'
          setError(getAuthErrorMessage(message))
        }
      } finally {
        if (mounted) {
          setLoadingProfile(false)
          setLoadingStore(false)
        }
      }
    }

    loadUserStore()

    return () => {
      mounted = false
    }
  }, [user?.id])

  return {
    profile,
    store,
    loadingProfile,
    loadingStore,
    loading: loadingProfile || loadingStore,
    error,
  }
}
