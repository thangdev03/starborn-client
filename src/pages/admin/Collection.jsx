import { Box, Button, InputBase, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Switch, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import SearchIcon from '@mui/icons-material/Search'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { colors, serverUrl } from '../../services/const'
import axios from 'axios'
import { toast } from 'react-toastify'
import CollectionModal from '../../components/admin/CollectionModal'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom'

const Collection = () => {
  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const handleSearchRequest = () => {
    axios.get(serverUrl + 'collection?keywords=' + searchText)
    .then((res) => {
        setData(res.data)
    }) 
    .catch((err) => {
      console.log(err);
      setData(null);
    })
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleUpdate = (name, isActive, collectionId) => {
    axios.put(serverUrl + 'collection/' + collectionId, {
      name,
      is_active: isActive
    })
    .then((res) => {
      if (res.status === 200) {
        getData();
        toast.success("Đã cập nhật trạng thái hoạt động", {
          closeButton: false
        })
      } else {
        toast.error(res.data?.message)
      }
    })
    .catch((err) => console.log(err))
  }

  const getData = () => {
    axios.get(serverUrl + 'collection')
    .then((res) => setData(res.data))
    .catch((err) => {
      console.log(err);
      setData(null);
    })
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0, paddingBottom: '160px' }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px'
        }}
      >
        BỘ SƯU TẬP
      </Typography>
      <AppBreadcrumbs />

      <Box sx={{ bgcolor: '#fff', paddingY: '24px', borderRadius: '16px', paddingX: '16px', marginTop: '24px' }}>
        <Stack direction={'row'} justifyContent={'space-between'} gap={'8px'} marginBottom={'4px'}>
          <Box flexGrow={1} maxWidth={'400px'} height={'36px'} position={'relative'} border={'1px solid rgba(102,102,102,0.5)'} borderRadius={'8px'}>
            <InputBase 
              sx={{ width: '100%', height: '100%', paddingRight: '24px', fontSize: '14px', paddingLeft: '8px' }} placeholder='Tìm kiếm'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchRequest()}
            />
            <IconButton 
              onClick={handleSearchRequest}
              sx={{ position: 'absolute', top: '50%', right: '4px', transform: 'translateY(-50%)', color: '#1B2141', opacity: 0.7 }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          <Button
            onClick={() => {
                setIsEdit(false);
                handleOpenModal('create');
            }}
            sx={{ 
              textTransform: 'none', 
              color: 'white', 
              bgcolor: colors.red, 
              borderRadius: '8px' ,
              width: '176px',
              fontSize: '14px',
              transitionProperty: 'all',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '150ms',
              '&:hover': {
                bgcolor: colors.red,
                opacity: 0.8
              }
            }}
          >
            <AddCircleOutlineRoundedIcon sx={{ width: '18px', marginRight: '4px' }}/>
            Tạo bộ sưu tập
          </Button>
        </Stack>

        <CollectionModal 
          title={"Tạo bộ sưu tập mới"}
          actionBtn={"Tạo"}
          isOpen={openModal}
          isEdit={isEdit}
          oldName={""}
          handleClose={handleCloseModal}
          reloadData={getData}
        />

        <TableContainer sx={{ marginTop: '16px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px', textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>STT</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Tên bộ sưu tập</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Trạng thái</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Xem chi tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length !== 0 ? data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  hover={true}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px', fontWeight: 500 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px' }}>
                    {item.name}
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px' }}>
                    <Switch 
                      id={`switch-${item.id}`}
                      checked={item.is_active === 1 ? true : false}
                      onChange={() => handleUpdate(item.name, !item.is_active, item.id)}
                    />
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px', fontWeight: 500 }}>
                    <IconButton onClick={() => navigate(`/admin/collection/${item.id}`)}>
                      <VisibilityIcon sx={{ color: colors.primaryColor }}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: colors.primaryColor }}>
                    Không tìm thấy bộ sưu tập nào!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default Collection