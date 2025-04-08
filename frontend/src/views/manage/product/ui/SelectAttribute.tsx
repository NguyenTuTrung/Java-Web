import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSelectedOption } from '../../../../store/slices/producSlices/selectedOptionsSlice';
import UiSelect from './UiSelect';
import AddAttribute from './AddAttribute';
import { useAppContext } from '@/store/ProductContext';

type Attribute = {
    label?: string;
    lableAddAttribute?:string;
    url?: string;
    placeholder?: string;
    linksAddAttribute?: any;
};

interface ChildComponentProps {
    attribute: Attribute[];
}

type DataAttribute = {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
};

const SelectAttribute: React.FC<ChildComponentProps> = ({ attribute }) => {
    const [data, setData] = useState<DataAttribute[][]>(Array(attribute.length).fill([]));
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();



    const fetchData = useCallback(async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url);
            return response.data as DataAttribute[];
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Đã xảy ra lỗi khi tải dữ liệu.");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const loadData = async (index: number) => {
        if (attribute[index]?.url) {
            const fetchedData = await fetchData(attribute[index].url);
            setData(prevData => {
                const newData = [...prevData];
                newData[index] = fetchedData;
                return newData;
            });
        }
    };

    useEffect(() => {
        const initialLoadData = async () => {
            await Promise.all(
                attribute.map((item, index) => item.url ? fetchData(item.url).then(data => setData(prev => {
                    const newData = [...prev];
                    newData[index] = data;
                    return newData;
                })) : Promise.resolve([]))
            );
        };
        initialLoadData();
    }, [attribute, fetchData]);

    const { properties, setProperties } = useAppContext();

    const handleSelectChange = (itemIndex: number, selectedOption: DataAttribute) => {
        dispatch(setSelectedOption({
            id: `${itemIndex}`,
            label: attribute[itemIndex]?.label || '',
            value: selectedOption

        }));
        let key = attribute[itemIndex]?.label || ''
        setProperties((prevProperties) => ({
            ...prevProperties,
            [key]: selectedOption
        }));
    };



    const handleContainerClick = (index: number) => {
        loadData(index); // Load data when the container is clicked
    };

    return (
        <div>
            {/* {loading && <p>Loading...</p>} */}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-wrap ">
                {attribute.map((item, index) => (
                    <div
                        key={index}
                        className="w-full md:w-1/3 p-2"
                        onClick={() => handleContainerClick(index)} // Trigger load data on click
                    >
                        <label htmlFor={`select-addAttribute-${index}`} className="block text-base font-medium text-gray-700">
                            {item.lableAddAttribute}
                        </label>
                        <div className="grid grid-flow-row-dense grid-cols-7 items-center">
                            <div className="col-span-6">
                                <UiSelect
                                    idSelect={`select-addAttribute-${index}`}
                                    placeholder={item.placeholder}
                                    options={
                                        data[index]
                                            ?.filter(dataAttribute => !dataAttribute.deleted)
                                            .sort((a, b) => b.id - a.id)
                                            .map(dataAttribute => ({
                                                label: dataAttribute.name,
                                                value: dataAttribute,
                                            })) || []
                                    }
                                    onChange={(selectedOption) => handleSelectChange(index, selectedOption.value)}
                                />
                            </div>
                            <div>
                                <AddAttribute labelAddAttribute={item.label} linksAddAttribute={item.linksAddAttribute} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && !loading && <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>}
        </div>
    );
};

export default SelectAttribute;
