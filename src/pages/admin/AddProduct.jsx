import { Autocomplete, Box, Divider, FormControl, FormHelperText, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { colors, serverUrl } from '../../services/const'
import axios from 'axios'

const AddProduct = () => {
  const [objectList, setObjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);

  const getObjects = () => {
    axios
      .get(serverUrl + 'objects')
      .then((res) => {
        

        setObjectList(res.data)
      })
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

  useEffect(() => {
    getObjects();
    getCategories();
    getSubcategories();
  },[])

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

        <Stack gap={'20px'} sx={{ bgcolor: 'white', py: '40px', px: '32px', borderRadius: '16px' }}>
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
                        aria-required={'true'}
                        autoComplete={true}
                        disablePortal
                        options={objectList}
                        sx={{ flex: 1 }}
                        renderInput={(params) => <TextField {...params} label="Đối tượng sử dụng" />}
                    />
                    <Autocomplete
                        aria-required={'true'}
                        autoComplete={true}
                        disablePortal
                        options={categoryList}
                        sx={{ flex: 2 }}
                        renderInput={(params) => <TextField {...params} label="Danh mục sản phẩm" />}
                    />
                    <Autocomplete
                        aria-required={'true'}
                        autoComplete={true}
                        disablePortal
                        options={subcategoryList}
                        sx={{ flex: 2 }}
                        renderInput={(params) => <TextField {...params} label="Tiểu danh mục sản phẩm" />}
                    />
                </Stack>
            </div>
            <Box>
                <Divider>Các biến thể của sản phẩm</Divider>
                <div style={{ margin: '16px 0' }}>
                    <Stack direction={'row'} gap={'20px'} width={'100%'}>
                        <Autocomplete
                            aria-required={'true'}
                            autoComplete={true}
                            disablePortal
                            options={['Nam', 'Nữ']}
                            renderInput={(params) => <TextField {...params} label="Size" />}
                        />
                        <Autocomplete
                            aria-required={'true'}
                            autoComplete={true}
                            disablePortal
                            sx={{ flex: 1 }}
                            options={['Nam', 'Nữ']}
                            renderInput={(params) => <TextField {...params} label="Màu sắc" />}
                        />
                        <Autocomplete
                            aria-required={'true'}
                            autoComplete={true}
                            disablePortal
                            sx={{ flex: 1 }}
                            options={['Nam', 'Nữ']}
                            renderInput={(params) => <TextField {...params} label="Mã màu (hex)" />}
                        />
                    </Stack>
                </div>
            </Box>
        </Stack>
    </Box>
  )
}

export default AddProduct