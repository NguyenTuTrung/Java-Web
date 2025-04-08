import React from 'react';
import Select from '@/components/ui/Select';

interface Option {
    label: string;
    value: number;
}

interface ChildComponentProps {
    placeholder?: string;
    idSelect?: string;
    options?: Array<Option>;
    onChange?: (value: number) => void; // Thêm prop onChange
}

const UiSelect: React.FC<ChildComponentProps> = ({ placeholder, idSelect, options = [], onChange }) => {
    const handleChange = (selectedOption: Option | null) => {
        if (selectedOption && onChange) {
            onChange(selectedOption); // Gọi onChange với toàn bộ đối tượng đã chọn
        }
    };

    return (
        <Select
            id={idSelect}
            placeholder={placeholder}
            options={options}
            className="!z-100"
            size='sm'
            onChange={handleChange}
        />
    );
};

export default UiSelect;




