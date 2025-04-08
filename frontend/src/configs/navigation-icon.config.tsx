import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineCurrencyDollar,
    HiOutlineUserGroup,
    HiOutlineTicket,
    HiOutlineUsers,
    HiOutlineCollection, HiOutlineReceiptTax,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome/>,
    singleMenu: <HiOutlineViewGridAdd/>,
    collapseMenu: <HiOutlineTemplate/>,
    groupSingleMenu: <HiOutlineDesktopComputer/>,
    groupCollapseMenu: <HiOutlineColorSwatch/>,
    sale: <HiOutlineCurrencyDollar/>,
    groupUser: <HiOutlineUserGroup/>,
    ticket: <HiOutlineTicket/>,
    product: <HiOutlineColorSwatch/>,
    staff: <HiOutlineUsers/>,
    order: <HiOutlineCollection/>,
    event: <HiOutlineReceiptTax/>
}

export default navigationIcon
