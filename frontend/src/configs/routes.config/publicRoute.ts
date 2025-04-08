import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [

    {
        key: '404',
        path: `/404`,
        component: lazy(() => import('@/views/404/PageNotFound')),
        authority: []
    },
    // {
    //     key: 'private',
    //     path: `/private/reset-password`,
    //     component: lazy(() => import('@/views/sale/ResetPassword')),
    //     authority: []
    // },
    // {
    //     key: 'private',
    //     path: `/client/forgot-password`,
    //     component: lazy(() => import('@/views/client/Popup/ForgotPassword')),
    //     authority: []
    // },
    {
        key: 'cart',
        path: `/cart`,
        component: lazy(() => import('@/views/client/Cart/CartComponent')),
        authority: []
    },
    {
        key: 'product',
        path: `/product`,
        component: lazy(() => import('@/views/client/Products/ProductList')),
        authority: []
    },
    {
        key: 'productDetail',
        path: '/productDetail',
        component: lazy(() => import('@/views/client/Cart/ProductDetail')),
        authority: []
    },
    {
        key: 'supper-sales',
        path: '/sales',
        component: lazy(() => import('@/views/sale/BlackFriday')),
        authority: []
    },
    {
        key: 'new-product',
        path: '/new-product',
        component: lazy(() => import('@/views/sale/EventProduct')),
        authority: []
    },
    {
        key: 'information',
        path: '/introduce',
        component: lazy(() => import('@/views/sale/Introduction')),
        authority: []
    },


    {
        key: 'customer-info',
        path: '/customer/:email',
        component: lazy(() => import('@/views/sale/CustomerInfor')),
        authority: []
    },

    {
        key: 'collections',
        path: '/collections',
        component: lazy(() => import('@/views/sale/ProductList')),
        authority: []
    },
    {
        key: 'thank',
        path: '/thank',
        component: lazy(() => import('@/views/sale/ThankYou')),
        authority: []
    },
    {
        key: 'purchase',
        path: '/user/purchase/:codeOrder',
        component: lazy(() => import('@/views/sale/InvoiceSearchResult')),
        authority: []
    },
    {
        key: 'check',
        path: '/check-order',
        component: lazy(() => import('@/views/sale/CheckOrderView')),
        authority: []
    },
    {
        key: 'products',
        path: '/products/:id',
        component: lazy(() => import('@/views/sale/ProductDetail')),
        authority: []
    },
    {
        key: 'logout',
        path: 'logout',
        component: lazy(() => import('@/views/auth/Logut/Logout')),
        authority: []
    },
    {
        key: 'checkout',
        path: '/checkout/:id',
        component: lazy(() => import('@/views/sale/Checkout')),
        authority: []
    },
    {
        key: 'profile',
        path: 'profile',
        component: lazy(() => import('@/views/client/Profile/MyProfile')),
        authority: []
    },
    {
        key: 'products',
        path: '/products-search',
        component: lazy(() => import('@/views/sale/ProductSearch')),
        authority: []
    },
]

export default publicRoute
