import { Container, Typography } from '@mui/material'
import React from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'

const Products = () => {
  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px'
        }}
      >
        TẤT CẢ SẢN PHẨM
      </Typography>
      <AppBreadcrumbs />
    </Container>
  )
}

export default Products