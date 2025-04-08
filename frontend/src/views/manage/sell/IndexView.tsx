import React, { Fragment, Suspense, lazy } from "react";
import { Loading } from '@/components/shared'

// Dynamically import components using React.lazy
const SellHeader = lazy(() => import("./SellHeader"));
const SellBody = lazy(() => import("./SellBody"));

const IndexView = () => {
    return (
        <Fragment>
            {/* // header */}
            <Suspense fallback={<Loading type={"cover"} loading={true}/>}>
                <SellHeader />
                {/**/}
                <SellBody />
            </Suspense>
        </Fragment>
    );
}

export default IndexView;
