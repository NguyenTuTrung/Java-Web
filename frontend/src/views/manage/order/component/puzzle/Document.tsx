import { Footnote, PageBottom, Tailwind } from "@fileforge/react-print";
import { OrderResponseDTO } from "../../../../../@types/order";
const Document = ({ billDTO }: { billDTO: OrderResponseDTO }) => {
    return (
        <Tailwind>
            <div>
                <div className="flex justify-between items-end pb-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Hoá đơn #{billDTO.code}</h1>
                        <p className="text-xs">22-09-2024</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="p-0 mb-1">Số 1, Trịnh Văn Bô</p>
                    <p className="p-0 mb-1">Cao đẳng FPT Hà Nội</p>
                    <p className="p-0 mb-1">Hà nội, Việt Name</p>
                </div>

                <div className="h-px bg-gray-300 my-4" />

                <div>
                    <p className="p-0 mb-1">
                        <b>Gửi đến:</b>
                    </p>
                    <p className="p-0 mb-1">Người nhận: {billDTO.customerResponseDTO.name}</p>
                    <p className="p-0 mb-1">Địa chỉ: {billDTO.address}</p>
                    <p className="p-0 mb-1">Số điện thoại: {billDTO.phone}</p>
                </div>

                <div className="h-px bg-gray-300 my-4" />

                <table className="w-full my-12 text-[13px]">
                    <tr className="border-b border-gray-300">
                        <th className="text-left font-bold py-2">#</th>
                        <th className="text-left font-bold py-2">Mã</th>
                        <th className="text-left font-bold py-2">Tên</th>
                        <th className="text-left font-bold py-2">Màu</th>
                        <th className="text-left font-bold py-2">Cỡ</th>
                        <th className="text-left font-bold py-2">Số lượng</th>
                        <th className="text-left font-bold py-2">Tiền</th>
                    </tr>
                    {
                        billDTO.orderDetailResponseDTOS.map((item, index) => {
                            return (
                                <tr className="border-b border-gray-300">
                                    <td className="py-2">{index + 1}</td>
                                    <td className="py-2">{item.productDetail.code}</td>
                                    <td className="py-2">{item.productDetail.name}</td>
                                    <td className="py-2">{item.productDetail.color.name}</td>
                                    <td className="py-2">{item.productDetail.size.name}</td>
                                    <td className="py-2">{item.quantity}</td>
                                    <td className="py-2">{item.productDetail.price * item.quantity}</td>
                                </tr>
                            )
                        })
                    }
                </table>

                <div className="bg-blue-100 p-3 rounded-md border-blue-300 text-blue-800 text-sm">
                    Trân thành cảm ơn quý khách
                </div>

                <PageBottom>
                    <div className="h-px bg-gray-300 my-4" />
                    <div className="text-gray-400 text-sm">#{billDTO.code}</div>
                </PageBottom>
            </div>
        </Tailwind>
    );
}

export default Document