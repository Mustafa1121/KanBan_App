import React, { useEffect , useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/AuthUtils'
import Loading from '../../components/common/Loading'
import { Box, Container } from '@mui/system'
import assets from '../../assets'

function AuthLayout() {
  const navigate = useNavigate()
  const Location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuthenticated()
      if(!isAuth){
        setLoading(false)
      }else{
        navigate('/')
      }
    }

    checkAuth()


  }, [navigate])
  return (
    loading ? (
      <Loading fullHeight />
    ): (
      <Container component='main' maxWidth='xs'>
        <Box sx={{
          marginTop:8,
          display:'flex',
          alignItems:'center',
          flexDirection:'column'
        }}>
          <img src={assets.images.logoDark} style={{width:'100px'}} alt='App Logo' />
          <Outlet />
        </Box>
      </Container>
    )
  )
}

export default AuthLayout