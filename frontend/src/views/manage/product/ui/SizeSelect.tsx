import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // Nếu cần sử dụng redux
import { useAppContext } from '@/store/ProductContext';
import instance from "@/axios/CustomAxios";

const animatedComponents = makeAnimated();

interface ChildComponentProps {
    urlSize: string; // Đường dẫn API
}

type DataAttribute = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

const SizeSelect: React.FC<ChildComponentProps> = ({ urlSize }) => {
    const [data, setData] = useState<DataAttribute[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch(); // Khởi tạo dispatch nếu cần

    const fetchData = useCallback(async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(url);
            const formattedData = response.data.map((item: DataAttribute) => ({
                label: item.name,
                value: item,
            }));
            return formattedData; // Trả về dữ liệu đã định dạng
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Đã xảy ra lỗi khi tải dữ liệu.");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (urlSize) {
                const result = await fetchData(urlSize); // Gọi hàm fetchData
                setData(result); // Lưu dữ liệu vào state
            }
        };

        loadData(); // Gọi hàm tải dữ liệu
    }, [fetchData, urlSize]);

    const { properties, setProperties } = useAppContext();

    const handleChange = (selected: { value: DataAttribute }[]) => {
        // console.log("Selected sizes:", selected);
        setProperties((prevProperties) => ({
            ...prevProperties,
            sizes: selected.map(option => option.value) // Chỉ lấy giá trị DataAttribute
        }));
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                onChange={handleChange}
                options={data} // Sử dụng dữ liệu đã chuyển đổi
                isDisabled={loading} // Vô hiệu hóa Select khi đang tải
                placeholder="Chọn kích thước..."
            />
        </div>
    );
};

export default SizeSelect;
