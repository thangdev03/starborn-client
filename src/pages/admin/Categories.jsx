import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { 
  Box, 
  Typography,
} from '@mui/material'
import CategoryTable from '../../components/admin/CategoryTable'
import { serverUrl } from '../../services/const'
import axios from 'axios'
import CategoryModal from '../../components/admin/CategoryModal'
import { useSearchParams } from 'react-router-dom'

const Categories = () => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [objects, setObjects] = useState([]);

  const changeSearchParam = (value) => {
    setSearchParams({'object_id': value});
  }

  const handleCreateCategory = (newCategory) => {
    if (data.find((category => category.name === newCategory.name && category.object_id === newCategory.objectId))) {
      return alert('Danh mục sản phẩm này đã tồn tại!');
    } else {
      axios.post(serverUrl + 'categories', {
        name: newCategory.name,
        object_id: newCategory.objectId 
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

  const handleDeleteCategory = (category) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục sản phẩm "' + category.name + '-' + category.object_name +'" ?')) {
      axios.delete(serverUrl + 'categories/' + category.id)
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

  const handleUpdateCategory = (category, newName) => {
    if (data.find((item => item.name === newName && item.object_id === category.object_id))) {
      return alert('Trùng tên với danh mục đã tồn tại!');
    } else {
      axios.put(serverUrl + 'categories/' + category.id, {
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
    const objectIdParam = searchParams.get('object_id');
    const apiUrl = objectIdParam ? (serverUrl + 'categories?object_id=' + objectIdParam) : (serverUrl + 'categories');
    
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
  },[searchParams.get('object_id')])

  useEffect(() => {
    axios.get(serverUrl + 'categories/object')
      .then((res) => setObjects(res.data))
      .catch((err) => console.log(err))
  },[])

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
        data={data} 
        onClickCreateBtn={handleOpen}
        onClickDeleteBtn={handleDeleteCategory}
        onPage={'category'}
        handleUpdate={handleUpdateCategory}
        filterOptions={objects}
        onSelectFilter={changeSearchParam}
      />

      <CategoryModal 
        type={'category'}
        title={'Tạo danh mục'}
        inputLabel={'Tên danh mục'}
        actionBtn={'Thêm'}
        isOpen={open}
        setOpenToFalse={() => setOpen(false)}
        handleClickBtn={handleCreateCategory}
      />
    </Box>
  )
}

export default Categories