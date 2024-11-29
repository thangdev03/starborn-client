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
import AddVariantForm from '../../components/admin/AddVariantForm'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import AddImagesModal from '../../components/admin/AddImagesModal';
import { toast } from 'react-toastify'

const AdminProductDetail = () => {
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
  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [currTags, setCurrTags] = useState([]);
  const [currCollections, setCurrCollections] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [variants, setVariants] = useState([]);
  const [currVariants, setCurrVariants] = useState([]);
  const [deleteTags, setDeleteTags] = useState([]);
  const [deleteCollections, setDeleteCollections] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [isUpdatingVariant, setIsUpdatingVariant] = useState(false);

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
      .then((res) => {
        setSelectedTags(res.data);
        setCurrTags(res.data);
      })
      .catch((err) => {
        console.log(err);
      })

    axios
      .get(serverUrl + 'collection/product/' + productId)
      .then((res) => {
        setSelectedCollections(res.data);
        setCurrCollections(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  const getVariantsData = () => {
    axios
      .get(serverUrl + 'products/' + productId + '/variants')
      .then((res) => {
        setVariants(res.data);
        setCurrVariants(res.data);
      })
      .catch((err) => console.log(err))
  }

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

  const getCollections = () => {
    axios
      .get(serverUrl + 'collection')
      .then((res) => setCollectionList(res.data))
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
  };

  const handleUpdateProduct = () => {
    setIsUpdatingProduct(true);
    const newProductTags = 
      selectedTags
        .filter((tag) => !currTags.find((currTag) => currTag.name === tag.name))
        .map((tag) => tag.name)

    const newProductCollections = 
      selectedCollections
        .filter((collection) => !currCollections.find((currCollection) => currCollection.name === collection.name))
        .map((collection) => collection.id)
    
    axios
      .put(serverUrl + 'products/update/' + productId, {
        name: name,
        detail: detail,
        subcategory_id: selectedSubcategory.id,
        is_featured: product.is_featured,
        is_active: product.is_active,
        tags: newProductTags,
        deleteTags: deleteTags,
        collections: newProductCollections,
        deleteCollections: deleteCollections
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Cập nhật thông tin thành công!');
          getData();
        }
        setIsUpdatingProduct(false);
      })
      .catch((error) => {
        console.log(error);
        setIsUpdatingProduct(false);
      });
  };

  const cancelUpdateProduct = () => {
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
  };

  const cancelUpdateVariants = () => {
    setDeleteImages([]);
    setVariants(currVariants);
  };

  const handleUpdateVariants = () => {
    setIsUpdatingVariant(true);
    axios.put(serverUrl + 'products/variants', {
      variants: variants,
      deleteImages: deleteImages,
      productId: productId,
    })
    .then(res => {
      if (res.status === 200) {
        toast.success('Cập nhật thành công!');
        getVariantsData();
      }
      setIsUpdatingVariant(false);
    })
    .catch(error => {
      console.log(error);
      setIsUpdatingVariant(false);
    })
  };

  const handleImageChange = (e, variantId) => {
    let URLResult = [];

    for (let file of e.target.files) {
      const newUrl = URL.createObjectURL(file);
      const newOrderNum = variants.find(i => i.variant_id === variantId)?.images.length;

      URLResult.push({
        image_id: `new-${newUrl}`,
        image_url: newUrl,
        order_num: newOrderNum,
        file_name: file.name
      });
    }
    handleVariantChange(variantId, 'images', URLResult);
  };

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
    getCollections();
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
            onChange={(event, value) => {
              if (typeof(value[value.length - 1]) === 'object') {
                setSelectedTags(value)
              } else {
                const tagName = value[value.length - 1]

                const newTag = {
                  id: `id-${tagName}`, 
                  name: tagName
                }
                setSelectedTags((prev) => [...prev, newTag])
              }
            }}
            // onChange={(event, value) => setSelectedTags(value)}
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
                    onDelete={(e) => {
                      e.stopPropagation();
                      if (currTags.find(i => i.name === option.name)) {
                        setDeleteTags((prev) => [...prev, option.name]);
                      }
                      setSelectedTags((prev) => {
                        return prev.filter(i => i.name !== option.name);
                      });
                    }}
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

        <FormControl fullWidth variant="outlined" required>
          <FormHelperText
            id="tag-helper-text"
            sx={{ margin: "0 0 12px", fontSize: "16px", fontWeight: "500" }}
          >
            Bộ sưu tập
          </FormHelperText>

          <Autocomplete
            multiple
            id="collections-filled"
            options={collectionList}
            getOptionLabel={(option) => option?.name}
            isOptionEqualToValue={(option, value) =>
              option.name === value?.name
            }
            freeSolo
            value={selectedCollections}
            onChange={(event, value) => {
              if (typeof(value[value.length - 1]) === 'object') {
                setSelectedCollections(value)
              } else {
                const collectionName = value[value.length - 1]

                const newCollection = {
                  id: `id-${collectionName}`, 
                  name: collectionName
                }
                setSelectedCollections((prev) => [...prev, newCollection])
              }
            }}
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
                    onDelete={(e) => {
                      e.stopPropagation();
                      if (currCollections.find(i => i.name === option.name)) {
                        setDeleteCollections((prev) => [...prev, option.id]);
                      }
                      setSelectedCollections((prev) => {
                        return prev.filter(i => i.name !== option.name);
                      });
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Thêm vào bộ sưu tập"
              />
            )}
          />
        </FormControl>

        <Stack direction={"row"} gap={"16px"} justifyContent={"end"}>
          <ActionBtn
            type={"update"}
            title={!isUpdatingProduct ? "Cập nhật" : "Đang tải..."}
            disabled={isUpdatingProduct}
            handleClick={handleUpdateProduct}
          />
          <ActionBtn
            type={"cancel"}
            title={"Hủy"}
            handleClick={cancelUpdateProduct}
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
                  setDeleteImages={setDeleteImages}
                  handleImageChange={handleImageChange}
                  reloadVariantsData={getVariantsData}
                />
              ))}
            </Stack>
            <Stack direction={"row"} gap={"16px"} justifyContent={"end"}>
              <ActionBtn
                disabled={currVariants === variants || isUpdatingVariant}
                type={"update"}
                title={!isUpdatingVariant ? "Cập nhật" : "Đang tải..."}
                handleClick={handleUpdateVariants}
              />
              <ActionBtn
                type={"cancel"}
                title={"Hủy"}
                handleClick={cancelUpdateVariants}
              />
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}


/* ----------------------------- VARIANT ITEM COMPONENT -------------------------- */
const VariantItem = ({ item, handleVariantChange, handleOptionChange, setDeleteImages, reloadVariantsData }) => {
  const [openModal, setOpenModal] = useState(false);

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
        {/* <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
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
            onChange={(e) => handleImageChange(e, item.variant_id)}
          />
          <Typography sx={{ fontSize: "14px", fontStyle: "italic" }}>
            (Nên sử dụng ảnh tỉ lệ <strong>9:11</strong> để tối ưu)
          </Typography>
        </Stack> */}
        <Box>
          <Button variant='outlined' onClick={() => setOpenModal(true)}>
            <AddPhotoAlternateRoundedIcon />
            Thêm ảnh
          </Button>
          {openModal && (
            <AddImagesModal 
              handleCloseModal={() => setOpenModal(false)}
              variantId={item.variant_id}
              reloadData={reloadVariantsData}
            />
          )}
        </Box>
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
                    onClick={() => { 
                      setDeleteImages((prev) => [...prev, {...image, variant_id: item.variant_id}])

                      const newValue = item.images.filter(i => i.image_id !== image.image_id)
                      handleVariantChange(item.variant_id, 'images', newValue)
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

export default AdminProductDetail