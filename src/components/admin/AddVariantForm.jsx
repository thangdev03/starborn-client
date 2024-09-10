import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Divider, FormGroup, IconButton, ImageList, ImageListItem, List, ListItem, ListItemIcon, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { colors, serverUrl } from '../../services/const';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ActionBtn from './ActionBtn';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import axios from 'axios';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const AddVariantForm = ({ productId, handleCloseForm = () => {} }) => {
  const [checked, setChecked] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([
    {size: 'XS', quantity: 0},
    {size: 'S', quantity: 0},
    {size: 'M', quantity: 0},
    {size: 'L', quantity: 0},
    {size: 'XL', quantity: 0},
    {size: '2XL', quantity: 0},
    {size: '3XL', quantity: 0}
  ]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#000000');
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [previewImages, setPreviewImages] = useState([]);
  const [variantImages, setVariantImages] = useState([]);
  
  const handleIncrease = (value) => {
    const newSizeOptions = [...sizeOptions];
    const currentIndex = sizeOptions.indexOf(value);
    newSizeOptions[currentIndex].quantity = value.quantity + 1;
    setSizeOptions(newSizeOptions);
  };

  const handleDecrease = (value) => {
    const newSizeOptions = [...sizeOptions];
    const currentIndex = sizeOptions.indexOf(value);
    newSizeOptions[currentIndex].quantity = value.quantity - 1;
    setSizeOptions(newSizeOptions);
  }

  const handleQuantityChange = (event, value) => {
    const newSizeOptions = [...sizeOptions];
    const currentIndex = sizeOptions.indexOf(value);
    newSizeOptions[currentIndex].quantity = event.target.value > 0 ? Number(event.target.value) : 0;
    setSizeOptions(newSizeOptions);
  } 

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSubmit = () => {
    if (!colorName || !colorHex || !price || !discount) {
        alert('Vui lòng điền đầy đủ thông tin của biến thể sản phẩm')
    }
    if (checked.length === 0) {
        alert('Vui lòng chọn ít nhất 1 size của biến thể sản phẩm')
    }

    const newProductVariants = checked.map((sizeOption) => ({
        size: sizeOption.size, 
        color: colorName, 
        hex_color: colorHex, 
        price: price, 
        discount: discount, 
        stock: sizeOption.quantity
    }))

    axios
      .post(serverUrl + 'products/variants/' + productId, {
          variants: newProductVariants
      })
      .then((res) => {
          if (res.status === 201) {
            alert('Tạo biến thể sản phẩm thành công');
            handleCloseForm();
          }
      })
      .catch((err) => {
          console.log(err);
      })
  }

  const handleImageChange = (e) => {
    setVariantImages(e.target.files);
    let URLResults = [];
    for (let file of e.target.files) {
        const newURL = URL.createObjectURL(file);
        URLResults.push(newURL)
    }
    setPreviewImages(URLResults);
  };

  console.log('variantImages: ', variantImages)
  console.log('previewImages: ', previewImages)

  return (
    <Box sx={{ marginTop: '16px', paddingY: '16px' }}>
        <Stack direction={'row'} gap={'20px'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
            <TextField 
            id="variant-color" 
            label="Tên màu sắc" 
            variant="outlined" 
            aria-required 
            size='small'
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            />
            <TextField 
            id="variant-hex" 
            label="Mã màu (hex)" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='color' 
            sx={{ width: '120px' }}
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            />
            <TextField 
            id="variant-price" 
            label="Giá (VNĐ)" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='number' 
            inputProps={{
                min: 0,
                step: 1000
            }}
            sx={{ flexGrow: 1 }}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            />
            <TextField 
            id="variant-discount" 
            label="Giảm giá (%)" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='number' 
            inputProps={{
                min: 0
            }}
            sx={{ flexGrow: 1 }}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            />
            {/* <IconButton>
                <DeleteIcon sx={{ color: colors.red, fontSize: '24px' }}/>
            </IconButton> */}
        </Stack>
        <Accordion sx={{ mt: '16px' }}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{ marginY: '0px!important' }}
            >
                <Typography>Chọn size</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormGroup>
                    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px' }}>
                        {sizeOptions.map((sizeOption) => {
                            const labelId = `checkbox-list-label-${sizeOption.size}`;

                            return (
                            <ListItem
                                key={sizeOption.size}
                                dense={true}
                                sx={{ 
                                    borderWidth: '0 0 1px',
                                    borderStyle: 'solid',
                                    borderColor: '#ddd',
                                    '&:last-child, &:last-child': { border: 0 } 
                                }}
                                // disablePadding
                            >
                                <ListItemIcon>
                                    <Checkbox
                                    edge="start"
                                    onClick={handleToggle(sizeOption)} 
                                    checked={checked.indexOf(sizeOption) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${sizeOption.size}`} />
                                {/* <TextField 
                                id={'variant-quantity-' + labelId} 
                                label="Số lượng tồn kho" 
                                aria-required 
                                size='small' 
                                type='number'
                                /> */}
                                <Stack direction={'row'} gap={'4px'}>
                                    <IconButton disabled={sizeOption.quantity === 0} onClick={() => handleDecrease(sizeOption)}>
                                        <RemoveRoundedIcon/>
                                    </IconButton>
                                    <input 
                                    value={sizeOption.quantity}
                                    type='text'
                                    inputMode='numeric'
                                    onChange={(event) => handleQuantityChange(event, sizeOption)}
                                    style={{
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        border: 0,
                                        '&::WebkitInnerSpinButton': {
                                            display: 'none'
                                        }
                                    }}
                                    />
                                    <IconButton onClick={() => handleIncrease(sizeOption)}>
                                        <AddRoundedIcon/>
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            );
                        })}
                    </List>
                </FormGroup>
            </AccordionDetails>
        </Accordion>
        <Stack direction={'column'} marginTop={'16px'}>
            <input 
            type='file' 
            multiple
            accept='image/*'
            style={{ 
                padding: '8px', 
                border: '1px dashed', 
                borderColor: colors.primaryColor, 
                width: '280px', 
                borderRadius: '8px' 
            }}
            name='image'
            onChange={handleImageChange}
            />
            <Stack sx={{ width: '100%', marginTop: '16px', overflowX: 'auto', paddingY: '8px' }} direction={'row'} gap={'12px'}>
                {previewImages.map((item, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            flexShrink: 0,
                            height: '220px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <Box 
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                left: 0,
                                bgcolor: colors.primaryColor,
                                height: '36px',
                                opacity: 0.5
                            }}
                        >
                        </Box>
                        <IconButton 
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: '#fff'
                            }}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                        <img
                            src={item} 
                            alt={item?.name} 
                            loading='lazy'
                            style={{
                                objectFit: 'cover'
                            }}
                            width={'180px'}
                            height={'100%'}
                        />
                    </div>
                ))}
            </Stack>
        </Stack>
        <Stack direction={'row'} justifyContent={'center'} gap={'16px'} paddingTop={'16px'} sx={{ flexWrap: 'wrap' }}>
            <ActionBtn
            type={'save'}
            title={'Tạo biến thể'}
            handleClick={handleSubmit}
            customStyle={{
                flexGrow: 1
            }}
            />
            <ActionBtn
            type={'cancel'}
            title={'Hủy'}
            handleClick={handleCloseForm}
            customStyle={{
                flexGrow: 1
            }}
            />
        </Stack>
        <Divider sx={{ marginTop: '16px' }}/>
    </Box>
  )
}

export default AddVariantForm