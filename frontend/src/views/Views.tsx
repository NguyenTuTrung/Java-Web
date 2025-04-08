import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import ProtectedRouteComponent from '@/components/route/ProtectedRouteComponent'
import PublicRouteComponent from '@/components/route/PublicRouteComponent'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'
import { adminRoutes, authRoutes, clientRoutes, publicRoutes } from '@/configs/routes.config/routes.config'
import AuthorRouteComponent from "@/components/route/AuthorRouteComponent";
import PageNotFound from "@/views/404/PageNotFound";

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllAdminRoutes = (props: AllRoutesProps) => {
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    return (
        <Routes>
            <Route path="/" element={<ProtectedRouteComponent />}>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {adminRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={userAuthority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/404" />} />
            </Route>
        </Routes>
    )
}

const AllClientRoutes = (props: AllRoutesProps) => {
    return (
        <Routes>
            <Route path="/" element={<PublicRouteComponent />}>
                {/*<Route*/}
                {/*    path="/"*/}
                {/*    element={<Navigate replace to={authenticatedEntryPath} />}*/}
                {/*/>*/}
                {clientRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={

                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}

const AllPublicRoutes = (props: AllRoutesProps) => {
    return (
        <Routes>
            <Route path="" element={<PublicRouteComponent />}>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
                <Route path="*" element={<Navigate replace to="/404" />} />
            </Route>
        </Routes>
    )
}

const AllAuthRoutes = (props: AllRoutesProps) => {
    return (
        <Routes>
            <Route path="/" element={<AuthorRouteComponent />}>
                {authRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>
        </Routes>
    )
}
const AuthViews = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllAuthRoutes {...props} />
        </Suspense>
    )
}
const PublicViews = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllPublicRoutes {...props} />
        </Suspense>
    )
}
const AdminViews = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllAdminRoutes {...props} />
        </Suspense>
    )
}
const ClientViews = (props: ViewsProps) => {
    return (
        <Suspense fallback={<Loading loading={true} />}>
            <AllClientRoutes {...props} />
        </Suspense>
    )
}

export { AdminViews, ClientViews, PublicViews, AuthViews }