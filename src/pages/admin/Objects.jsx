import React, { useEffect, useState } from 'react'
import CategoryTable from '../../components/admin/CategoryTable'
import { Box, Typography } from '@mui/material'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { serverUrl } from '../../services/const'
import axios from 'axios';
import CategoryModal from '../../components/admin/CategoryModal'

const Objects = () => {
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    const handleCreateObject = (newObject) => {
        if (data?.find((object => object.name === newObject))) {
            return alert('Đối tượng sử dụng này đã tồn tại!');
        } else {
            axios.post(serverUrl + 'categories/object', {
              name: newObject  
            })
            .then((res) => {
                if (res.status === 201) {
                    window.location.reload();
                } else {
                    alert(res.data?.message);
                }
            })
            .catch((err) => console.log(err))
        }
    }

    const handleDeleteObject = (object) => {
        if (window.confirm('Bạn có chắc muốn xóa đối tượng "' + object.name + '" ?')) {
            axios.delete(serverUrl + 'categories/object/' + object.id)
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

    const handleUpdateObject = (object, newName) => {
        if (data?.find((item => item.name === newName))) {
            return alert('Trùng tên với đối tượng đã tồn tại!');
        } else {
            axios.put(serverUrl + 'categories/object/' + object.id, {
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
        axios.get(serverUrl + 'categories/object')
        .then((res) => setData(res.data))
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
                data={data} 
                onClickCreateBtn={handleOpen}
                onClickDeleteBtn={handleDeleteObject}    
                onPage={'object'}
                handleUpdate={handleUpdateObject}
            />

            <CategoryModal 
                type={'object'}
                title={'Tạo đối tượng sử dụng'}
                inputLabel={'Tên đối tượng'}
                actionBtn={'Thêm'}
                isOpen={open}
                setOpenToFalse={() => setOpen(false)}
                handleClickBtn={handleCreateObject}
            />
        </Box>
      )
}

export default Objects