import { useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { FormItem } from '@/components/ui/Form'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import { HiEye, HiTrash } from 'react-icons/hi'
import cloneDeep from 'lodash/cloneDeep'
import { Field, FieldProps, FieldInputProps, FormikProps } from 'formik'
import { Image } from '../store';


type FormModel = {
    images: Image[]
    [key: string]: unknown
}
 
type ImageListProps = {
    images: Image[]
    onImageDelete: (img: Image) => void
}

type ProductImagesProps = {
    values: FormModel
}

const ImageList = (props: ImageListProps) => {
    const { images, onImageDelete } = props;

    const [selectedImg, setSelectedImg] = useState<Image>({} as Image);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const onViewOpen = (img: Image) => {
        setSelectedImg(img)
        setViewOpen(true)
    }
    const onDialogClose = () => {
        setViewOpen(false)
        setTimeout(() => {
            setSelectedImg({} as Image)
        }, 300)
    }

    const onDeleteConfirmation = (img: Image) => {
        setSelectedImg(img);
        setDeleteConfirmationOpen(true);
    };

    const onDelete = () => {
        onImageDelete?.(selectedImg);
        setDeleteConfirmationOpen(false);
    };

    return (
        <>
            {images.map((img) => (
                <div key={img.id} className="group relative rounded border p-2 flex">
                    <img
                        className="rounded max-h-[140px] max-w-full"
                        src={img.url}
                        alt={img.url}
                    />
                    <div className="absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(img)}  // Mở ảnh xem
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(img)}  // Gọi hàm xác nhận xóa
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>
            ))}

            <Dialog isOpen={viewOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">{selectedImg.code}</h5>
                <img className="w-full" src={selectedImg.url} alt={selectedImg.url} />
            </Dialog>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Xóa ảnh"
                cancelText='HỦY'
                confirmText='XÁC NHẬN'
                confirmButtonColor="red-600"
                onClose={() => setDeleteConfirmationOpen(false)}
                onRequestClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={onDelete}  // Xác nhận xóa ảnh
            >
                <p>Bạn có chắc chắn muốn xóa hình ảnh này không? </p>
            </ConfirmDialog>
        </>
    );
};


const ProductDetailImages = (props: ProductImagesProps) => {
    const { values } = props
    const [loading, setLoading] = useState(false);
    const beforeUpload = (file: FileList | null) => {
        let valid: boolean | string = true

        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Vui lòng tải lên tệp .jpeg hoặc .png!'
                }

                if (f.size >= maxFileSize) {
                    valid = 'Tải lên hình ảnh không được vượt quá 500KB!'
                }
            }
        }

        return valid
    }

    const onUpload = async (
        form: FormikProps<FormModel>,
        field: FieldInputProps<FormModel>,
        files: File[]
    ) => {
        if (!files || files.length === 0) return;

        setLoading(true);
        const latestFile = files[files.length - 1]; // Chọn file mới nhất trong danh sách

        const formData = new FormData();
        formData.append("file", latestFile);

        try {
            const response = await fetch("http://localhost:8080/api/v1/image/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Không tải được hình ảnh lên');
            }

            const imageUrl = await response.text();
            const image = { 
                id: Date.now(),
                code: latestFile.name,
                url: imageUrl,
                deleted: false,
                createdDate: new Date().toISOString(),
                modifiedDate: new Date().toISOString(),
            }
            const updatedImageList = [...values.images, ...[image]];

            form.setFieldValue(field.name, updatedImageList);
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleImageDelete = (
        form: FormikProps<FormModel>,
        field: FieldInputProps<FormModel>,
        deletedImg: Image
    ) => {
        let updatedImages = values.images.filter((img) => img.id !== deletedImg.id);
        form.setFieldValue(field.name, updatedImages);
    }


    return (
        <AdaptableCard className="mb-4">
            <h5>Ảnh sản phẩm </h5>
            <FormItem>
                <Field name="images">
                    {({ field, form }: FieldProps) => {
                        return (
                            <div>
                                {values.images.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                        <ImageList
                                            images={values.images}
                                            onImageDelete={(img: Image) => handleImageDelete(form, field, img)}
                                        />
                                        <Upload
                                            draggable
                                            beforeUpload={beforeUpload}
                                            showList={false}
                                            onChange={(files) => onUpload(form, field, files)}
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
                                        onChange={(files) => onUpload(form, field, files)}
                                    >
                                        <div className="my-16 text-center">
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
                        );
                    }}
                </Field>
            </FormItem>

        </AdaptableCard>
    )
}

export default ProductDetailImages
