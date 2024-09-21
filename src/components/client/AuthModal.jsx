import { Box, FormControl, Modal, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { colors } from '../../services/const';

const AuthModal = () => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleClose = () => {

  };

  const validInput = (event, type) => {
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-title'
    >
      <Stack 
        alignItems={'center'}
        sx={{
          padding: '48px 40px',
          position: 'absolute',
          top: {xs: '0', sm: '20%'},
          left: {xs: '0', sm: '50%'},
          transform: {sm: 'translateX(-50%)'},
          right: {xs: '0', sm: 'auto'},
          bottom: {xs: '0', sm: 'auto'},
          bgcolor: 'white',
          borderRadius: '8px',
          outline: 'none'
        }}
      >
        <Typography variant='h1' fontSize={{xs: '28px', sm: '36px'}} fontWeight={'500'}>Tạo tài khoản mới</Typography>
        <Typography fontSize={{xs: '14px', sm: '16px'}} marginTop={'16px'}>Điền thông tin của bạn phía dưới</Typography>
        <FormControl
          sx={{
            marginTop: '24px'
          }}
        >
          <TextField 
            label='Họ tên'
            variant='standard'
            required
            value={name}
            onChange={(e) => validInput(e, 'name')}
          />

        </FormControl>
      </Stack>
    </Modal>
  )
}

export default AuthModal