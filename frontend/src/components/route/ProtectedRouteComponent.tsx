import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import { useEffect } from 'react'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRouteComponent = () => {
    const { authenticated } = useAuth()

    if (!authenticated) {
        console.log("----------2-")
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}`}
            />
        )
    }

    return <Outlet />
}

export default ProtectedRouteComponent
