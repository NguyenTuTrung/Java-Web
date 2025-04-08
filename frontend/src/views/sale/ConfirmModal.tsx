import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    message = "Bạn có chắc chắn muốn đặt hàng này không?",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
                <p className="mb-4 text-lg">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
