import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function usequeryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}