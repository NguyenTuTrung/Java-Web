import { Fragment, useEffect, useState } from 'react'
import instance from '@/axios/CustomAxios'
import { ProductSaleCardDTO } from '@/@types/sale'
import ProductCard from '@/views/sale/product/ProductCard'
import { Button, Pagination } from '@/components/ui'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { HiSearch } from 'react-icons/hi'

const ProductSearch = () => {
    const [listProductDTO, setListProductDTO] = useState<ProductSaleCardDTO[]>([])
    const [totalElements, setTotalElements] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchParams] = useSearchParams()
    const key = searchParams.get('key') // Lấy giá trị của key
    const pageSize = 20
    const navigate = useNavigate()

    const [query, setQuery] = useState<string>('')

    useEffect(() => {
        key && setQuery(key)
        handleFetchProduct()
    }, [key])

    const onPaginationChange = (val: number) => {
        setCurrentPage(val)
    }

    const handleFetchProduct = () => {
        instance.get(`/productDetails/abc?page=${currentPage - 1}&size=${pageSize}&query=${key}`).then(function(response) {
            console.log(response)
            if (response.status === 200) {
                setListProductDTO(response?.data?.content)
                setTotalElements(response?.data?.totalElements)
            }
        })
    }


    return (
        <div className={'px-[2%] py-10 h-screen'}>
            <div className={'flex justify-center items-center pb-5'}>
                <div className={'flex flex-col justify-center text-center'}>
                    <p className={'font-semibold text-3xl text-black'}>Tìm kiếm</p>
                    <p className={'text-sm'}>
                        Có <span className={'text-black'}>{totalElements} sản phẩm</span> cho tìm kiếm
                    </p>
                </div>
            </div>
            <Fragment>
                <div className={'grid grid-cols-3 2xl:grid-cols-5 gap-5'}>
                    {
                        listProductDTO.map((item, index) => (
                            <div key={index}>
                                <div>
                                    <ProductCard product={item}></ProductCard>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className={'flex justify-center pt-10'}>
                    <Pagination
                        total={totalElements}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onChange={onPaginationChange}
                    />
                </div>
            </Fragment>
            {
                listProductDTO.length === 0 && (
                    <div className={'flex flex-col gap-2 justify-center text-center'}>
                        <div className={'text-black text-[19px]'}>
                            <p>Không tìm thấy nội dung bạn yêu cầu</p>
                        </div>
                        <div className={'text-[16px]'}>
                            Không tìm thấy
                            <span className={'text-black'}>{' " '}{key}{' " '}</span>
                            . Vui lòng kiểm tra chính tả, sử dụng các từ tổng quát hơn và thử lại!
                        </div>
                        <div className={'flex justify-center'}>
                            {
                                key && <Input
                                    className={'max-w-[800px]'}
                                    value={query}
                                    suffix={(<Button
                                        variant={'plain'}
                                        icon={<HiSearch
                                            size={30}
                                            onClick={() => {
                                                navigate(`/products-search?key=${query}`)
                                            }}
                                        />} />)}
                                    onChange={(el) => setQuery(el.target.value)}

                                />
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default ProductSearch