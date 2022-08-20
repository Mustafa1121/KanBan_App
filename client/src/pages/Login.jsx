import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import {Link, useNavigate} from 'react-router-dom'
import authApi from '../api/AuthApi'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErrMessage, setusernameErrMessage] = useState('')
  const [passErrMessage, setpassErrMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setpassErrMessage('')
    setusernameErrMessage('')

    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()

    let err = false
    if(username === ''){
        err=true
        setusernameErrMessage('Please fill this field')
    }
    if(password === ''){
        err=true
        setpassErrMessage('Please fill this field')
    }
    if(err) return

        setLoading(true)
        
        try{
            const res = await authApi.login({
                username,
                password
            })
            setLoading(false)
            localStorage.setItem('token',res.token)
            window.location='/'
        }catch(errr){
           const errors = errr.data.erros
            errors.forEach(e => {
                if(e.param === 'username'){
                    setusernameErrMessage(e.msg)
                }
                if(e.param === 'password'){
                    setpassErrMessage(e.msg)
                }
                
            })
            setLoading(false)
        }
  }

  return (
    <>
        <Box component='form' sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Usename'
            name='username'
            disabled={loading}
            error={usernameErrMessage !== ''}
            helperText={usernameErrMessage}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='password'
            label='Password'
            name='password'
            type='password'
            disabled={loading}
            error={passErrMessage !== ''}
            helperText={passErrMessage}
          />
          <LoadingButton sx={{
            mt:3,
            mb:2
          }} variant='outlined' fullWidth color='success' type='submit' loading={loading}>

          Login
          </LoadingButton>
        </Box>
        <Button component={Link} to='/signup' sx={{textTransform:'none'}}>
          Don't have an account? Signup
        </Button>
    </>
  )
}

export default Login