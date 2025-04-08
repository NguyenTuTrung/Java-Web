import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { HiEye, HiTrash } from 'react-icons/hi';
import { updateProductImagesByColor } from '../store';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Dialog from '@/components/ui/Dialog';
import Upload from '@/components/ui/Upload';
import DoubleSidedImage from '@/components/shared/DoubleSidedImage';
import { Image } from '../store'; // Đảm bảo kiểu Image được định nghĩa đúng trong project của bạn

type ProductImagesProps = {
    colorName: string; // Tên màu sắc của sản phẩm
};

const ImageList = ({ imgList, onImageDelete }: { imgList: Image[]; onImageDelete: (img: Image) => void }) => {
    const [selectedImg, setSelectedImg] = useState<Image | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const onViewOpen = (img: Image) => {
        setSelectedImg(img);
        setViewOpen(true);
    };

    const onDialogClose = () => {
        setViewOpen(false);
        setTimeout(() => setSelectedImg(null), 300);
    };

    const onDeleteConfirmation = (img: Image) => {
        setSelectedImg(img);
        setDeleteConfirmationOpen(true);
    };

    const onDeleteConfirmationClose = () => {
        setSelectedImg(null);
        setDeleteConfirmationOpen(false);
    };

    const onDelete = () => {
        if (selectedImg) {
            onImageDelete(selectedImg);
        }
        setDeleteConfirmationOpen(false);
    };

    return (
        <>
            {imgList.map((img) => (
                <div key={img.id} className="group relative rounded border p-2 flex justify-center items-center">
                    <img
                        className="rounded object-cover max-h-[120px] max-w-full"
                        src={img.url}
                        alt={img.url}
                    />
                    <div className="absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(img)}
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(img)}
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>
            ))}
            <Dialog isOpen={viewOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">{selectedImg?.code}</h5>
                <img className="w-full" src={selectedImg?.url} alt={selectedImg?.url} />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Xóa ảnh"
                cancelText='HỦY'
                confirmText='XÁC NHẬN'
                confirmButtonColor="red-600"
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Bạn có chắc chắn muốn xóa hình ảnh này không? </p>
            </ConfirmDialog>
        </>
    );
};

const ProductImages = ({ colorName }: ProductImagesProps) => {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.dataDetailedProduct.detailedProduct.data);

    // Tìm tất cả các sản phẩm có màu sắc tương ứng
    const matchingProducts = products.filter(product => product.color?.name === colorName);

    // Ensure productImages is always an array
    const productImages = matchingProducts[0]?.images ?? [];

    const [loading, setLoading] = useState(false); // Thêm state loading

    const beforeUpload = (file: FileList | null) => {
        const allowedFileTypes = ['image/jpeg', 'image/png'];
        const maxFileSize = 500000; // 500KB

        if (file) {
            for (const f of file) {
                if (!allowedFileTypes.includes(f.type)) {
                    return 'Vui lòng tải lên tệp .jpeg hoặc .png!';
                }
                if (f.size >= maxFileSize) {
                    return 'Tải lên hình ảnh không được vượt quá 500KB!';
                }
            }
        }
        return true;
    };

    const handleUpload = async (files: File[] | null) => {
        if (!files || files.length === 0) return;

        setLoading(true); // Bật loading khi bắt đầu upload

        // Lấy file mới nhất (file cuối cùng trong mảng)
        const file = files[files.length - 1];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/api/v1/image/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Không tải được hình ảnh lên');
            }

            const imageUrl = await response.text(); // URL ảnh trả về từ backend

            const newImage = {
                id: Date.now(), // ID duy nhất
                code: file.name, // Tên file làm mã ảnh
                url: imageUrl,   // URL ảnh sau khi upload
                deleted: false,
                createdDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString(),
            };

            const updatedImages = [
                ...productImages.filter(img => !img.deleted),  // Loại bỏ ảnh bị xóa
                ...productImages.some(existingImg => existingImg.code === newImage.code && !existingImg.deleted)
                    ? []  // Nếu đã tồn tại ảnh cùng mã, không thêm mới
                    : [newImage] // Thêm ảnh mới vào danh sách
            ];

            dispatch(updateProductImagesByColor({ colorName, images: updatedImages }));
        } catch (error) {
            console.error("Error uploading image:", error);
            // Có thể thêm thông báo lỗi ở đây 
        } finally {
            setLoading(false); // Tắt loading khi upload hoàn thành
        }
    };


    const handleImageDelete = (deletedImg: Image) => {
        const updatedImages = productImages.filter(img => img.id !== deletedImg.id);
        dispatch(updateProductImagesByColor({ colorName, images: updatedImages }));
    };

    return (
        <div className="mb-4 grid">
            <div className="text-center">
                <h5 className='mb-3'>Thêm ảnh cho sản phẩm màu {colorName} </h5>
                {productImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* Hiển thị danh sách ảnh nếu có */}
                        <ImageList imgList={productImages} onImageDelete={handleImageDelete} />

                        {/* Upload mới ảnh */}
                        <Upload
                            draggable
                            beforeUpload={beforeUpload}
                            showList={false}
                            onChange={(info) => handleUpload(info)} // Assuming `info` is an array of `File`
                        >
                            <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                <DoubleSidedImage
                                    src="/img/others/upload.png"
                                    darkModeSrc="/img/others/upload-dark.png"
                                />
                                {loading ? (
                                    <div className="mt-4">Đang tải...</div> // Hiển thị thông báo "Đang tải" hoặc spinner
                                ) : (
                                    <p className="font-semibold text-center text-gray-800 dark:text-white">Tải lên </p>
                                )}
                            </div>
                        </Upload>
                    </div>
                ) : (
                    <Upload
                        draggable
                        beforeUpload={beforeUpload}
                        showList={false}
                        onChange={(info) => handleUpload(info)}
                    >
                        <div className=" text-center">
                            <DoubleSidedImage
                                className="mx-auto"
                                src="/img/others/upload.png"
                                darkModeSrc="/img/others/upload-dark.png"
                            />
                            {loading ? (
                                <div className="mt-4">Đang tải...</div> // Hiển thị thông báo "Đang tải" hoặc spinner
                            ) : (
                                <>
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Thả hình ảnh của bạn ở đây, hoặc{' '}
                                        </span>
                                        <span className="text-blue-500">duyệt</span>
                                    </p>
                                    <p className="mt-1 opacity-60 dark:text-white">
                                        Hỗ trợ: jpeg, png
                                    </p>
                                </>
                            )}
                        </div>
                    </Upload>
                )}
            </div>
        </div>
    );
};

export default ProductImages;
