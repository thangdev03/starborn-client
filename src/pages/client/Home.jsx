import { Box, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ImageSlider from '../../components/client/ImageSlider'
import HeadingText from '../../components/client/HeadingText'
import ProductCarousel from '../../components/client/ProductCarousel'
import { serverUrl } from '../../services/const'
import axios from 'axios'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import '@leenguyen/react-flip-clock-countdown/dist/index.css'
import { colors } from '../../services/const'
import RedButton from '../../components/common/RedButton'

const IMAGES = [
    '../assets/img/collection1.jpg',
    '../assets/img/collection2.jpg',
    '../assets/img/collection3.jpg',
    '../assets/img/collection4.jpg',
    '../assets/img/collection5.jpg',
]

const Home = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);

  const getFlashSaleProducts = () => {
    axios.get(serverUrl + 'products?getVariants=1')
    .then((res) => setFlashSaleProducts(res.data))
    .catch((err) => console.log(err))
  }

  useEffect(() => {
    getFlashSaleProducts();
  }, [])
  console.log(flashSaleProducts)

  return (
    <Box>
        <ImageSlider 
        imageUrls={IMAGES}
        />

        {/* ---------------------FLASH SALE SECTION---------------------- */}
        <Box
        sx={{
            marginTop: '32px',
            padding: {
                xs: '8px',
                sm: '0 52px'
            }
        }}
        >
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'end'}>
                <HeadingText 
                title={'Hôm nay'}
                subtitle={'Flash Sale'}
                />
                <Stack justifyContent={'end'}>
                    <Box sx={{ flexGrow: 1 }}/>
                    <Box>
                        <FlipClockCountdown 
                            showSeparators={true}
                            to={new Date().getTime() + 1 * 3600 * 1000} 
                            labels={['NGÀY','GIỜ', 'PHÚT', 'GIÂY']}
                            labelStyle={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase' }}
                            digitBlockStyle={{ width: 40, height: 60, fontSize: 30 }}
                            separatorStyle={{ color: colors.primaryColor, size: '6px' }}
                            duration={0.5}
                            hideOnComplete={false}
                        >
                        </FlipClockCountdown>

                    </Box>
                </Stack>
            </Stack>

            <Box sx={{ marginTop: '24px' }}>
                <ProductCarousel products={flashSaleProducts} />
            </Box>

            <Stack width={'100%'} direction={'row'} justifyContent={'center'} marginTop={'32px'}>
                <RedButton 
                title="Xem Tất Cả"
                />
            </Stack>
        </Box>

        {/* ---------------------MOST POPULAR SECTION---------------------- */}
        <Box
        sx={{
            marginTop: '32px',
            padding: {
                xs: '8px',
                sm: '0 52px'
            }
        }}
        >
            <Stack direction={'row'} justifyContent={'space-between'}>
                <HeadingText 
                title={'Hàng HOT giá xịn'}
                subtitle={'Phổ biến nhất'}
                />
                <Stack sx={{ pb: '8px' }}>
                    <Box sx={{ flexGrow: 1 }}/>
                    <RedButton
                    title={'Khám Phá Thêm'}
                    />
                </Stack>
            </Stack>

            <Box sx={{ marginTop: '24px' }}>
                <ProductCarousel products={flashSaleProducts} />
            </Box>
        </Box>

        {/* ---------------------NEW PRODUCTS SECTION---------------------- */}
        <Box
        sx={{
            marginTop: '32px',
            padding: {
                xs: '8px',
                sm: '0 52px'
            }
        }}
        >
            <Stack direction={'row'} justifyContent={'space-between'}>
                <HeadingText 
                title={'Đặc biệt'}
                subtitle={'Sản phẩm mới'}
                />
                <Stack sx={{ pb: '8px' }}>
                    <Box sx={{ flexGrow: 1 }}/>
                    <RedButton
                    title={'Khám Phá Thêm'}
                    />
                </Stack>
            </Stack>

            <Box sx={{ marginTop: '24px' }}>
                <ProductCarousel products={flashSaleProducts} />
            </Box>
        </Box>
    </Box>
  )
}

export default Home