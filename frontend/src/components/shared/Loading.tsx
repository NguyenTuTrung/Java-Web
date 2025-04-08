import Spinner from '@/components/ui/Spinner'
import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import type { ElementType, ReactNode } from 'react'

interface BaseLoadingProps extends CommonProps {
    asElement?: ElementType
    customLoader?: ReactNode
    loading: boolean
    spinnerClass?: string
}

interface LoadingProps extends BaseLoadingProps {
    type?: 'default' | 'cover'
}

const DefaultLoading = (props: BaseLoadingProps) => {
    const {
        loading,
        children,
        spinnerClass,
        className,
        asElement: Component = 'div',
        customLoader,
    } = props

    return loading ? (
        <Component
            className={classNames(
                !customLoader && 'flex items-center justify-center h-full',
                className
            )}
        >
            {customLoader ? (
                <>{customLoader}</>
            ) : (
                <Spinner className={spinnerClass} size={40} />
            )}
        </Component>
    ) : (
        <>{children}</>
    )
}

const CoveredLoading = (props: BaseLoadingProps) => {
    const {
        loading,
        children,
        spinnerClass,
        className,
        asElement: Component = 'div',
        customLoader,
    } = props

    return (
        <Component className={classNames(loading ? 'relative' : '', className)}>
            {children}
            {loading && (
                <div className="w-full h-full bg-white dark:bg-gray-800 dark:bg-opacity-60 bg-opacity-50 absolute inset-0" />
            )}
            {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    {customLoader ? (
                        <>{customLoader}</>
                    ) : (
                        <Spinner className={spinnerClass} size={40} />
                    )}
                </div>
            )}
        </Component>
    )
}

const Loading = ({
                     type = 'default', // Thay đổi ở đây
                     loading = false, // Thay đổi ở đây
                     asElement: Component = 'div', // Thay đổi ở đây
                     ...rest
                 }: LoadingProps) => {
    switch (type) {
        case 'default':
            return <DefaultLoading loading={loading} asElement={Component} {...rest} />;
        case 'cover':
            return <CoveredLoading loading={loading} asElement={Component} {...rest} />;
        default:
            return <DefaultLoading loading={loading} asElement={Component} {...rest} />;
    }
};


export default Loading
