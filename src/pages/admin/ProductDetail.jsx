import { Box, FormControl, FormHelperText, Stack, TextField, Typography, Autocomplete, Chip, Icon, Divider, IconButton, Button, Accordion, AccordionSummary, AccordionDetails, FormGroup, List, ListItemIcon, ListItem, ListItemText, Checkbox, Switch } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../../services/const'
import OutlinedInput from '@mui/material/OutlinedInput';
import { colors } from '../../services/const'
import CloseIcon from '@mui/icons-material/Close';
import ActionBtn from '../../components/admin/ActionBtn';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import AddVariantForm from '../../components/admin/AddVariantForm'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [objectList, setObjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [variants, setVariants] = useState([]);

  const getData = () => {
    axios
      .get(serverUrl + 'products/' + productId)
      .then((res) => setProduct(res.data.data))
      .catch((err) => {
        console.log(err);
        setProduct(null);
      })

    axios
      .get(serverUrl + 'tags/product/' + productId)
      .then((res) => setSelectedTags(res.data))
      .catch((err) => {
        console.log(err);
      })
  };

  const getVariantsData = () => {
    axios
      .get(serverUrl + 'products/' + productId + '/variants')
      .then((res) => setVariants(res.data))
      .catch((err) => console.log(err))
  }
  console.log(variants)

  const getObjects = () => {
    axios
      .get(serverUrl + 'categories/object')
      .then((res) => setObjectList(res.data))
      .catch((err) => console.log(err))
  };

  // const handleChangeObject = (event) => {
  //   setSelectedObject(event.target.value);
  // };

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

  const getAllCategories = () => {
    axios
      .get(serverUrl + 'categories')
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.log(err))
  };

  const getAllSubcategories = () => {
    axios
      .get(serverUrl + 'categories/sub')
      .then((res) => setAllSubcategories(res.data))
      .catch((err) => console.log(err))
  };

  const getTags = () => {
    axios
      .get(serverUrl + 'tags')
      .then((res) => setTagList(res.data))
      .catch((err) => console.log(err))
  };

  const handleVariantChange = (variantId, field, newValue) => {
    setVariants((prev) => (
      prev.map((variant) => 
        variant.variant_id === variantId ? { ...variant, [field]: newValue } : variant
      )
    ))
  };

  const handleOptionChange = (variantId, optionId, field, newValue) => {
    setVariants((prev) => (
      prev.map((variant) => 
        variant.variant_id === variantId 
          ? { 
              ...variant, 
              options: variant.options.map((option) => 
                option.option_id === optionId
                  ? { ...option, [field]: newValue }
                  : option
              ) 
            } 
          : variant
      )
    ))
  }

  useEffect(() => {
    getData();
    getVariantsData();
  }, [productId])

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDetail(product.detail);
      const objectSelection = objectList.find(i => i.id === product.object_id);
      const categorySelection = allCategories.find(i => i.id === product.category_id);
      const subcategorySelection = allSubcategories.find(i => i.id === product.subcategory_id);
      setSelectedObject(objectSelection)
      setSelectedCategory(categorySelection)
      setSelectedSubcategory(subcategorySelection)
    }
  }, [product, objectList, allCategories, allSubcategories])

  useEffect(() => {
    getObjects();
    getAllCategories();
    getAllSubcategories();
    getTags();
  },[])

  useEffect(() => {
    getCategories();
  },[selectedObject])

  useEffect(() => {
    getSubcategories();
  },[selectedCategory])

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
          <AppBreadcrumbs item={product?.name} />
        </Box>
      </Stack>

      <Stack
        gap={"20px"}
        sx={{
          mt: "24px",
          bgcolor: "white",
          py: "40px",
          px: "32px",
          borderRadius: "16px",
        }}
      >
        <FormControl fullWidth variant="outlined" required>
          <FormHelperText
            id="name-helper-text"
            sx={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "500" }}
          >
            Tên sản phẩm <span style={{ color: colors.red }}>*</span>
          </FormHelperText>
          <OutlinedInput
            id="name"
            aria-describedby="name-helper-text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            inputProps={{
              "aria-label": "name",
              style: {
                paddingTop: "8.5px",
                paddingBottom: "8.5px",
              },
            }}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined" required>
          <FormHelperText
            id="desc-helper-text"
            sx={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "500" }}
          >
            Mô tả <span style={{ color: colors.red }}>*</span>
          </FormHelperText>
          <OutlinedInput
            id="desc"
            aria-describedby="desc-helper-text"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            multiline
            maxRows={5}
            inputProps={{
              "aria-label": "desc",
            }}
            sx={{ paddingY: "8.5px" }}
          />
        </FormControl>

        <div>
          <Typography sx={{ fontSize: "16px", fontWeight: 500, mb: "16px" }}>
            Phân loại <span style={{ color: colors.red }}>*</span>
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} gap={"16px"}>
            <Autocomplete
              id="select-object"
              aria-required={"true"}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              options={objectList}
              getOptionLabel={(option) => option?.name}
              sx={{ flex: 1, paddingY: "8.5px" }}
              size="small"
              value={selectedObject || null}
              onChange={(event, newValue) => {
                setSelectedObject(newValue);
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Chọn đối tượng" />
              )}
            />
            <Autocomplete
              id="select-category"
              aria-required={"true"}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              options={categoryList}
              getOptionLabel={(option) => option?.name}
              sx={{ flex: 1, paddingY: "8.5px" }}
              disabled={!selectedObject}
              size="small"
              value={selectedCategory || null}
              onChange={(event, newValue) => {
                setSelectedCategory(newValue);
                setSelectedSubcategory(null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Chọn danh mục" />
              )}
            />
            <Autocomplete
              id="select-subcategory"
              aria-required={"true"}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              options={subcategoryList}
              getOptionLabel={(option) => option?.name}
              sx={{ flex: 1, paddingY: "8.5px" }}
              disabled={!selectedCategory}
              size="small"
              value={selectedSubcategory || null}
              onChange={(event, newValue) => {
                setSelectedSubcategory(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Chọn tiểu danh mục" />
              )}
            />
          </Stack>
        </div>

        <FormControl fullWidth variant="outlined" required>
          <FormHelperText
            id="tag-helper-text"
            sx={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "500" }}
          >
            Tag
          </FormHelperText>

          <Autocomplete
            multiple
            id="tags-filled"
            options={tagList}
            getOptionLabel={(option) => option?.name}
            isOptionEqualToValue={(option, value) =>
              option.name === value?.name
            }
            freeSolo
            value={selectedTags}
            onChange={(event, value) => setSelectedTags(value)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="filled"
                    label={option.name}
                    key={key}
                    {...tagProps}
                    sx={{ bgcolor: colors.primaryColor, color: "white" }}
                    deleteIcon={
                      <Icon
                        sx={{
                          padding: "1px",
                          borderRadius: "100px",
                          bgcolor: "#484c61",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <CloseIcon
                          sx={{ color: "white!important" }} // Customize the color here
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

        <Stack direction={"row"} gap={"16px"} justifyContent={"end"}>
          <ActionBtn
            type={"update"}
            title={"Cập nhật"}
            handleClick={() => console.log("hi")}
          />
          <ActionBtn
            type={"cancel"}
            title={"Hủy"}
            handleClick={() => console.log("hi")}
          />
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: "24px",
          bgcolor: "white",
          py: "40px",
          px: "32px",
          borderRadius: "16px",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography sx={{ color: colors.primaryColor, fontWeight: 600 }}>
            Các biến thể của sản phẩm
          </Typography>
          <Button onClick={() => setOpenCreate(true)}>
            <AddRoundedIcon sx={{ marginRight: "4px", fontSize: "20px" }} />
            THÊM BIẾN THỂ
          </Button>
        </Stack>

        {openCreate && (
          <AddVariantForm
            productId={productId}
            handleCloseForm={() => setOpenCreate(false)}
            getVariantsData={getVariantsData}
          />
        )}

        {variants.length > 0 && (
          <>
            <Stack gap={"20px"} style={{ margin: "16px 0" }}>
              {variants.map((item) => (
                <VariantItem 
                  item={item} 
                  key={item.variant_id}
                  handleVariantChange={handleVariantChange}
                  handleOptionChange={handleOptionChange}
                />
              ))}
            </Stack>
            <Stack direction={"row"} gap={"16px"} justifyContent={"end"}>
              <ActionBtn
                type={"update"}
                title={"Cập nhật"}
                handleClick={() => console.log("hi")}
              />
              <ActionBtn
                type={"cancel"}
                title={"Hủy"}
                handleClick={() => console.log("hi")}
              />
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}


/* ----------------------------- VARIANT ITEM COMPONENT -------------------------- */
const VariantItem = ({ item, handleVariantChange, handleOptionChange }) => {
  const handleToggle = (variantOption) => {
    handleOptionChange(item.variant_id, variantOption.option_id, 'option_isActive', !variantOption.option_isActive);
  };

  const handleIncrease = (variantOption) => {
    handleOptionChange(item.variant_id, variantOption.option_id, 'option_stock', variantOption.option_stock + 1);
  };

  const handleDecrease = (variantOption) => {
    handleOptionChange(item.variant_id, variantOption.option_id, 'option_stock', variantOption.option_stock - 1);
  }

  const handleQuantityChange = (event, variantOption) => {
    const newQuantity = event.target.value > 0 ? Number(event.target.value) : 0;
    handleOptionChange(item.variant_id, variantOption.option_id, 'option_stock', newQuantity);
  } 

  return (
    <Box>
      <Stack
        direction={"row"}
        gap={"20px"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <TextField
          id="variant-color"
          label="Màu sắc"
          variant="outlined"
          aria-required
          size="small"
          value={item.color}
          onChange={(e) => handleVariantChange(item.variant_id, 'color', e.target.value)}
        />
        <TextField
          id="variant-hex"
          label="Mã màu (hex)"
          variant="outlined"
          aria-required
          size="small"
          type="color"
          value={item.hex_color}
          onChange={(e) => handleVariantChange(item.variant_id, 'hex_color', e.target.value)}
          sx={{ width: "120px" }}
        />
        <TextField
          id="variant-price"
          label="Giá (VNĐ)"
          variant="outlined"
          aria-required
          size="small"
          type="number"
          inputProps={{
            min: 0,
            step: 1000
          }}
          value={item.price}
          onChange={(e) => handleVariantChange(item.variant_id, 'price', e.target.value > 0 ? Number(e.target.value) : 0)}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          id="variant-discount"
          label="Giảm giá (%)"
          variant="outlined"
          aria-required
          size="small"
          type="number"
          inputProps={{
            min: 0,
            max: 100
          }}
          value={item.discount}
          onChange={(e) => handleVariantChange(
            item.variant_id, 
            'discount', 
            e.target.value > 0 ? (e.target.value <= 100 ? Number(e.target.value) : 100) : 0)}
          sx={{ flexGrow: 1 }}
        />
        {/* <IconButton>
                      <DeleteIcon sx={{ color: colors.red, fontSize: "24px" }} />
                    </IconButton> */}
        <Switch
          checked={item.is_active}
          onClick={(e) => handleVariantChange(item.variant_id, 'is_active', !item.is_active)}
        />
      </Stack>

      <Accordion sx={{ mt: "16px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{ marginY: "0px!important" }}
        >
          <Typography>Bảng size</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                borderRadius: "8px",
              }}
            >
              {item.options.map((variantOption) => {
                const labelId = `checkbox-list-label-${variantOption.option_id}`;

                return (
                  <ListItem
                    key={variantOption.option_size}
                    dense={true}
                    sx={{
                      borderWidth: "0 0 1px",
                      borderStyle: "solid",
                      borderColor: "#ddd",
                      "&:last-child, &:last-child": { border: 0 },
                    }}
                    // disablePadding
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        onClick={() => handleToggle(variantOption)}
                        checked={variantOption.option_isActive}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${variantOption.option_size}`} />
                    {/* <TextField 
                                    id={'variant-quantity-' + labelId} 
                                    label="Số lượng tồn kho" 
                                    aria-required 
                                    size='small' 
                                    type='number'
                                    /> */}
                    <Stack direction={"row"} gap={"4px"}>
                      <IconButton
                        disabled={variantOption.option_stock === 0}
                        onClick={() => handleDecrease(variantOption)}
                      >
                        <RemoveRoundedIcon />
                      </IconButton>
                      <input
                        value={variantOption.option_stock}
                        type="text"
                        inputMode="numeric"
                        onChange={(event) =>
                          handleQuantityChange(event, variantOption)
                        }
                        style={{
                          textAlign: "center",
                          fontSize: "14px",
                          border: 0,
                          "&::WebkitInnerSpinButton": {
                            display: "none",
                          },
                        }}
                      />
                      <IconButton onClick={() => handleIncrease(variantOption)}>
                        <AddRoundedIcon />
                      </IconButton>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <Stack direction={"column"} marginTop={"16px"}>
        <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{
              padding: "8px",
              border: "1px dashed",
              borderColor: colors.primaryColor,
              width: "280px",
              borderRadius: "8px",
            }}
            name="image"
            // onChange={handleImageChange}
          />
          <Typography sx={{ fontSize: "14px", fontStyle: "italic" }}>
            (Nên sử dụng ảnh tỉ lệ <strong>9:11</strong> để tối ưu)
          </Typography>
        </Stack>
        <Stack
          sx={{
            width: "100%",
            marginTop: "16px",
            overflowX: "auto",
            paddingY: "8px",
          }}
          direction={"row"}
          gap={"12px"}
        >
          {
            item.images?.map((image) => (
              <div
                key={image.image_id}
                style={{
                  flexShrink: 0,
                  height: "220px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* <Box
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
                </Box> */}
                <IconButton
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: colors.red
                    }}
                >
                  <CloseRoundedIcon />
                </IconButton>
                <img
                  src={image.image_url}
                  // alt={item.color}
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                  }}
                  width={"180px"}
                  height={"100%"}
                />
              </div>
            ))
          }
        </Stack>
      </Stack>

      <Divider sx={{ marginTop: "16px" }} />
    </Box>
  )
};

export default ProductDetail