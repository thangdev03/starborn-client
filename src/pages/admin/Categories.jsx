import React from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { Container, Typography } from '@mui/material'

const Categories = () => {
  return (
    <Container sx={{ padding: 0, margin: 0 }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px'
        }}
      >
        DANH MỤC SẢN PHẨM
      </Typography>
      <AppBreadcrumbs />
    </Container>
  )
}

export default Categories