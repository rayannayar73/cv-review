import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

/**
 * Get the current authenticated user from server components
 */
export async function getUser(): Promise<User | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user's profile including admin status
 */
export async function getUserProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

/**
 * Require admin access - redirect if not admin
 */
export async function requireAdmin() {
  const profile = await getUserProfile()
  if (!profile || !profile.is_admin) {
    redirect('/dashboard')
  }
  return profile
}