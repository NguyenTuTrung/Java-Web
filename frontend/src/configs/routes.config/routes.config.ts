import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import adminRoute from '@/configs/routes.config/adminRoute'
import publicRoute from '@/configs/routes.config/publicRoute'
import authRoute from '@/configs/routes.config/authRoute'
import clientRoute from '@/configs/routes.config/clientRoute'

export const publicRoutes: Routes = [
    ...publicRoute
]
export const authRoutes: Routes = [
    ...authRoute
]
export const clientRoutes: Routes = [
    ...clientRoute
]
export const adminRoutes = [

    ...adminRoute,
]
