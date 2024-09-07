import React, { useEffect, useState } from 'react'
import CategoryTable from '../../components/admin/CategoryTable'
import { Box, Typography } from '@mui/material'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import axios from 'axios'
import { serverUrl } from '../../services/const'
import CategoryModal from '../../components/admin/CategoryModal'
import { useSearchParams } from 'react-router-dom'

const Subcategories = () => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  const changeSearchParam = (value) => {
    setSearchParams({'category_id': value});
  }

  const handleCreateSubcategory = (newSubcategory) => {
    if (data?.find((subcategory => subcategory.name === newSubcategory.name && subcategory.category_id === newSubcategory.categoryId))) {
      return alert('Danh mục sản phẩm này đã tồn tại!');
    } else {
      axios.post(serverUrl + 'categories/sub', {
        name: newSubcategory.name,
        category_id: newSubcategory.categoryId 
      })
      .then((res) => {
          if (res.status === 201) {
              window.location.reload();
          } else {
              alert(res.data?.message)
          }
      })
      .catch((err) => console.log(err))
    }
  }

  const handleDeleteSubcategory = (subcategory) => {
    if (window.confirm('Bạn có chắc muốn xóa tiểu danh mục sản phẩm "' + subcategory.name + '-' + subcategory.object_name +'" ?')) {
      axios.delete(serverUrl + 'categories/sub/' + subcategory.id)
      .then((res) => {
          if (res.status === 200) {
              window.location.reload();
          } else {
              alert(res.data?.message);
          }
      })
      .catch((err) => console.log(err))
    }
  }

  const handleUpdateSubcategory = (subcategory, newName) => {
    if (data?.find((item => item.name === newName && item.category_id === subcategory.category_id))) {
      return alert('Trùng tên với tiểu danh mục đã tồn tại!');
    } else {
      axios.put(serverUrl + 'categories/sub/' + subcategory.id, {
        name: newName
      })
      .then((res) => {
          if (res.status === 200) {
              alert('Cập nhật thành công!')
              window.location.reload();
          } else {
              alert(res.data?.message);
          }
      })
      .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    const categoryIdParam = searchParams.get('category_id');
    const apiUrl = categoryIdParam ? (serverUrl + 'categories/sub?category_id=' + categoryIdParam) : (serverUrl + 'categories/sub');

    axios.get(apiUrl)
    .then((res) => {
      if (!res.data || res.data.length === 0) {
        setData(null);
      } else {
        setData(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
      setData(null);
    })
  },[searchParams.get('category_id')])

  useEffect(() => {
    axios.get(serverUrl + 'categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err))
  },[])
  console.log(data)
  
  return (
      <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0, paddingBottom: '160px' }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '24px'
          }}
        >
          DANH MỤC SẢN PHẨM
        </Typography>
        <AppBreadcrumbs />

        <CategoryTable 
          showObject={true} 
          showCategory={true} 
          data={data}
          onPage={'subcategory'}
          onClickCreateBtn={handleOpen}
          onClickDeleteBtn={handleDeleteSubcategory}
          handleUpdate={handleUpdateSubcategory}
          filterOptions={categories}
          onSelectFilter={changeSearchParam}
        />

        <CategoryModal 
          type={'subcategory'}
          title={'Tạo tiểu danh mục'}
          inputLabel={'Tên tiểu danh mục'}
          actionBtn={'Thêm'}
          isOpen={open}
          setOpenToFalse={() => setOpen(false)}
          handleClickBtn={handleCreateSubcategory}
        />
      </Box>
    )
}

export default Subcategories