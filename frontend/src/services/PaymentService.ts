import instance from '@/axios/CustomAxios'

const getUrlPayment = async (idOrder: number) => {
    try {
        return await instance.get('/payment/vn-pay',
            {
                params: {
                    "amount": 3000000,
                    "currency": 'VND',
                    "returnUrl": `http://localhost:5173/admin/manage/payment/callback?id=${idOrder}`
                }
            });
    } catch (error) {
        console.error('Error fetching payment URL:', error); // Handle any errors
    }
};

export {
    getUrlPayment
};
