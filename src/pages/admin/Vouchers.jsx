import { Box, Button, InputBase, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Switch, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import SearchIcon from '@mui/icons-material/Search'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { colors, serverUrl } from '../../services/const'
import { checkCouponStatus } from '../../utils/couponUtils'
import VoucherModal from '../../components/admin/VoucherModal'
import axios from 'axios'
import dayjs from 'dayjs'

const Vouchers = () => {
  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleSearchRequest = () => {
    axios.get(serverUrl + 'coupons?keywords=' + searchText)
    .then((res) => setData(res.data))
    .catch((err) => {
      console.log(err);
      setData(null);
    })
  }

  const toggleModal = () => {
    setOpen(!open);
    if (open) {
      setSelectedCoupon(null);
      setAction('')
    }
  }

  const handleToggleSwitch = (currentValue, couponCode) => {
    axios.put(serverUrl + 'coupons/changeEnable/' + couponCode, {
      is_enabled: !currentValue
    })
    .then((res) => {
      if (res.status === 200) {
        getData();
      } else {
        alert(res.data?.message)
      }
    })
    .catch((err) => console.log(err))
  }

  const getData = () => {
    axios.get(serverUrl + 'coupons')
    .then((res) => setData(res.data))
    .catch((err) => {
      console.log(err);
      setData(null);
    })
  }

  useEffect(() => {
    getData();
  },[]);

  return (
    <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0, paddingBottom: '160px' }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px'
        }}
      >
        MÃ GIẢM GIÁ
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
              setAction('create')
              toggleModal();
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
            Tạo mã giảm giá
          </Button>
        </Stack>

        <VoucherModal 
          action={action}
          open={open}
          handleClose={toggleModal}
          coupon={selectedCoupon}
          reloadData={getData}
        />

        <TableContainer sx={{ marginTop: '16px' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px', textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Mã áp dụng</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Mô tả</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Lượng giảm giá</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Thời gian áp dụng</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Tình trạng</TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>Kích hoạt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data ? data.map((coupon) => (
                <TableRow
                  key={coupon.code}
                  hover={true}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell 
                  align='center' 
                  sx={{ 
                    color: colors.primaryColor,
                    paddingX: 0, 
                    paddingY: '12px', 
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setAction('detail')
                    toggleModal();
                    setSelectedCoupon(coupon);
                  }}
                  >
                    <Typography 
                      sx={{ 
                        width: '100%', 
                        padding: '12px 0px', 
                        color: colors.red,
                        border: `1px solid ${colors.red}`, 
                        borderRadius: '8px',
                      }}
                    >
                      {coupon.code}
                    </Typography>
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px' }}>
                    {coupon.description}<br/>
                    <span style={{ opacity: 0.7 }}>
                      Giới hạn: {coupon.total_limit} - Đã dùng: {coupon.total_uses}
                    </span>
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px' }}>
                    {coupon.amount}{coupon.type}
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px' }}>
                    {dayjs(coupon.active_date).format('YYYY-MM-DD HH:mm')} -<br/>{dayjs(coupon.expiration_date).format('YYYY-MM-DD HH:mm')}
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px', fontWeight: 500 }}>
                    {checkCouponStatus(coupon)}
                  </TableCell>
                  <TableCell align='center' sx={{ color: colors.primaryColor, paddingX: 0, paddingY: '12px' }}>
                    <Switch 
                      id={`switch-${coupon.code}`}
                      checked={coupon.is_enabled === 1 ? true : false}
                      onChange={() => handleToggleSwitch(coupon.is_enabled, coupon.code)}
                    />
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', color: colors.primaryColor }}>
                    Không tìm thấy mã giảm giá nào!
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

export default Vouchers