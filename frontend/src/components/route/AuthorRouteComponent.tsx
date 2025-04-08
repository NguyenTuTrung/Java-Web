import {Outlet, useNavigate} from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import {useEffect} from "react";


const AuthorRouteComponent = () => {
    // const {authenticated} = useAuth()
    // const nevigate = useNavigate();

    // useEffect(() => {
    //     const authData = localStorage.getItem("admin");
    //     if (authData) {
    //         // try {
    //         //     // Phân tích chuỗi JSON và lấy token
    //         //     const parsedAuthData = JSON.parse(JSON.parse(authData).auth);
    //         //     const authority: string[] = parsedAuthData.user.authority ?? []
    //         //     console.log(authority)
    //         //     if(authenticated && authority.includes("ROLE_ADMIN")){
    //         //         console.log("ROLE_ADMIN REDIRECT")
    //         //         nevigate("/admin/manage/home")
    //         //     }
    //         //     else if(authenticated && authority.includes("ROLE_USER")){
    //         //         console.log("ROLE_USER REDIRECT")
    //         //         nevigate("/")
    //         //     }
    //         //     else {
    //         //         console.log("UNKNOWN REDIRECT")
    //         //         nevigate("/auth/sign-in")
    //         //     }

    //         // } catch (error) {
    //         //     console.error("Failed to parse token:", error);
    //         // }
    //     }

    //     console.log("FROM AuthorRouteComponent authenticated: ", authenticated)
    // }, [authenticated]);

    return <Outlet/>
    // return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default AuthorRouteComponent
