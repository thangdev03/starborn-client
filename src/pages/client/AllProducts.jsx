import { Box, Typography, Stack, Skeleton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ImageSlider from '../../components/client/ImageSlider'
import CategoryAccordion from '../../components/client/CategoryAccordion'
import axios from 'axios'
import { serverUrl } from '../../services/const'
import ProductGrid from '../../components/client/ProductGrid'

const AllProducts = () => {
  const { objectSlug } = useParams();
  const [objectName, setObjectName] = useState('');
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    categorySlug: null,
    subcategorySlug: null
  });
  const [products, setProducts] = useState(null);
  const [searchParams, setSearchParams] =  useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const [sortType, setSortType] = useState('');

  const handleChangeCategory = (newCategory, newSubcategory = null) => {
    if (newSubcategory) {
      setSearchParams({
        category: newCategory,
        subcategory: newSubcategory
      })
    } else {
      setSearchParams({
        category: newCategory
      })
    }
  };

  const handleChangeSortType = (e) => {
    setSortType(e.target.value)
  }

  useEffect(() => {
    if (objectSlug === 'nu') {
      setObjectName('Nữ');
    } else if (objectSlug) {
      setObjectName('Nam');
    }

    axios.get(serverUrl + 'categories/' + objectSlug)
    .then((res) => setCategories(res.data))
    .catch((err) => console.log(err))
  }, [objectSlug])

  useEffect(() => {
    let apiUrl = serverUrl + `products?getVariants=1&object=${objectSlug}`;
    if (category) {
      apiUrl += `&category=${category}`
      if (subcategory) {
        apiUrl += `&subcategory=${subcategory}`
      }
    }
    if (sortType) {
      apiUrl += `&sort=${sortType}`
    }

    axios.get(apiUrl)
    .then((res) => setProducts(res.data))
    .catch((err) => console.log(err))
  }, [objectSlug, searchParams, sortType])

  // console.log(products)

  return (
    <Box paddingX={{ xs: '16px', sm: '52px' }}>
        <Typography marginY={'20px'} textTransform={'uppercase'} fontWeight={600} fontSize={{ xs: '24px', md: '32px' }}>
            Bộ sưu tập {objectName}
        </Typography>
        <ImageSlider 
          imageUrls={['https://img.pikbest.com/origin/09/30/65/27hpIkbEsTzdI.jpg!sw800', 'https://t3.ftcdn.net/jpg/02/11/28/00/360_F_211280049_g8nsjnEXE2383rW14OQ64Rg2WPANojKK.jpg']}
          height={{ xs: '120px', sm: '160px', md: '280px' }}
        />

        <Stack 
          direction={'row'}
          gap={'24px'}
          sx={{ marginTop: '24px' }}
        >
          <Box sx={{ display: {xs: 'none', md: 'block'}, borderRight: '1px solid rgba(27, 33, 65, 0.3)' }}>
            <Box 
            sx={{ 
              width: '260px', 
              paddingRight: '8px', 
              position: 'sticky',
              top: '120px'
            }}>
              <Typography fontSize={'32px'} fontWeight={600} textTransform={'uppercase'}>{objectName}</Typography>
              {categories 
                ? categories.map((category) => (
                  <CategoryAccordion key={category.id} category={category} handleChangeCategory={handleChangeCategory}/>
                ))
                : [1,2,3,4].map(i => (
                  <Skeleton key={i} height={'52px'} width={'100%'} sx={{ transform: 'scale(1, 0.8)' }}/>
                ))
              }
            </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} marginBottom={'20px'}>
              <Typography 
              sx={{
                fontSize: '14px',
                color: 'rgba(27, 33, 65, 0.6)'
              }}
              >
                (104 kết quả)
              </Typography>
              
              <Stack direction={'row'} alignItems={'center'} width={'fit-content'} gap={'8px'}>
                <Typography fontSize={'14px'}>SẮP XẾP THEO</Typography>
                <FormControl>
                  <Select
                    value={sortType}
                    displayEmpty
                    sx={{
                      width: '200px',
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={handleChangeSortType}
                    size="small"
                  >
                    <MenuItem value="">Mặc định</MenuItem>
                    <MenuItem value={"highestSales"}>Bán chạy nhất (CHƯA LÀM)</MenuItem>
                    <MenuItem value={"newest"}>Mới nhất</MenuItem>
                    <MenuItem value={"highestRating"}>Xếp hạng cao nhất</MenuItem>
                    <MenuItem value={"priceAZ"}>Giá thấp đến cao</MenuItem>
                    <MenuItem value={"priceZA"}>Giá cao đến thấp</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <ProductGrid products={products}/>
          </Box>
        </Stack>
    </Box>
  )
}

export default AllProducts