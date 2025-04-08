import { Fragment, ReactNode } from 'react'

const IconAndLabel = ({
                          icon,
                          label,
                          className = ''
                      }: {
    icon: ReactNode;
    label: string;
    className?: string;
}) => {
    return (
        <Fragment>
            <div className={`flex justify-center items-center gap-1 ${className}`}>
                {icon}
                <p>{label}</p>
            </div>
        </Fragment>
    )
}

export default IconAndLabel
