import { Box } from '@mui/material'
import React from 'react'
import ImageSlider from '../../components/client/ImageSlider'
import HeadingText from '../../components/client/HeadingText'
import ProductGrid from '../../components/client/ProductGrid'
import ProductCarousel from '../../components/client/ProductCarousel'

const IMAGES = [
    '../assets/img/collection1.jpg',
    '../assets/img/collection2.jpg',
    '../assets/img/collection3.jpg',
    '../assets/img/collection4.jpg',
    '../assets/img/collection5.jpg',
]

const products = [
    {
        imageSrc: 'https://r2.erweima.ai/imgcompressed/compressed_f06f9873d97a56d51961fbdc970f315b.webp',
        name: 'Áo Phông Nữ Hi Skull Phông Nữ Hi Skull', 
        price: 260000,
        discount: 30, 
        rate: '4.5',
        totalPurchase: 64
    },
    {
        imageSrc: 'https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        name: 'Áo Phông Nữ Hi Skull Phông Nữ Hi Skull', 
        price: 260000,
        discount: 30, 
        rate: '4.5',
        totalPurchase: 64
    },
    {
        imageSrc: 'https://ichef.bbci.co.uk/news/976/cpsprodpb/12A9A/production/_120424467_joy2.jpg',
        name: 'Áo Phông Nữ Hi Skull Phông Nữ Hi Skull', 
        price: 260000,
        discount: 30, 
        rate: '4.5',
        totalPurchase: 64
    },
    {
        imageSrc: 'https://r2.erweima.ai/imgcompressed/compressed_f06f9873d97a56d51961fbdc970f315b.webp',
        name: 'Áo Phông Nữ Hi Skull Phông Nữ Hi Skull', 
        price: 260000,
        discount: 30, 
        rate: '4.5',
        totalPurchase: 64
    },
    {
        imageSrc: 'https://r2.erweima.ai/imgcompressed/compressed_f06f9873d97a56d51961fbdc970f315b.webp',
        name: 'Áo Phông Nữ Hi Skull Phông Nữ Hi Skull', 
        price: 260000,
        discount: 30, 
        rate: '4.5',
        totalPurchase: 64
    },
    {
        imageSrc: 'https://r2.erweima.ai/imgcompressed/compressed_f06f9873d97a56d51961fbdc970f315b.webp',
        name: 'Áo Phông Nữ Hi Skull Phông Nữ Hi Skull', 
        price: 260000,
        discount: 30, 
        rate: '4.5',
        totalPurchase: 64
    },
]

const Home = () => {
  return (
    <Box>
        <ImageSlider 
        imageUrls={IMAGES}
        />
        <Box
        sx={{
            marginTop: '32px',
            padding: {
                xs: '8px',
                sm: '0 52px'
            }
        }}
        >
            <HeadingText 
            title={'Hôm nay'}
            subtitle={'Flash Sale'}
            />

            {/* <ProductGrid /> */}
            <ProductCarousel products={products}/>
        </Box>
    </Box>
  )
}

export default Home