import { Box, FormControl, FormHelperText, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../../services/const'
import OutlinedInput from '@mui/material/OutlinedInput';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [objectList, setObjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [newName, setNewName] = useState('')
  const [selectedObject, setSelectedObject] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

  const getData = () => {
    axios
      .get(serverUrl + 'products/' + productId)
      .then((res) => setProduct(res.data.data))
      .catch((err) => {
        console.log(err);
        setProduct(null);
      })
  };

  const getObjects = () => {
    axios
      .get(serverUrl + 'objects')
      .then((res) => setObjectList(res.data))
      .catch((err) => console.log(err))
  };

  const getCategories = () => {
    axios
      .get(serverUrl + 'categories')
      .then((res) => setCategoryList(res.data))
      .catch((err) => console.log(err))
  };

  const getSubcategories = () => {
    axios
      .get(serverUrl + 'subcategories')
      .then((res) => setSubcategoryList(res.data))
      .catch((err) => console.log(err))
  };

  const handleChangeObject = (event) => {
    setSelectedObject(event.target.value);
  };

  useEffect(() => {
    getData();
  }, [productId])

  useEffect(() => {
    if (product) {
      setNewName(product.name);
    }
  }, [product])

  useEffect(() => {
    getObjects();
    getCategories();
    getSubcategories();
  }, [])

  return (
    <Box
      sx={{
        paddingX: { xs: "8px", md: "24px" },
        margin: 0,
        paddingBottom: "160px",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "end" }}
        justifyContent={"space-between"}
        gap={{ xs: "12px", md: "auto" }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
            }}
          >
            CHI TIẾT SẢN PHẨM
          </Typography>
          <AppBreadcrumbs item={product?.name}/>
        </Box>
      </Stack>

      <Stack gap={'20px'} sx={{ marginTop: '24px', bgcolor: 'white', borderRadius: '16px', padding: '40px 24px' }}>
          <FormControl variant='outlined' fullWidth>
            <Typography marginBottom={'12px'} fontWeight={500}>Tên sản phẩm</Typography>
            <OutlinedInput 
            id='input-name' 
            size='small' 
            variant='outlined' 
            sx={{ borderRadius: '8px' }}
            />
          </FormControl>
          <FormControl variant='outlined' fullWidth>
            <Typography marginBottom={'12px'} fontWeight={500}>Mô tả sản phẩm</Typography>
            <OutlinedInput 
            id='input-description' 
            size='small' 
            variant='outlined' 
            sx={{ borderRadius: '8px' }}
            />
          </FormControl>
          <Box>
            <Typography marginBottom={'12px'} fontWeight={500}>Phân loại</Typography>
            <Stack>
              <FormControl fullWidth>
                <InputLabel id="object-select-label">Đối tượng sử dụng</InputLabel>
                <Select
                  labelId="object-select-label"
                  id="object-select"
                  value={selectedObject}
                  label="Đối tượng sử dụng"
                  onChange={handleChangeObject}
                >
                  {objectList.length !== 0 ? objectList.map(object => (
                    <MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>
                  )) : (
                    <Typography sx={{ padding: 1, fontStyle: 'italic' }}>Chưa có đối tượng sử dụng nào</Typography>
                  )}
                </Select>
              </FormControl>

            </Stack>
          </Box>
      </Stack>
    </Box>
  )
}

export default ProductDetail