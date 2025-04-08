
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { Input } from 'antd';
import instance from "@/axios/CustomAxios";

type ICustomer = {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
};

type CustomerTableProps = {
    onSelectedCustomersChange: (selectedCustomers: ICustomer[]) => void;
    selectedCustomerIds: number[];
};

const CustomerTable = ({ onSelectedCustomersChange, selectedCustomerIds }: CustomerTableProps) => {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerIdsState, setSelectedCustomerIdsState] = useState<number[]>(selectedCustomerIds);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const customersPerPage = 10;

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const res = await instance.get(`/customer?page=${currentPage}&size=${customersPerPage}`);
                const { content, totalPages } = res.data;
                setCustomers(
                    content.map((customer: any) => ({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                    }))
                );
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [currentPage]);

    const handleSelectCustomer = useCallback((customerId: number) => {
        setSelectedCustomerIdsState((prevSelected) =>
            prevSelected.includes(customerId)
                ? prevSelected.filter((id) => id !== customerId)
                : [...prevSelected, customerId]
        );
    }, []);

    useEffect(() => {
        setSelectedCustomerIdsState(selectedCustomerIds);
    }, [selectedCustomerIds]);

    useEffect(() => {
        if (selectedCustomerIdsState.length === selectedCustomerIds.length) return; // Prevent unnecessary updates
        const selectedCustomers = customers.filter((customer) =>
            selectedCustomerIdsState.includes(customer.id)
        );
        onSelectedCustomersChange(selectedCustomers);
    }, [selectedCustomerIdsState, customers, onSelectedCustomersChange]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) =>
            (customer.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.email ?? '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="overflow-x-auto">
            {/* Search Input */}
            <div className="mb-4">
                <div style={{ position: 'relative', width: '500px' }}>
                    <IoIosSearch
                        style={{
                            color: 'black',
                            position: 'absolute',
                            left: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '20px',
                            pointerEvents: 'none',
                        }}
                    />
                    <Input
                        placeholder="Tìm kiếm theo tên, email, số điện thoại,..."
                        style={{
                            width: '100%',
                            height: '37px',
                            paddingLeft: '30px',
                            boxSizing: 'border-box',
                        }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading customers...</p>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-b from-gray-100 to-gray-200 border-b-2 border-gray-300">
                        <tr>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                                Chọn
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Tên
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Số điện thoại
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition duration-200 ease-in-out border-b last:border-b-0 border-gray-200">
                                <td className="px-4 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomerIdsState.includes(customer.id)}
                                        onChange={() => handleSelectCustomer(customer.id)}
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                                    />
                                </td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.name || 'N/A'}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.email || 'N/A'}</td>
                                <td className="border-b border-gray-300 px-4 py-2">{customer.phone || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`cursor-pointer ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600'}`}
                >
                    Trước
                </div>

                <span>{`Trang ${currentPage} trên ${totalPages}`}</span>

                <div
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`cursor-pointer ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-600'}`}
                >
                    Sau
                </div>
            </div>
        </div>


    );
};

export default CustomerTable;