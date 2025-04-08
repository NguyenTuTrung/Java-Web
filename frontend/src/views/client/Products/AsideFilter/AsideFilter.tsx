

import { Controller, useForm, Resolver } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import InputNumber from '../../components/InputNumber'
import Button from '../../components/Button'
import RatingStars from '../../components/RatingStars'
import useQueryConfig, { QueryConfig } from '../../hooks/useQueryConfig'
import classNames from 'classnames'
import { Category } from '../../types/category.type'
import { schema } from '../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import path from '../../constants/path'
import { omit } from 'lodash'
import ProductSizeSelector from '../../components/SizeSelector/ProductSizeSelector'

interface Props {
    queryConfig: QueryConfig
    categories: Category[]
}

type FormData = {
    price_min: string
    price_max: string
}

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ queryConfig, categories }: Props) {
    const { category } = queryConfig
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        trigger
    } = useForm<FormData>({
        defaultValues: {
            price_min: '',
            price_max: ''
        },
        resolver: yupResolver(priceSchema) as Resolver<FormData>
    })

    const navigate = useNavigate()
    const valueForm = watch()
    console.log(errors)
    const onSubmit = handleSubmit((data) => {
        navigate({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                price_max: data.price_max,
                price_min: data.price_min
            }).toString()
        })
    })

    const handleRemoveAll = () => {
        navigate({
            pathname: path.home,
            search: createSearchParams(
                omit(
                    {
                        ...queryConfig
                    },
                    ['price_max', 'price_min', 'rating', 'rating_filter', 'category']
                )
            ).toString()
        })
    }
    return (
        <div className='py-4'>
            <div>
                <Link to={'/'} className={classNames('relative px-2', { 'text-orange font-semibold': !category })}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-3 h-4 mr-4 fill-current size-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5'
                        />
                    </svg>
                    Tất cả Danh mục
                </Link>
                <div className='bg-gray-300 h-[1px] my-4'>
                    <ul>
                        {categories.map((categoryItem) => {
                            const isActive = category === categoryItem._id
                            return (
                                <li key={categoryItem._id}>
                                    <Link
                                        to={{
                                            pathname: path.home,
                                            search: createSearchParams({ ...queryConfig, category: categoryItem._id }).toString()
                                        }}
                                        className={classNames(' relative px-2 ', { 'text-orange font-bold': isActive })}
                                    >
                                        {isActive && (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='fill-orange h-2 w-2 absolute top-1 left-[-10px] size-6'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                strokeWidth={1.5}
                                                stroke='currentColor'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    d='M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25'
                                                />
                                            </svg>
                                        )}
                                        {categoryItem.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <Link to={path.home} className='flex items-center font-bold mt-4 uppercase'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='w-3 h-4 fill-current mg-3 size-6'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                            />
                        </svg>
                        Bộ lọc tìm kiếm
                    </Link>
                    <div className='bg-gray-300 h-[1px] my-4'></div>
                    <div className='my-5'>
                        <div className=''>Khoảng giá</div>
                        <form action='' className='mt-2' onSubmit={onSubmit}>
                            <div className='flex items-start'>
                                <Controller
                                    control={control}
                                    name='price_min'
                                    render={({ field }) => (
                                        <InputNumber
                                            type='text'
                                            placeholder='Từ'
                                            classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm'
                                            onChange={(event) => {
                                                field.onChange(event)
                                                trigger('price_max')
                                            }}
                                            value={field.value}
                                            classNameError='hidden'
                                            ref={field.ref}
                                        />
                                    )}
                                />


                                <div className='mx-2 mt-2 shink-0'>-</div>
                                <Controller
                                    control={control}
                                    name='price_max'
                                    render={({ field }) => (
                                        <InputNumber
                                            type='text'
                                            placeholder='Đến'
                                            classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm'
                                            onChange={(event) => {
                                                field.onChange(event)
                                                trigger('price_min')
                                            }}
                                            value={field.value}
                                            ref={field.ref}
                                            classNameError='hidden'
                                        />
                                    )}
                                />
                            </div>
                            <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm text-center'>{errors.price_min?.message}</div>
                            <Button
                                type='submit'
                                className='w-full p-2 uppercase bg-orange-200 text-white text-sm hover:bg-orange-600 80 flex justify-center items-center'
                            >
                                Áp dụng
                            </Button>
                        </form>
                    </div>
                    <div className='bg-gray-300 h-[1px] my-4  '>
                        <div className='flex items-center justify-between border-b border-gray-300 pb-2 mb-4 p-4'>
                            <span className='text-lg font-bold uppercase text-gray-700'>Size</span>
                        </div>
                        {/* <RatingStars queryConfig={useQueryConfig} /> */}
                        <ProductSizeSelector />
                        <Button
                            onClick={handleRemoveAll}
                            type='submit'
                            className='w-full p-2 my-2 uppercase bg-orange-200 text-white text-sm hover:bg-orange-600 80 flex justify-center items-center'
                        >
                            Xóa tất cả
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
