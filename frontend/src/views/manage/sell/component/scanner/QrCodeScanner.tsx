import React, { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useToastContext } from '@/context/ToastContext'
import { OrderResponseDTO } from '@/@types/order'
import instance from '@/axios/CustomAxios'
import { useOrderContext } from '@/views/manage/order/component/context/OrderContext'
import { ConfirmDialog } from '@/components/shared'

type IProps = {
    isScanning: boolean;
    setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
    selectOrder: OrderResponseDTO,
    fetchData: () => Promise<void>
};

const QrCodeScanner: React.FC<IProps> = ({ isScanning, setIsScanning, selectOrder, fetchData }) => {
    const [scanResult, setScanResult] = useState<string>('')
    const {
        isOpenOverrideConfirm,
        setIsOpenOverrideConfirm,
        selectedOrderRequestContext,
        setSelectedOrderRequestContext
    } = useOrderContext()
    const qrRegionId = 'qr-reader'

    useEffect(() => {
        console.log('scanResult: ', scanResult)
    }, [scanResult])

    const { openNotification } = useToastContext()

    const handleScanSuccess = async (decodedText: string) => {
        console.log(`Mã QR đã quét: ${decodedText}`)
        setScanResult(decodedText)
        setIsScanning(false)

        try {
            const productResponse = await instance.get(`/productDetails/by-code/${decodedText}`)
            if (productResponse.status === 200) {
                const id_product_detail = productResponse.data.id
                const data = {
                    orderId: selectOrder.id,
                    productDetailId: id_product_detail
                }

                try {
                    const overrideResponse = await instance.post('/order-details/allowOverride', data)
                    console.log(overrideResponse.data) // Log the response
                    const hasChange = overrideResponse.data?.hasChange ?? false // Ensure a valid return value
                    if (hasChange) {
                        setIsOpenOverrideConfirm(true)
                        setSelectedOrderRequestContext({
                            productDetailId: id_product_detail,
                            orderId: selectOrder.id,
                            quantity: 1
                        })
                    }
                    else{
                        await instance.post('/order-details', {
                            productDetailId: id_product_detail,
                            orderId: selectOrder.id,
                            quantity: 1
                        }).then(function(response) {
                            if(response.status === 200){
                                openNotification("Thêm thành công", 'Thông báo', 'success', 1500)
                                fetchData()
                            }
                        }).catch(function(err) {
                            if (err?.response?.status === 400) {
                                openNotification(err.response.data.error, 'Thông báo', 'warning', 1500)
                            }
                        })
                    }
                } catch (error) {
                    console.error('Error checking override permission:', error)
                    return false
                }
            }
        } catch (error) {
            console.error('Error fetching product details:', error)
        }
    }

    useEffect(() => {
        let html5QrCodeScanner: Html5QrcodeScanner | null = null

        if (isScanning && document.getElementById(qrRegionId)) {
            html5QrCodeScanner = new Html5QrcodeScanner(
                qrRegionId,
                {
                    fps: 10,
                    qrbox: { width: 10000, height: 300 },
                    useBarCodeDetectorIfSupported: true,
                    showZoomSliderIfSupported: true,
                    defaultZoomValueIfSupported: 5
                },
                false
            )

            html5QrCodeScanner.render(
                (decodedText) => {
                    console.log(`Mã QR đã quét: ${decodedText}`)
                    setScanResult(decodedText)
                    setIsScanning(false)
                    handleScanSuccess(decodedText)
                },
                (error) => {
                    console.warn(`Quét thất bại: ${error}`)
                }
            )
        }

        return () => {
            if (html5QrCodeScanner) {
                html5QrCodeScanner.clear()
            }
        }
    }, [isScanning])

    const handleCloseOverride = () => {
        console.log('Close')
        setIsOpenOverrideConfirm(false)
    }

    const handleConfirmOverride = async () => {
        console.log('Confirm')
        setIsOpenOverrideConfirm(false)
        console.log(selectedOrderRequestContext)
        await instance.post('/order-details', selectedOrderRequestContext).then(function(response) {
            if(response.status === 200){
                openNotification("Thêm thành công", 'Thông báo', 'success', 1500)
                fetchData()
            }
        }).catch(function(err) {
            if (err?.response?.status === 400) {
                openNotification(err.response.data.error, 'Thông báo', 'warning', 1500)
            }
        })
    }


    return (
        <div>
            <div>
                <ConfirmDialog
                    isOpen={isOpenOverrideConfirm}
                    type={'warning'}
                    title={'Xác nhận tạo bản ghi mới ?'}
                    confirmButtonColor={'red-600'}
                    onClose={handleCloseOverride}
                    onRequestClose={handleCloseOverride}
                    onCancel={handleCloseOverride}
                    onConfirm={handleConfirmOverride}
                >
                    <p>Vui lòng xác nhận</p>
                </ConfirmDialog>
            </div>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                {isScanning && (
                    <div
                        className="scan-modal"
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '500px',
                            height: '500px',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                            zIndex: 1000
                        }}
                    >
                        <div id={qrRegionId} style={{ width: '100%', height: '100%' }}></div>
                        <button
                            onClick={() => setIsScanning(false)}
                            style={{ marginTop: '20px', padding: '10px 20px' }}
                        >
                            Dừng Quét
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QrCodeScanner