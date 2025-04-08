import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import Theme from '@/components/template/Theme';
import Layout from '@/components/layouts';
import './locales';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


/**
 * Đặt enableMock(Default false) thành true tại configs/app.config.js
 * Nếu bạn muốn kích hoạt mock api
 */



function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Theme>
                        <Layout />
                    </Theme>
                    <ToastContainer /> {/* Thêm ToastContainer ở đây */}
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
