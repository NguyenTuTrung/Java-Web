import React, { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';
import Select, { StylesConfig } from 'react-select';
import axios from 'axios';
import { useAppContext } from '@/store/ProductContext';
import instance from "@/axios/CustomAxios";

interface ColourOption {
    id: number;
    createdDate: string;
    updatedDate: string;
    code: string;
    name: string;
    deleted: boolean;
}

const colourStyles: StylesConfig<ColourOption, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.name); // Thay đổi ở đây
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? color.css() // Sử dụng màu đậm hơn
                    : isFocused
                        ? color.alpha(0.5).css() // Thay đổi alpha cho màu đậm
                        : undefined,
            color: isDisabled
                ? '#ccc'
                : isSelected
                    ? chroma.contrast(color, 'white') > 2
                        ? 'white'
                        : 'black'
                    : data.name + 1,
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled
                    ? isSelected
                        ? data.name
                        : color.alpha(0.3).css()
                    : undefined,
            },
        };
    },
    multiValue: (styles, { data }) => {
        const color = chroma(data.name);
        return {
            ...styles,
            backgroundColor: color.alpha(0.6).css(),
            border: `2px solid ${color.alpha(1).css()}`, // Add border
            borderRadius: '4px', // Optional: add border radius
        };
    },
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: data.name + 1,
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: 'red',
        ':hover': {
            backgroundColor: 'red',
            color: 'white',
        },
    }),
};

const ColourSelect = ({ url }) => {
    const [options, setOptions] = useState<ColourOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await instance.get(url);
            const formattedData = response.data.map((item) => ({
                ...item,
                label: item.name,
                value: item,
            }));
            setOptions(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Đã xảy ra lỗi khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (url) {
            fetchData(url);
        }
    }, [fetchData, url]);

    const { properties, setProperties } = useAppContext();

    const handleChange = (selected: ColourOption[]) => {
        setProperties((prevProperties) => ({
            ...prevProperties,
            colors: selected.map(option => option.value)
        }));
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading colors...</p>}
            <Select
                closeMenuOnSelect={false}
                isMulti
                options={options}
                styles={colourStyles} // Ensure this line is uncommented
                placeholder="Color..."
                onChange={handleChange}
                isDisabled={loading}
            />
        </div>
    );
};

export default ColourSelect;
