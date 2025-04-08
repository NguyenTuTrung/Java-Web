export type StatisticCardProps = {
    data?: {
        value: number
        growShrink: number
    }
    label: string
    valuePrefix?: string
    date: number
}

export type StatisticProps = {
    data?: {
        revenue?: {
            value: number
            growShrink: number
        }
        orders?: {
            value: number
            growShrink: number
        }
        purchases?: {
            value: number
            growShrink: number
        }
    }
}