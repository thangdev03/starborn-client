import { Box, Button, Divider, FormControl, Modal, Stack, TextField, Typography, Link, IconButton } from '@mui/material'
import React, { useState } from 'react'
import { colors, serverUrl } from '../../services/const';
import RedButton from '../common/RedButton';
import axios from 'axios';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAuth } from '../../contexts/AuthContext';

const AuthModal = () => {
  const { closeAuthModal, isAuthModalOpen, handleLogin, authToken, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formName, setFormName] = useState('login');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loginValues, setLoginValues] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false
  });

  const registerInputs = [
    {
      id: 1,
      name: 'name',
      label: 'Họ tên',
      type: 'text',
      pattern: '^\\S+.*$',
      helperText: 'Nhập tên của bạn'
    },
    {
      id: 2,
      name: 'phone',
      label: 'Số điện thoại',
      type: 'text',
      pattern: '^\\d{10}$',
      helperText: 'Số điện thoại chưa hợp lệ'
    },
    {
      id: 3,
      name: 'email',
      label: 'Email',
      type: 'email',
      pattern: '[A-Za-z0-9\\._%+\\-]+@[A-Za-z0-9\\.\\-]+\\.[A-Za-z]{2,}',
      helperText: 'Địa chỉ email chưa hợp lệ'
    },
    {
      id: 4,
      name: 'password',
      label: 'Mật khẩu',
      type: 'password',
      pattern: '^.{6,}$',
      helperText: 'Tối thiểu 6 ký tự'
    },
    {
      id: 5,
      name: 'confirmPassword',
      label: 'Nhập lại mật khẩu',
      type: 'password',
      pattern: values.password,
      helperText: 'Chưa khớp với mật khẩu phía trên'
    }
  ];

  const loginInputs = [
    {
      id: 1,
      name: 'emailOrPhone',
      label: 'SĐT/Email',
      type: 'text',
    },
    {
      id: 2,
      name: 'password',
      label: 'Mật khẩu',
      type: 'password',
    },
  ]

  const onChange = (event, inputPattern) => {
    setValues({...values, [event.target.name]: event.target.value});

    if (inputPattern) {
      if (RegExp(inputPattern).test(event.target.value)) {
        setErrors((prev) => ({...prev, [event.target.name]: false}))
      } else {
        setErrors((prev) => ({...prev, [event.target.name]: true}))
      }
    }
  }

  const onChangeLogin = (event) => {
    setLoginValues({...loginValues, [event.target.name]: event.target.value});
  }

  const onSubmitRegister = () => {
    if (Object.values(values).some((value) => value.length === 0)) {
      return alert('Vui lòng nhập đầy đủ các trường!')
    }
    if (Object.values(errors).some((error) => error === true)) {
      return alert('Các trường thông tin chưa đúng yêu cầu!')
    }

    setIsLoading(true)
    axios.post(serverUrl + 'auth/register', {
      fullname: values.name, 
      phone: values.phone, 
      email: values.email, 
      password: values.password
    })
    .then((res) => {
      alert(res.data.message)
      setIsLoading(false);
    })
    .catch(err => {
      // console.log(err);
      alert(err.response?.data?.message)
      setIsLoading(false);
    })
  }

  const onSubmitLogin = async () => {
    if (Object.values(loginValues).some((value) => value.length === 0)) {
      return alert('Vui lòng nhập đầy đủ các trường!');
    }

    await handleLogin(loginValues.emailOrPhone, loginValues.password)
  }

  return formName === 'login' ? (
    <Modal
      open={isAuthModalOpen}
      onClose={closeAuthModal}
      aria-labelledby='modal-title'
    >
      <Stack 
        alignItems={'center'}
        sx={{
          padding: '32px 40px',
          position: 'absolute',
          top: {xs: '0', sm: '50%'},
          left: {xs: '0', sm: '50%'},
          transform: {sm: 'translate(-50%, -50%)'},
          right: {xs: '0', sm: 'auto'},
          bottom: {xs: '0', sm: 'auto'},
          bgcolor: 'white',
          borderRadius: '8px',
          outline: 'none',
          maxHeight: '100vh',
          overflow: 'auto',
          minWidth: { sm: '400px' }
        }}
      >
        <IconButton 
        onClick={closeAuthModal}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4
        }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <Typography variant='h1' fontSize={{xs: '28px', sm: '36px'}} fontWeight={'500'}>Đăng nhập</Typography>
        <Typography fontSize={{xs: '14px', sm: '16px'}} marginTop={'8px'}>Bắt đầu mua sắm tại Starborn</Typography>
        <FormControl
          sx={{
            marginTop: '16px',
            width: '100%'
          }}
        >
          {loginInputs.map((input) => (
            <TextField 
              key={input.id}
              name={input.name}
              label={input.label}
              variant='standard'
              type={input.type}
              value={loginValues[input.name]}
              required
              onChange={onChangeLogin}
              inputProps={{
                pattern: input.pattern,
                autoComplete: 'new-password'
              }}
              sx={{ marginBottom: '20px' }}
            />
          ))}
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography>
              <Link sx={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => setFormName('register')}>Đăng ký</Link> tài khoản mới
            </Typography>
            <Link sx={{ textDecoration: 'none', color: colors.red, cursor: 'pointer' }}>Quên Mật Khẩu?</Link>
          </Stack>
          <Stack marginTop={'20px'} width={'100%'} gap={'12px'}>
            <RedButton 
              title={!isLoading ? 'Đăng nhập' : 'Đang xác minh...'}
              disabled={isLoading}
              onClick={onSubmitLogin}
            />
            <Divider />
            <Button
              variant='outlined'
              sx={{
                borderColor: colors.primaryColor,
                color: colors.primaryColor,
                padding: '12px 0px',
                width: '240px',
                textTransform: 'none',
                mx: 'auto',
                fontSize: '12px'
              }}
            >
              <img src="../assets/img/icon-google.png" alt="Google Logo" width={'18px'} style={{ marginRight: '8px' }} />
              Đăng nhập với <strong style={{ marginLeft: '4px' }}>Google</strong>
            </Button>
          </Stack>
        </FormControl>
      </Stack>
    </Modal>
  ) : (
    <Modal
      open={isAuthModalOpen}
      onClose={closeAuthModal}
      aria-labelledby='modal-title'
    >
      <Stack 
        alignItems={'center'}
        sx={{
          padding: '32px 40px',
          position: 'absolute',
          top: {xs: '0', sm: '50%'},
          left: {xs: '0', sm: '50%'},
          transform: {sm: 'translate(-50%, -50%)'},
          right: {xs: '0', sm: 'auto'},
          bottom: {xs: '0', sm: 'auto'},
          bgcolor: 'white',
          borderRadius: '8px',
          outline: 'none',
          maxHeight: '100vh',
          overflow: 'auto',
          minWidth: { sm: '400px' }
        }}
      >
        <IconButton 
        onClick={closeAuthModal}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4
        }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <Typography variant='h1' fontSize={{xs: '28px', sm: '36px'}} fontWeight={'500'}>Tạo tài khoản mới</Typography>
        <Typography fontSize={{xs: '14px', sm: '16px'}} marginTop={'8px'}>Điền thông tin của bạn phía dưới</Typography>
        <FormControl
          sx={{
            marginTop: '16px',
            width: '100%'
          }}
        >
          {registerInputs.map((input) => (
            <TextField 
              key={input.id}
              name={input.name}
              label={input.label}
              variant='standard'
              type={input.type}
              value={values[input.name]}
              required
              onChange={(e) => onChange(e, input.pattern)}
              helperText={errors[input.name] ? input.helperText : ''}
              error={errors[input.name]}
              inputProps={{
                pattern: input.pattern,
                autoComplete: 'new-password'
              }}
              sx={{ marginBottom: '20px' }}
            />
          ))}
          <Stack marginTop={'20px'} width={'100%'} gap={'12px'}>
            <RedButton 
              title={!isLoading ? 'Tạo tài khoản' : 'Đang tạo...'}
              disabled={isLoading}
              onClick={onSubmitRegister}
            />
            <Divider />
            <Button
              variant='outlined'
              sx={{
                borderColor: colors.primaryColor,
                color: colors.primaryColor,
                padding: '12px 0px',
                width: '240px',
                textTransform: 'none',
                mx: 'auto',
                fontSize: '12px'
              }}
            >
              <img src="../assets/img/icon-google.png" alt="Google Logo" width={'18px'} style={{ marginRight: '8px' }} />
              Đăng ký với <strong style={{ marginLeft: '4px' }}>Google</strong>
            </Button>
          </Stack>
        </FormControl>
        <Typography fontSize={'14px'} marginTop={'8px'}>
          Đã có tài khoản?{' '}
          <Link sx={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => setFormName('login')}>Đăng nhập</Link>
        </Typography>
      </Stack>
    </Modal>
  )
}

export default AuthModal