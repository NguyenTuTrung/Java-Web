import { lazy } from 'react'
import type { Routes } from '@/@types/routes'


const adminRoute: Routes = [
    {
        key: 'home',
        path: 'manage/home',
        component: lazy(() => import('@/views/manage/statistics/SalesDashboard')),
        authority: []
    },
    {
        key: 'customerManager',
        path: `manage/customer`,
        component: lazy(() => import('@/views/manage/customer/CustomerManage')),
        authority: []
    },
    {
        key: 'addCustomer',
        path: `manage/customer/add`,
        component: lazy(
            () => import('@/views/manage/customer/component/AddCustomer')
        ),
        authority: []
    },
    {
        key: 'updateCustomer',
        path: `manage/customer/update/:id`,
        component: lazy(
            () => import('@/views/manage/customer/component/UpdateCustomer')
        ),
        authority: []
    },
    {
        key: 'voucherManager',
        path: `manage/voucher`,
        component: lazy(() => import('@/views/manage/voucher/VoucherManage')),
        authority: []
    },
    {
        key: 'appVouchers.voucherList',
        path: `manage/voucher/voucher-list`,
        component: lazy(() => import('@/views/manage/voucher/VoucherManage')),
        authority: []
    },
    {
        key: 'appVouchers.voucherNew',
        path: `manage/voucher/voucher-new`,
        component: lazy(() => import('@/views/manage/voucher/VoucherNew')),
        authority: [],
        meta: { header: 'Thêm Phiếu Giảm Giá' }
    },
    {
        key: 'UpdateVoucher',
        path: `manage/voucher/update/:id`,
        component: lazy(() => import('@/views/manage/voucher/VoucherNew/VoucherUpdate')),
        authority: []
    },
    {
        key: 'staffManager',
        path: `manage/staff`,
        component: lazy(() => import('@/views/manage/staff/StaffManage')),
        authority: []
    },
    {
        key: 'UpdateStaff',
        path: `manage/staff/update/:id`,
        component: lazy(() => import('@/views/manage/staff/UpdateStaff')),
        authority: []
    },
    {
        key: 'AddStaffPage',
        path: `manage/staff/add`,
        component: lazy(() => import('@/views/manage/staff/AddStaffPage')),
        authority: []
    },
    {
        key: 'orderManager',
        path: `manage/order`,
        component: lazy(() => import('@/views/manage/order/OrderManage')),
        authority: []
    },
    {
        key: 'customerManager',
        path: `manage/order/order-details/:id`,
        component: lazy(() => import('@/views/manage/order/component/other/OrderDetails')),
        authority: []
    },
    {
        key: 'manageSell',
        path: `manage/sell`,
        component: lazy(() => import('@/views/manage/sell/SellManage')),
        authority: []
    },
    {
        key: 'productManage',
        path: `manage/product`,
        component: lazy(() => import('@/views/manage/product/productList')),
        authority: []
    },
    {
        key: 'productManage',
        path: 'manage/product/ProductDetail-list/:id',
        component: lazy(() => import('@/views/manage/product/productDetailList')),
        authority: []
    },
    {
        key: 'eventManager',
        path: `/manage/event`,
        component: lazy(
            () => import('@/views/manage/event/components/EventTable'),
        ),
        authority: [],
    },
    {
        key: 'addEvent',
        path: `/manage/event/add`,
        component: lazy(
            () => import('@/views/manage/event/components/AddEvent'),
        ),
        authority: [],
    },
    {
        key: 'updateEvent',
        path: `/manage/event/update/:id`,
        component: lazy(
            () => import('@/views/manage/event/components/UpdateEvent'),
        ),
        authority: [],
    },

    {
        key: 'productManage',
        path: `/manage/product`,
        component: lazy(() => import('@/views/manage/product/productList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/ProductDetail-list/:id',
        component: lazy(() => import('@/views/manage/product/productDetailList')),
        authority: [],
    },
    {
        key: 'productManage',
        path: 'manage/product/product-new',
        component: lazy(() => import('@/views/manage/product/ProductNew')),
        authority: [],
    },
    {
        key: 'brandManage',
        path: 'manage/product/brand-list',
        component: lazy(() => import('@/views/manage/product/brandLisst')),
        authority: [],
    },
    {
        key: 'originManage',
        path: 'manage/product/origin-list',
        component: lazy(() => import('@/views/manage/product/originList')),
        authority: [],
    },
    {
        key: 'styleManage',
        path: 'manage/product/style-list',
        component: lazy(() => import('@/views/manage/product/styleList')),
        authority: [],
    },
    {
        key: 'materialManage',
        path: 'manage/product/material-list',
        component: lazy(() => import('@/views/manage/product/materialList')),
        authority: [],
    },
    {
        key: 'collarManage',
        path: 'manage/product/collar-list',
        component: lazy(() => import('@/views/manage/product/collarList')),
        authority: [],
    },
    {
        key: 'sleeveManage',
        path: 'manage/product/sleeve-list',
        component: lazy(() => import('@/views/manage/product/sleeveList')),
        authority: [],
    },
    {
        key: 'textureManage',
        path: 'manage/product/texture-list',
        component: lazy(() => import('@/views/manage/product/textureList')),
        authority: [],
    },
    {
        key: 'thicknessManage',
        path: 'manage/product/thickness-list',
        component: lazy(() => import('@/views/manage/product/thicknessList')),
        authority: [],
    },
    {
        key: 'elasticityManage',
        path: 'manage/product/elasticity-list',
        component: lazy(() => import('@/views/manage/product/elasticityList')),
        authority: [],
    },
    {
        key: 'sizeManage',
        path: 'manage/product/size-list',
        component: lazy(() => import('@/views/manage/product/sizeList')),
        authority: [],
    },
    {
        key: 'colorManage',
        path: 'manage/product/color-list',
        component: lazy(() => import('@/views/manage/product/colorList')),
        authority: [],
    },
]

export default adminRoute

