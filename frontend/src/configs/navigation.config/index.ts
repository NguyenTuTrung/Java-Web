import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/admin/manage/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["ROLE_ADMIN","ROLE_STAFF"],
        subMenu: []
    },
    {
        key: 'manageSell',
        path: '/admin/manage/sell',
        title: 'Home',
        translateKey: 'nav.sellTitle',
        icon: 'sale',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["ROLE_ADMIN","ROLE_STAFF"],
        subMenu: []
    },
    {
        key: 'customerManager',
        path: 'manage/customer',
        title: 'Collapse menu item 1',
        translateKey: 'nav.customerTitle',
        icon: 'groupUser',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ROLE_ADMIN'],
        subMenu: []
    },
    {
        key: 'voucherManager',
        path: 'manage/voucher',
        title: 'Collapse menu item 2',
        translateKey: 'nav.voucherTitle',
        icon: 'ticket',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ROLE_ADMIN'],
        subMenu: []
    },
    {
        key: 'productManage',
        path: 'manage/product',
        title: 'Collapse menu item 2',
        translateKey: 'nav.productTitle',
        icon: 'product',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ROLE_ADMIN', 'ROLE_STAFF'],
        subMenu: []
    },
    {
        key: 'staffManager',
        path: 'manage/staff',
        title: 'Collapse menu item 2',
        translateKey: 'nav.staffTitle',
        icon: 'staff',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ROLE_ADMIN'],
        subMenu: []
    },
    {
        key: 'orderManager',
        path: 'manage/order',
        title: 'Collapse menu item 2',
        translateKey: 'nav.orderTitle',
        icon: 'order',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ROLE_ADMIN', 'ROLE_STAFF'],
        subMenu: []
    },
    {
        key: 'eventManager',
        path: 'manage/event',
        title: 'Collapse menu item 2',
        translateKey: 'nav.eventTitle',
        icon: 'event',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ROLE_ADMIN', 'ROLE_STAFF'],
        subMenu: []
    },
    {
        key: 'propertiesManager',
        path: '',
        title: 'Collapse menu item 2',
        translateKey: 'nav.propertiesTitle',
        icon: 'order',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['ROLE_ADMIN', 'ROLE_STAFF'],
        subMenu: [
            {
                key: 'brandTitle',
                path: 'manage/product/brand-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.brandTitle',
                icon: 'order',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'originTitle',
                path: 'manage/product/origin-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.originTitle',
                icon: 'order',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'styleTitle',
                path: 'manage/product/style-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.styleTitle',
                icon: 'order',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'materialTitle',
                path: 'manage/product/material-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.materialTitle',
                icon: 'order',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'collarTitle',
                path: 'manage/product/collar-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.collarTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'sleeveTitle',
                path: 'manage/product/sleeve-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.sleeveTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'textureTitle',
                path: 'manage/product/texture-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.textureTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'thicknessTitle',
                path: 'manage/product/thickness-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.thicknessTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'elasticityTitle',
                path: 'manage/product/elasticity-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.elasticityTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'sizeTitle',
                path: 'manage/product/size-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.sizeTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: 'colorTitle',
                path: 'manage/product/color-list',
                title: 'Collapse menu item 2',
                translateKey: 'nav.colorTitle',
                icon: 'event',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            }


        ]
    }
]

export default navigationConfig
