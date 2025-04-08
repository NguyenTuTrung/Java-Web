import Side from './Side'
import { useAppSelector } from '@/store'
import { LAYOUT_TYPE_BLANK } from '@/constants/theme.constant'
import RootLayout from '../ClassicLayout'

const AuthLayout = () => {
    const layoutType = useAppSelector((state) => state.theme.layout.type)

    return (
        <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
            {layoutType === LAYOUT_TYPE_BLANK ? (
                <RootLayout />
            ) : (
                    <RootLayout />
            )}
        </div>
    )
}

export default AuthLayout
