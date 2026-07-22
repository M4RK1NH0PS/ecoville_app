import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../services/profileService'
import { findNearestStore } from '../services/storeService'
import type { Profile } from '../types/auth'
import type { StoreWithDistance } from '../types/store'

export function useUserStore() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [store, setStore] = useState<StoreWithDistance | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingStore, setLoadingStore] = useState(false)
  const [error, setError] = useState('')

  const loadUserStore = useCallback(async (userId: string, mounted: { current: boolean }) => {
    setLoadingProfile(true)
    setLoadingStore(false)
    setError('')
    setStore(null)

    try {
      const profileData = await getProfile(userId)
      if (!mounted.current) return

      setProfile(profileData)
      setLoadingProfile(false)
      setLoadingStore(true)

      try {
        const nearestStore = await findNearestStore(profileData)
        if (mounted.current) {
          setStore(nearestStore)
        }
      } catch {
        if (mounted.current) {
          setStore(null)
        }
      }
    } catch {
      if (mounted.current) {
        setProfile(null)
        setStore(null)
        setError('Não foi possível carregar seus dados agora.')
      }
    } finally {
      if (mounted.current) {
        setLoadingProfile(false)
        setLoadingStore(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!user?.id) {
      setProfile(null)
      setStore(null)
      setError('')
      setLoadingProfile(false)
      setLoadingStore(false)
      return
    }

    const mounted = { current: true }
    const userId = user.id

    loadUserStore(userId, mounted)

    function handleLocationUpdated() {
      loadUserStore(userId, mounted)
    }

    window.addEventListener('ecoville:location-updated', handleLocationUpdated)

    return () => {
      mounted.current = false
      window.removeEventListener('ecoville:location-updated', handleLocationUpdated)
    }
  }, [user?.id, loadUserStore])

  return {
    profile,
    store,
    loadingProfile,
    loadingStore,
    loading: loadingProfile || loadingStore,
    error,
  }
}
