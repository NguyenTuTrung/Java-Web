import { User } from "../types/user.type"


export const setAccesTokenLs = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLs = () => {
  localStorage.removeItem('access_token')
}

export const getAccessTokenFromLs = () => localStorage.getItem('access_token') || ''

export const getProfileFromLs = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfile = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}