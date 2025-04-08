import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Upload from '@/components/ui/Upload';
import { HiOutlinePlus } from 'react-icons/hi';
import { MdDeleteOutline } from "react-icons/md";
const ProductImage = () => {
    const [avatarImgs, setAvatarImgs] = useState<{ name: string; url: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const uploadLimit = 5; // Giới hạn số lượng ảnh

    const onFileUpload = (files: File[]) => {
        if (files.length > 0) {
            const newImages = Array.from(files).map(file => {
                const imgUrl = URL.createObjectURL(file);
                return { name: file.name, url: imgUrl };
            });

            const uniqueImages = newImages.filter(newImg =>
                !avatarImgs.some(existingImg => existingImg.name === newImg.name)
            );

            const totalImages = avatarImgs.length + uniqueImages.length;

            // Kiểm tra xem tổng số hình ảnh có vượt quá giới hạn không
            if (totalImages > uploadLimit) {
                // Tính toán số lượng hình ảnh có thể thêm vào
                const excess = totalImages - uploadLimit;
                // Giới hạn số hình ảnh được thêm vào
                uniqueImages.splice(-excess); // Xóa bớt hình ảnh vượt quá giới hạn
                setError(`Một số ảnh không được thêm do vượt quá giới hạn: ${uploadLimit}`);
            } else {
                setError(null);
            }

            if (uniqueImages.length > 0) {
                setAvatarImgs(prev => [...prev, ...uniqueImages]);
            }
        }
    };


    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true;
        const allowedFileType = ['image/jpeg', 'image/png'];

        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    return 'Please upload a .jpeg or .png file!';
                }
            }

            const totalImages = avatarImgs.length;
            if (totalImages >= uploadLimit) {
                return `Không thể thêm! Tổng số ảnh đã đạt giới hạn: ${uploadLimit}`;
            }
        }

        return valid;
    };

    const handleDelete = (urlToDelete: string) => {
        setAvatarImgs(prev => {
            const newList = prev.filter(img => img.url !== urlToDelete);
            if (newList.length < prev.length) {
                URL.revokeObjectURL(urlToDelete);
                console.log("Ảnh hiện tại sau khi xóa:", newList);
            }
            return newList;
        });
    };

    return (
        <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-br from-[#1E5B53] to-[#CCFFAA] text-white shadow-gray-900/20 shadow-lg mb-10 p-6">
            <h3 className="block antialiased tracking-normal font-sans text-xl font-bold leading-relaxed text-white text-center">
                Hình ảnh
            </h3>
            {error && (
                <div className="text-red-500 text-center mb-4">
                    {error}
                </div>
            )}
            <div className="flex flex-wrap justify-center">
                {avatarImgs.map((img, index) => (
                    <div key={index} className="relative m-2">
                        <Avatar size={80} src={img.url} />
                        <div
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition cursor-pointer"
                            onClick={() => handleDelete(img.url)}
                            aria-label="Delete image"
                        >
                            <MdDeleteOutline />
                        </div>
                    </div>
                ))}
                {/* Ẩn nút thêm ảnh nếu số lượng ảnh đã đạt giới hạn */}
                {avatarImgs.length < uploadLimit && (
                    <div className="m-2">
                        <Upload
                            className="cursor-pointer"
                            showList={false}
                            uploadLimit={uploadLimit}
                            multiple
                            beforeUpload={beforeUpload}
                            onChange={onFileUpload}
                        >
                            <Avatar size={80} icon={<HiOutlinePlus />} />
                        </Upload>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImage;
