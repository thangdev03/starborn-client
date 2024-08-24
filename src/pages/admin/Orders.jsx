import { Container, Typography } from '@mui/material'
import React from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'

const Orders = () => {
  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px'
        }}
      >
        ĐƠN HÀNG
      </Typography>
      <AppBreadcrumbs />
    </Container>
  )
}

export default Orders