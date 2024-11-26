import { Accordion, Autocomplete, Box, Button, Chip, Divider, FormControl, FormHelperText, Icon, IconButton, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs';
import { colors, serverUrl } from '../../services/const';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ActionBtn from '../../components/admin/ActionBtn';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [objectList, setObjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const navigate = useNavigate();
  
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
      .get(serverUrl + 'categories/sub?category_id=' + selectedCategory?.id)
      .then((res) => setSubcategoryList(res.data))
      .catch((err) => console.log(err))
  };

  const getTags = () => {
    axios
      .get(serverUrl + 'tags')
      .then((res) => setTagList(res.data))
      .catch((err) => console.log(err))
  }

  const uploadImage = () => {

  };

  const handleImageChange = () => {
    
  };

  const handleCreateProduct = () => {
    if (!newName) {
        return toast.warn('Chưa nhập tên sản phẩm');
    }
    if (!newDescription) {
        return toast.warn('Chưa nhập mô tả sản phẩm');
    }
    if (!selectedSubcategory) {
        if (!selectedCategory) {
            if (!selectedObject) {
                return toast.warn('Chưa chọn đối tượng sử dụng');
            }
            return toast.warn('Chưa chọn danh mục');
        }
        return toast.warn('Chưa chọn tiểu danh mục');
    }

    axios
      .post(serverUrl + 'products', {
        name: newName, 
        detail: newDescription, 
        subcategory_id: selectedSubcategory.id, 
        tags: selectedTags
      })
      .then((res) => {
        if (res.status === 201) {
            toast.success('Tạo sản phẩm thành công');
            navigate(`/admin/products/${res.data.data.insertId}`);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      })
  };

  const onCancelClick = () => {
    navigate(-1)
  };

  useEffect(() => {
    getObjects();
    getTags();
  },[])

  useEffect(() => {
    getCategories();
  },[selectedObject])

  useEffect(() => {
    getSubcategories();
  },[selectedCategory])

  return (
    <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0 }}>
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
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    inputProps={{
                      'aria-label': 'name',
                      style: {
                        paddingTop: '8.5px',
                        paddingBottom: '8.5px',
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
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
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

            <FormControl fullWidth variant="outlined" required>
                <FormHelperText id="tag-helper-text" sx={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '500' }}>
                    Tag
                </FormHelperText>
                {/* <OutlinedInput
                    id="tag"
                    aria-describedby="tag-helper-text"
                    inputProps={{
                      'aria-label': 'name',
                      style: {
                        paddingTop: '8.5px',
                        paddingBottom: '8.5px'
                      }
                    }}
                /> */}
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={tagList.map((option) => option.name)}
                    freeSolo
                    value={selectedTags}
                    onChange={(event, value) => setSelectedTags(value)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index });
                            return (
                                <Chip 
                                variant="filled" 
                                label={option} 
                                key={key} 
                                {...tagProps} 
                                sx={{ bgcolor: colors.primaryColor, color: 'white' }} 
                                deleteIcon={
                                    <Icon sx={{ padding: '1px', borderRadius: '100px', bgcolor: '#484c61', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <CloseIcon 
                                        sx={{ color: 'white!important' }} // Customize the color here
                                        />
                                    </Icon>
                                }
                                />
                            );
                        })
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Gắn nhãn liên quan tới sản phẩm"
                        />
                    )}
                />
            </FormControl>

            <Stack direction={'row'} gap={'16px'} justifyContent={'end'}>
                <ActionBtn
                type={'save'}
                title={'Lưu'}
                handleClick={handleCreateProduct}
                />
                <ActionBtn
                type={'cancel'}
                title={'Hủy'}
                handleClick={onCancelClick}
                />
            </Stack>

            {/* <Box>
                <Divider sx={{ color: colors.primaryColor }}>Các biến thể của sản phẩm</Divider>
                <Stack gap={'20px'} style={{ margin: '16px 0' }}>
                    <Box>
                        <Stack direction={'row'} gap={'20px'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                            <TextField 
                            id="variant-color" 
                            label="Màu sắc" 
                            variant="outlined" 
                            aria-required 
                            size='small'
                            />
                            <TextField 
                            id="variant-hex" 
                            label="Mã màu (hex)" 
                            variant="outlined" 
                            aria-required 
                            size='small' 
                            type='color' 
                            sx={{ width: '120px' }}
                            />
                            <TextField 
                            id="variant-price" 
                            label="Giá (VNĐ)" 
                            variant="outlined" 
                            aria-required 
                            size='small' 
                            type='number' 
                            sx={{ flexGrow: 1 }}
                            />
                            <TextField 
                            id="variant-discount" 
                            label="Giảm giá (%)" 
                            variant="outlined" 
                            aria-required 
                            size='small' 
                            type='number' 
                            sx={{ flexGrow: 1 }}
                            />
                            <TextField 
                            id="variant-quantity" 
                            label="Số lượng tồn kho" 
                            variant="outlined" 
                            aria-required 
                            size='small' 
                            type='number' 
                            sx={{ flexGrow: 1 }}
                            />
                            <IconButton>
                                <DeleteIcon sx={{ color: colors.red, fontSize: '24px' }}/>
                            </IconButton>
                        </Stack>

                        <Stack direction={'column'} marginTop={'16px'}>
                            <input type="file" style={{ padding: '8px', border: '1px dashed', borderColor: colors.primaryColor, width: '280px', borderRadius: '8px' }}/>

                        </Stack>
                    </Box>
                </Stack>

                <IconButton>
                    <AddCircleOutlineRoundedIcon sx={{ color: colors.red }} />
                </IconButton>
                <Divider sx={{ marginTop: '16px' }}/>
            </Box> */}
        </Stack>
    </Box>
  )
}

export default AddProduct