import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Input } from 'antd';
import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
// import FormatCurrency from '../../utilities/FormatCurrency.jsx';
// import { findByMaAndSDT } from '../../utilities/ApiDotGiamGia/DotGiamGiaApi.js';
import { useNavigate } from 'react-router-dom';
import '../account/voucher.css';
import FormatCurrency from './FormatCurrency';
import FormatDate from './FormatDate.js';

const { Text } = Typography;

// Define types for the HoaDon object
interface HoaDon {
    code: string;
    createdAt: string;
    shippingFee: number;
    totalMoney: number;
    discountAmount: number;
}

const Tracking: React.FC = () => {
    const [searchValueMa, setSearchValueMa] = useState<string>(''); // Input value for searching by invoice ID
    const [searchValueSDT, setSearchValueSDT] = useState<string>(''); // Input value for searching by phone number
    const [hoaDon, setHoaDon] = useState<HoaDon | null>(null); // Store HoaDon data or null
    const navigate = useNavigate();

    const onSearchMaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValueMa(value);
    };

    const onSearchSDTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValueSDT(value);
    };

    // Fetch order details by ID and phone number when both search terms are present
    // useEffect(() => {
    //     const ma = searchValueMa; // Get value from searchValueMa
    //     const sdt = searchValueSDT; // Get value from searchValueSDT

    //     if (ma && sdt) { // Need both values
    //         FindByMa(ma, sdt);
    //     } else {
    //         setHoaDon(null); // Reset hoaDon if search terms are not present
    //     }
    // }, [searchValueMa, searchValueSDT]);

    // const FindByMa = (ma: string, sdt: string) => {
    //     // Ensure both ma and sdt have values
    //     if (!ma || !sdt) {
    //         alert("Bạn cần nhập cả mã hóa đơn và số điện thoại.");
    //         return;
    //     }

    //     findByMaAndSDT(ma, sdt)
    //         .then((response) => {
    //             console.log("API response:", response.data);
    //             setHoaDon(response.data); // Set hoaDon data if available
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching order details:', error);
    //         });
    // };

    const handleViewHoaDonDetail = (ma: string) => {
        navigate(`/tracking/${ma}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className='d-flex'>
                <Input
                    placeholder="Mời nhập mã hóa đơn"
                    prefix={<SearchOutlined />}
                    value={searchValueMa}
                    onChange={onSearchMaChange}
                    style={{ marginBottom: '20px', height: '40px', width: '100%', color: '#6A0DAD' }}
                />
                <Input
                    placeholder="Mời nhập số điện thoại người nhận"
                    prefix={<SearchOutlined />}
                    value={searchValueSDT}
                    onChange={onSearchSDTChange}
                    style={{ marginLeft: '10px', marginBottom: '20px', height: '40px', width: '100%', color: '#6A0DAD' }}
                />
            </div>

            {searchValueMa && searchValueSDT ? (
                hoaDon ? ( // Check if hoaDon has data
                    <Card
                        style={{ marginBottom: '10px' }}
                        actions={[<Button
                            onClick={() => handleViewHoaDonDetail(hoaDon?.code)}
                            className="voucher-button"
                            icon={<CheckCircleOutlined />}
                        >
                            Thông Tin Chi Tiết
                        </Button>]} >
                        <div>
                            <h5>Mã hóa đơn: {hoaDon.code}</h5>
                            <hr />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='py-2'>
                                <Text>Ngày đặt hàng: <FormatDate date={hoaDon.createdAt} /></Text><br /><br />
                            </div>
                            <div className='py-2' style={{ textAlign: 'right' }}>
                                <Text>Tiền ship: <FormatCurrency value={hoaDon.shippingFee} /></Text>
                                <br /><br />
                                <Text>Tổng tiền: <FormatCurrency value={hoaDon.totalMoney + hoaDon.shippingFee - hoaDon.discountAmount} /></Text>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Text>Không tìm thấy đơn hàng nào.</Text>
                )
            ) : <Text style={{ fontSize: '20px' }}>Vui lòng nhập cả mã hóa đơn và số điện thoại để tìm kiếm!</Text>}
        </div>
    );
};

export default Tracking;
