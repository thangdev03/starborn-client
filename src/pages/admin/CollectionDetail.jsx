import { Box, Button, FormControlLabel, IconButton, Stack, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { colors, serverUrl } from '../../services/const'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { toast } from 'react-toastify'

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const [data, setData] = useState({
    id: "",
    name: "",
    is_active: false,
    slug: "",
    products: [],
  });
  const [deleteProducts, setDeleteProducts] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    axios
      .get(serverUrl + `collection/${collectionId}`)
      .then((res) => {
        setData({
            id: res.data?.id,
            name: res.data?.name,
            is_active: res.data?.is_active === 1 ? true : false,
            slug: res.data?.slug,
            products: res.data?.products
        });
      })
      .catch((error) => {
        console.log(error);
      })
  };

  const handleDelete = (productId) => {
    setDeleteProducts([...deleteProducts, productId]);

    let newProducts = [];
    newProducts = data.products.filter(i => i.product_id !== productId);

    setData({
      ...data,
      products: newProducts
    })
  }

  const onDeleteCollection = async () => {
    axios
      .delete(serverUrl + "collection/" + collectionId, {
        withCredentials: true
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Xóa thành công!");
          navigate("/admin/collection")
        }
      })
      .catch((error) => console.log(error))
  };

  const onSaveCollection = async () => {
    axios
      .put(serverUrl + "collection/" + collectionId, {
        name: data.name,
        is_active: data.is_active,
        deleteProducts
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Cập nhật thành công!")
        }
      })
      .catch((error) => console.log(error))
  };

  useEffect(() => {
    getData();
  }, [collectionId]);

  return (
    <Box
        sx={{
          paddingX: { xs: "8px", md: "24px" },
          margin: 0,
          paddingBottom: "160px",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
            }}
          >
            CHI TIẾT BỘ SƯU TẬP
          </Typography>
          <AppBreadcrumbs item={`Chi tiết`} />
        </Box>

        <Stack
          marginTop={"24px"}
          gap={"24px"}
          padding={"24px 16px"}
          borderRadius={"8px"}
          sx={{ backgroundColor: "#FAFAFA" }}
        >
          <TextField 
            label="Tên bộ sưu tập"
            value={data.name}
            onChange={(e) => setData((prev) => ({...prev, name: e.target.value}))}
          />
          <FormControlLabel 
            control={<Switch />} 
            label="Kích hoạt"
            checked={data.is_active}
            onChange={(e) => setData((prev) => ({...prev, is_active: e.target.checked}))}
          />
        </Stack>

        <Stack
          marginTop={"24px"}
          gap={"24px"}
          padding={"24px 16px"}
          borderRadius={"8px"}
          sx={{ backgroundColor: "#FAFAFA" }}
        >
            <Typography fontWeight={600}>
              Sản phẩm
            </Typography>
            <Stack>
              {data.products?.map((product, index) => (
                <Stack 
                  key={product.product_id}
                  direction={"row"} 
                  justifyContent={"space-between"} 
                  alignItems={"center"}
                  paddingX={"8px"}
                  paddingY={"8px"}
                  sx={{
                    "&:hover": {
                      bgcolor: "#eee"
                    }
                  }}
                >
                  <Stack direction={"row"} gap={"12px"} alignItems={"center"}>
                    <Typography>
                      {index + 1}.
                    </Typography>
                    <Box height={"80px"} width={"60px"} borderRadius={"8px"} overflow={"hidden"}>
                      <img src={product.image_url} alt={product.product_name} height={"100%"} width={"100%"} style={{ objectFit: "cover" }}/>
                    </Box>
                    <Typography>
                      {product.product_name}
                    </Typography>
                  </Stack>
                  <IconButton onClick={() => handleDelete(product.product_id)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
        </Stack>

        <Stack marginTop={"16px"} direction={"row"} justifyContent={"end"} gap={"8px"}>
          <Button 
            onClick={onDeleteCollection}
            size="large" 
            sx={{ 
              bgcolor: colors.red,
              color: "white",
              "&:hover": {
                bgcolor: "#DB0404",
              }
            }}
          >
            Xóa BST
          </Button>
          <Button 
            size="large" 
            variant="contained"
            onClick={onSaveCollection}
          >
            Lưu
          </Button>
        </Stack>
    </Box>
  )
}

export default CollectionDetail