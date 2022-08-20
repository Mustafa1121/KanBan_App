import React, { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import {Link, useNavigate} from 'react-router-dom'
import authApi from '../api/AuthApi'

function Signup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [usernameErrMessage, setusernameErrMessage] = useState('')
    const [passErrMessage, setpassErrMessage] = useState('')
    const [CpassErrMessage, setCpassErrMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCpassErrMessage('')
        setpassErrMessage('')
        setusernameErrMessage('')

        const data = new FormData(e.target)
        const username = data.get('username').trim()
        const password = data.get('password').trim()
        const confirmPassword = data.get('confirmPassword').trim()
        
        let err = false
        if(username === ''){
            err=true
            setusernameErrMessage('Please fill this field')
        }
        if(password === ''){
            err=true
            setpassErrMessage('Please fill this field')
        }
        if(confirmPassword === ''){
            err=true
            setCpassErrMessage('Please fill this field')
        }
        if(password !== confirmPassword){
            err=true
            setCpassErrMessage("Confirm password not match")
        }

        if(err) return

        setLoading(true)
        
        try{
            const res = await authApi.signup({
                username,
                password,
                confirmPassword
            })
            setLoading(false)
            localStorage.setItem('token',res.token)
            navigate('/')
        }catch(errr){
           const errors = errr.data.erros
            errors.forEach(e => {
                if(e.param === 'username'){
                    setusernameErrMessage(e.msg)
                }
                if(e.param === 'password'){
                    setpassErrMessage(e.msg)
                }
                if(e.param === 'confirmPassword'){
                    setCpassErrMessage(e.msg)
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
          <TextField
            margin='normal'
            required
            fullWidth
            id='confirmPassword'
            label='Confirm Password'
            name='confirmPassword'
            type='password'
            disabled={loading}
            error={CpassErrMessage !== ''}
            helperText={CpassErrMessage}
          />
          <LoadingButton sx={{
            mt:3,
            mb:2
          }} variant='outlined' fullWidth color='success' type='submit' loading={loading}>

          Sign Up
          </LoadingButton>
        </Box>
        <Button component={Link} to='/login' sx={{textTransform:'none'}}>
          Already Have an account? Login
        </Button>
    </>
  )
}

export default Signup