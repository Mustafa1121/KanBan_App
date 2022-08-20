import AuthApi from '../api/AuthApi'

const authUtils = {
    isAuthenticated : async () => {
        const token = localStorage.getItem('token')
        if(!token) return false
        try{
            const res = await AuthApi.verifyToken()
            return res.user
        }catch{
            return false
        }
    }
}

export default authUtils