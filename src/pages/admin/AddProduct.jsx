import { Autocomplete, Box, Divider, FormControl, FormHelperText, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { colors, serverUrl } from '../../services/const'
import axios from 'axios'

const AddProduct = () => {
  const [objectList, setObjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [variantNumber, setVariantNumber] = useState(1);

  const getObjects = () => {
    axios
      .get(serverUrl + 'categories/object')
      .then((res) => setObjectList(res.data))
      .catch((err) => console.log(err))
  };

  const getCategories = () => {
    axios
      .get(serverUrl + 'categories?object_id=' + selectedObject?.id)
      .then((res) => setCategoryList(res.data))
      .catch((err) => console.log(err))
  };

  const getSubcategories = () => {
    axios
      .get(serverUrl + 'categories/subcategory?category_id=' + selectedCategory?.id)
      .then((res) => setSubcategoryList(res.data))
      .catch((err) => console.log(err))
  };

  useEffect(() => {
    getObjects();
  },[])

  useEffect(() => {
    getCategories();
  },[selectedObject])

  useEffect(() => {
    getSubcategories();
  },[selectedCategory])


  return (
    <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0, paddingBottom: '160px' }}>
        <Box>
            <Typography
            sx={{
                fontWeight: 600,
                fontSize: '24px'
            }}
            >
            THÊM SẢN PHẨM MỚI
            </Typography>
            <AppBreadcrumbs />
        </Box>

        <Stack gap={'20px'} sx={{ mt: '24px', bgcolor: 'white', py: '40px', px: '32px', borderRadius: '16px' }}>
            <FormControl fullWidth variant="outlined" required>
                <FormHelperText id="name-helper-text" sx={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '500' }}>
                    Tên sản phẩm <span style={{color: colors.red}}>*</span>
                </FormHelperText>
                <OutlinedInput
                    id="name"
                    aria-describedby="name-helper-text"
                    inputProps={{
                      'aria-label': 'name',
                      style: {
                        paddingTop: '8.5px',
                        paddingBottom: '8.5px'
                      }
                    }}
                />
            </FormControl>
            <FormControl fullWidth variant="outlined" required>
                <FormHelperText id="desc-helper-text" sx={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '500' }}>
                    Mô tả <span style={{color: colors.red}}>*</span>
                </FormHelperText>
                <OutlinedInput
                    id="desc"
                    aria-describedby="desc-helper-text"
                    multiline
                    maxRows={5}
                    inputProps={{
                      'aria-label': 'desc',
                    }}
                    sx={{ paddingY: '8.5px' }}
                />
            </FormControl>

            <div>
                <Typography sx={{ fontSize: '16px', fontWeight: 500, mb: '16px' }}>
                    Phân loại <span style={{color: colors.red}}>*</span>
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={'16px'}>
                    <Autocomplete
                        id='select-object'
                        aria-required={'true'}
                        autoComplete={true}
                        options={objectList}
                        getOptionLabel={(option) => option?.name}
                        sx={{ flex: 1, paddingY: '8.5px' }}
                        size='small'
                        value={selectedObject}
                        onChange={(event, newValue) => {
                            setSelectedObject(newValue);
                            setSelectedCategory(null);
                            setSelectedSubcategory(null);
                        }}
                        renderInput={(params) => <TextField {...params} label="Chọn đối tượng" />}
                    />
                    <Autocomplete
                        id='select-category'
                        aria-required={'true'}
                        autoComplete={true}
                        options={categoryList}
                        getOptionLabel={(option) => option?.name}
                        sx={{ flex: 1, paddingY: '8.5px' }}
                        disabled={!selectedObject}
                        size='small'
                        value={selectedCategory}
                        onChange={(event, newValue) => {
                            setSelectedCategory(newValue);
                            setSelectedSubcategory(null);
                        }}
                        renderInput={(params) => <TextField {...params} label="Chọn danh mục" />}
                    />
                    <Autocomplete
                        id='select-subcategory'
                        aria-required={'true'}
                        autoComplete={true}
                        options={subcategoryList}
                        getOptionLabel={(option) => option?.name}
                        sx={{ flex: 1, paddingY: '8.5px' }}
                        disabled={!selectedCategory}
                        size='small'
                        value={selectedSubcategory}
                        onChange={(event, newValue) => {
                            setSelectedSubcategory(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Chọn tiểu danh mục" />}
                    />
                </Stack>
            </div>

            <Box>
                <Divider>Các biến thể của sản phẩm</Divider>
                <Stack gap={'20px'} style={{ margin: '16px 0' }}>
                    <Box>
                        <Stack direction={'row'} gap={'20px'} width={'100%'}>
                            <Autocomplete
                                id='variant-size-1'
                                aria-required={true}
                                autoComplete={true}
                                disablePortal
                                size='small'
                                options={['3XL', '2XL', 'XL', 'L', 'M', 'SM', 'XS']}
                                renderInput={(params) => <TextField {...params} label="Size" />}
                            />
                            <TextField id="variant-color" label="Màu sắc" variant="outlined" aria-required size='small'/>
                            <TextField id="variant-hex" label="Mã màu (hex)" variant="outlined" aria-required size='small' type='color' sx={{ width: '120px' }}/>
                            <TextField id="variant-price" label="Giá (VNĐ)" variant="outlined" aria-required size='small' type='number'/>
                            <TextField id="variant-discount" label="Giảm giá (%)" variant="outlined" aria-required size='small' type='number'/>
                            <TextField id="variant-quantity" label="Số lượng tồn kho" variant="outlined" aria-required size='small' type='number'/>
                        </Stack>
                        <>Tair anh len</>
                    </Box>
                </Stack>
            </Box>
        </Stack>
    </Box>
  )
}

export default AddProduct