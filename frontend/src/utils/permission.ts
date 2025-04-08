import useAuthority from '@/utils/hooks/useAuthority'
import { useAppSelector } from '@/store'

const useHasRole = (authority: string[] = []) => {
    const userAuthority = useAppSelector((state) => state.auth.user.authority)
    console.log("USER ROLE: ", userAuthority)
    return useAuthority(userAuthority, authority);
};

export { useHasRole };