import { useEffect } from 'react'
import SignInForm from './SignInForm'
import useAuth from '@/utils/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const {authenticated} = useAuth()
    const nevigate = useNavigate();

    useEffect(() => {
        const authData = localStorage.getItem("admin");
        if (authData) {
            try {
                // Phân tích chuỗi JSON và lấy token
                const parsedAuthData = JSON.parse(JSON.parse(authData).auth);
                const authority: string[] = parsedAuthData.user.authority ?? []
                console.log(authority)
                if(authenticated && authority.includes("ROLE_ADMIN")){
                    console.log("ROLE_ADMIN REDIRECT")
                    nevigate("/admin/manage/home")
                }
                else if(authenticated && authority.includes("ROLE_USER")){
                    console.log("ROLE_USER REDIRECT")
                    nevigate("/")
                }
                else {
                    console.log("UNKNOWN REDIRECT")
                    nevigate("/auth/sign-in")
                }

            } catch (error) {
                console.error("Failed to parse token:", error);
            }
        }

        console.log("FROM AuthorRouteComponent authenticated: ", authenticated)
    }, [authenticated]);
    
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Chào mừng trở lại!</h3>
                <p>Vui lòng nhập thông tin đăng nhập của bạn để đăng nhập!</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
