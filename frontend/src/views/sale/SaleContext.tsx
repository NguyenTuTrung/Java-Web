import { ReactNode, createContext, useContext, useState, useEffect, SetStateAction } from 'react'
import instance from "@/axios/CustomAxios";
import { CartDetailResponseDTO, CartResponseDTO } from '@/views/sale/index'


type AppContextType = {
    selectedCart: CartResponseDTO | undefined,
    isOpenCartDrawer: boolean;
    setIsOpenCartDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    myCartId: number | undefined;
    setMyCartId: React.Dispatch<React.SetStateAction<number | undefined>>;
    listCartDetailResponseDTO: CartDetailResponseDTO[],
    setListCartDetailResponseDTO:  React.Dispatch<React.SetStateAction<CartDetailResponseDTO[]>>
    getCartDetailInCard: () => void;
    fetchDataMyCart: () => Promise<void>;
};

const SaleContext = createContext<AppContextType>({
    isOpenCartDrawer: false,
    setIsOpenCartDrawer: () => {
    },
    myCartId: undefined,
    setMyCartId: () => {
    },
    listCartDetailResponseDTO: [],
    setListCartDetailResponseDTO: () => {
    },
    getCartDetailInCard: () => {},
    selectedCart: undefined,
    fetchDataMyCart: async () => {},
});

const SaleProvider = ({children}: { children: ReactNode }) => {
    const [isOpenCartDrawer, setIsOpenCartDrawer] = useState<boolean>(false)
    const [myCartId, setMyCartId] = useState<number | undefined>(Number(localStorage.getItem("myCartId")) ?? undefined)
    const [listCartDetailResponseDTO, setListCartDetailResponseDTO] = useState<CartDetailResponseDTO[]>([])
    const [selectedCart, setSelectedCart] = useState<CartResponseDTO>()
    
    
    const getCartDetailInCard = () => {
        instance.get(`cart-details/in-cart/${myCartId}`).then(function (response){
            console.log(response)
            if (response?.data) {
                setListCartDetailResponseDTO(response?.data)
            }
        })
    }
    const fetchDataMyCart = async () => {
        if (myCartId === undefined || myCartId === 0) {
            console.log("Cart không tồn tại")
        } else {
            await instance.get(`/cart/check-cart-active/${myCartId.toString()}`).then(function (response) {
                console.log(response)
                if(response.status === 200){
                    setSelectedCart(response.data)
                }

            }).catch(function (error) {
                console.log("Lấy dữ liệu cart thất bại")
            });
        }
    }
    useEffect(() => {
        if (isOpenCartDrawer) {
            getCartDetailInCard()
        }
    }, [isOpenCartDrawer]);

    const createNewCart = async () => {
        const response = await instance.get("/cart/new-cart")
        console.log(response)
        if (response.data?.id) {
            // check valid cart
            localStorage.setItem('myCartId', response.data?.id.toString());
            setMyCartId(response.data?.id)
        }
    }

    useEffect(() => {
        if (myCartId === undefined || myCartId === 0) {
            console.log("Xóa cart id ở context")
            localStorage.removeItem('myCartId'); // Xóa nếu `myCartId` là undefined
            createNewCart();
        } else {
            localStorage.setItem('myCartId', myCartId.toString());
            instance.get(`/cart/check-cart-active/${myCartId.toString()}`).then(function (response) {
                console.log(response)
                if(response.status === 200){
                    setSelectedCart(response.data)
                }

            }).catch(function (error) {
                console.log(error);
                if (error.response && error.response.status === 400) {
                    createNewCart();
                }
            });
        }
    }, [myCartId]);

    return (
        <SaleContext.Provider value={{selectedCart, getCartDetailInCard, listCartDetailResponseDTO, setListCartDetailResponseDTO, isOpenCartDrawer, setIsOpenCartDrawer, myCartId, setMyCartId, fetchDataMyCart}}>
            {children}
        </SaleContext.Provider>
    );
};

export const useSaleContext = () => useContext(SaleContext);

export default SaleProvider;
