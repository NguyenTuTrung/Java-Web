import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Logout = () => {
    const nevigate = useNavigate()
    useEffect(() => {
        localStorage.clear();
        // window.location.reload();
        nevigate("/")
    }, []);
    return (
        <>
        </>
    )
}
export default Logout