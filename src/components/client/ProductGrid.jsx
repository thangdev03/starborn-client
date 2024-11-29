import React from 'react'
import ProductGridItem from './ProductGridItem'
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material'

const ProductGrid = ({ products }) => {
  console.log({products})
  return (
    <Grid container columnSpacing={'16px'} rowSpacing={'28px'} width={'100%'}>
      {products?.length === 0 && (
        <Typography 
          sx={{
            width: '100%',
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '20px'
          }}
        >
          Không tìm thấy sản phẩm nào!
        </Typography>
      )}
      {products 
        ? products.map((product) => (
            <ProductGridItem 
            key={product.id}
            imageSrc={'https://r2.erweima.ai/imgcompressed/compressed_f06f9873d97a56d51961fbdc970f315b.webp'}
            variants={product.variants}
            name={product.name}
            productSlug={product.slug}
            rate={product.average_rating}
            totalPurchase={product.total_purchase}
            />
          ))
        : [1,2,3,4,5,6].map(i => (
          <Grid key={i} item xs={6} sm={4} md={4} lg={3} xl={2}>
              <Stack
                sx={{
                  height: {
                    xs: "220px",
                    sm: "280px",
                    md: "320px",
                    lg: "360px",
                    xl: "400px",
                  },
                }}
                gap={'12px'}
              >
                <Skeleton variant='rounded' height={'80%'}/>
                <Skeleton variant='rounded' sx={{ flexGrow: 1 }}/>
              </Stack>
          </Grid>
        ))
      }
    </Grid>
  )
}

export default ProductGrid