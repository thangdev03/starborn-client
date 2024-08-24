import { Typography,
  Grid,
  Stack,
  Box,
  Icon,
  Button,
  Divider,
  Table, 
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { colors } from '../../services/const';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import { LineChart } from '@mui/x-charts/LineChart';
import ProductBrief from '../../components/admin/ProductBrief';
import { shortHandFormat, formatVNDCurrency } from '../../utils/currencyUtils';

const Dashboard = () => {
  const xLabels = [
    'HAI',
    'BA',
    'TƯ',
    'NĂM',
    'SÁU',
    'BẢY',
    'CN'
  ];

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  }).format;

  const createData = (orderId, quantityOfProduct, createdAt, customerAvatar, customerName, status, total) => {
    return {orderId, quantityOfProduct, createdAt, customerAvatar, customerName, status, total}
  }

  const rows = [
    createData('#1', '4', '15/06/2024', 'https://static.vecteezy.com/system/resources/previews/026/829/465/non_2x/beautiful-girl-with-autumn-leaves-photo.jpg', 'Phuong Le', 'Đang giao', 2000000),
    createData('#2', '4', '15/06/2024', 'https://static.vecteezy.com/system/resources/previews/026/829/465/non_2x/beautiful-girl-with-autumn-leaves-photo.jpg', 'Nhật Thăng', 'Chờ xác nhận', 2000000),
    createData('#3', '4', '15/06/2024', 'https://static.vecteezy.com/system/resources/previews/026/829/465/non_2x/beautiful-girl-with-autumn-leaves-photo.jpg', 'Đăng Tài', 'Đã giao', 2000000),
    createData('#4', '4', '15/06/2024', 'https://static.vecteezy.com/system/resources/previews/026/829/465/non_2x/beautiful-girl-with-autumn-leaves-photo.jpg', 'Thủy Lê', 'Đang giao', 2000000),
    createData('#5', '4', '15/06/2024', 'https://static.vecteezy.com/system/resources/previews/026/829/465/non_2x/beautiful-girl-with-autumn-leaves-photo.jpg', 'Phạm Phương', 'Đang giao', 2000000)
  ]

  return (
    <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0, paddingBottom: '160px' }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '24px'
        }}
      >
        TỔNG QUAN
      </Typography>
      <AppBreadcrumbs />
      <Grid container marginTop={'24px'} gap={1}>
        <Grid 
          item xs={12} md 
          bgcolor={'#fff'}
          padding={'24px 16px'}
          borderRadius={'16px'}
        >
          <GridItemContent heading={'Doanh Thu Tháng'} DataIcon={AttachMoneyIcon} data={'12.500.000'} percentage={'12.5%'} isMoney={true}/>
        </Grid>
        <Grid 
          item xs={12} md 
          bgcolor={'#fff'}
          padding={'24px 16px'}
          borderRadius={'16px'}
        >
          <GridItemContent heading={'Đơn Hàng'} DataIcon={EventNoteOutlinedIcon} data={'160'} percentage={'12.5%'}/>
        </Grid>
        <Grid 
          item xs={12} md 
          bgcolor={'#fff'}
          padding={'24px 16px'}
          borderRadius={'16px'}
        >
          <GridItemContent heading={'Khách Hàng Mới'} DataIcon={PersonOutlineOutlinedIcon} data={'115'} percentage={'12.5%'}/>
        </Grid>
      </Grid>

      <Grid container marginTop={'16px'} gap={1}>
        <Grid 
          item 
          xs={12}
          sm
          lg
          xl={8}
          bgcolor={'#fff'}
          borderRadius={'16px'}
          padding={'24px 16px'}
        >
          <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ md: 'center' }} justifyContent={{ md: 'space-between' }}>
            <Typography fontSize={'20px'} fontWeight={600}>
              Biểu đồ Lợi nhuận
            </Typography>
            <Stack 
              marginTop={{xs: '8px', md: '0'}} 
              direction={'row'} 
              justifyContent={'space-between'}
              gap={'12px'}
            >
              <Button 
                variant='outlined' 
                sx={{ 
                  fontSize: '14px',
                  height: '32px',
                  paddingX: '16px',
                  flexGrow: 1,
                  width: {
                    xs: 'auto',
                    md: '120px'
                  },
                  borderColor: colors.primaryColor,
                  color: colors.primaryColor 
                }}
              >
                TUẦN
              </Button>
              <Button 
                variant='outlined' 
                sx={{ 
                  fontSize: '14px',
                  height: '32px',
                  paddingX: '16px',
                  flexGrow: 1,
                  width: {
                    xs: 'auto',
                    md: '120px'
                  },
                  borderColor: colors.primaryColor,
                  color: colors.primaryColor 
                }}
              >
                THÁNG
              </Button>
              <Button 
                variant='outlined' 
                sx={{ 
                  fontSize: '14px',
                  height: '32px',
                  paddingX: '16px',
                  flexGrow: 1,
                  width: {
                    xs: 'auto',
                    md: '120px'
                  },
                  borderColor: colors.primaryColor,
                  color: colors.primaryColor 
                }}
              >
                 NĂM
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ marginTop: '16px' }}/>
          <LineChart
            xAxis={[
              { 
                scaleType: 'point',
                data: xLabels,
              }
            ]}
            yAxis={[
              {
                valueFormatter: (v) => (shortHandFormat(v))
              }
            ]}
            series={[
              {
                data: [1000000, 2000000, 1500000, 1500000, 160500, 800000, 1500000],
                color: colors.primaryColor,
                valueFormatter: (v) => (v === null ? '' : currencyFormatter(v))
              },
            ]}
            height={300}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm
          lg
          bgcolor={'#fff'}
          borderRadius={'16px'}
          padding={'24px 16px'}
        >
          <Typography fontSize={'20px'} fontWeight={600}>
            Bán Chạy Nhất
          </Typography>
          <Divider sx={{ marginTop: '16px' }}/>
          <Stack direction={'column'} marginTop={'16px'} gap={'12px'}>
            <ProductBrief 
              imageUrl="https://m.media-amazon.com/images/I/61resYXS9yL._AC_UY1100_.jpg"
              name="Áo bra thể thao tập gym có khóa kéo giữa L34AD001"
              price='88.000'
              totalSales='29'
              revenue={shortHandFormat(512000)}
            />
            <ProductBrief 
              imageUrl="https://m.media-amazon.com/images/I/61resYXS9yL._AC_UY1100_.jpg"
              name="Áo bra thể thao tập gym có khóa kéo giữa L34AD001"
              price='88.000'
              totalSales='29'
              revenue={shortHandFormat(512000)}
            />
            <ProductBrief 
              imageUrl="https://m.media-amazon.com/images/I/61resYXS9yL._AC_UY1100_.jpg"
              name="Áo bra thể thao tập gym có khóa kéo giữa L34AD001"
              price='88.000'
              totalSales='29'
              revenue={shortHandFormat(512000)}
            />
            <ProductBrief 
              imageUrl="https://m.media-amazon.com/images/I/61resYXS9yL._AC_UY1100_.jpg"
              name="Áo bra thể thao tập gym có khóa kéo giữa L34AD001"
              price='88.000'
              totalSales='29'
              revenue={shortHandFormat(512000)}
            />
          </Stack>
        </Grid>
      </Grid>
      
      <Box marginTop={'24px'} borderRadius={'16px'} bgcolor={'#fff'} padding={'24px 16px'}>
          <Stack direction={{sm: 'row'}} justifyContent={'space-between'} alignItems={'center'} gap={{ xs: 1, sm: 'auto' }}>
            <Typography fontSize={'20px'} fontWeight={600}>
              Đơn Hàng Gần Đây
            </Typography>
            <Button 
              variant='contained' 
              sx={{ 
                paddingX: '16px',
                bgcolor: colors.primaryColor,
                color: '#fff',
                borderRadius: '8px', 
                '&:hover': {
                  bgcolor: '#8893cd'
                },
              }}
            >
              Xem tất cả
            </Button>
          </Stack>

          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-label='Recent Orders Table'>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Mã đơn</TableCell>
                  <TableCell align='center'>Số lượng sản phẩm</TableCell>
                  <TableCell align='center'>Ngày đặt</TableCell>
                  <TableCell align='center'>Tên khách hàng</TableCell>
                  <TableCell align='center'>Trạng thái</TableCell>
                  <TableCell align='right'>Tổng tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow
                    key={row.orderId}
                  >
                    <TableCell align='left'>{row.orderId}</TableCell>
                    <TableCell align='center'>{row.quantityOfProduct}</TableCell>
                    <TableCell align='center'>{row.createdAt}</TableCell>
                    <TableCell align='left' sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Box sx={{ width: '24px', height: '24px', borderRadius: '100%', overflow: 'hidden' }}>
                        <img 
                          src={row.customerAvatar} 
                          alt="avatar"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />  
                      </Box> 
                      {row.customerName}
                    </TableCell>
                    <TableCell align='left'>{row.status}</TableCell>
                    <TableCell align='right'>{formatVNDCurrency(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      </Box>
    </Box>
  )
}

const GridItemContent = ({ heading, data, percentage, isMoney = false, DataIcon }) => (
  <Box>
    <Typography fontWeight={600}>{heading}</Typography>
      <Stack marginTop={'8px'} direction={'row'} justifyContent={'space-between'}>
        <Box display={'flex'} gap={'12px'}>
          <Icon 
            sx={{
              bgcolor: colors.primaryColor, 
              color: '#fff', 
              borderRadius: '8px' 
            }}
          >
            <DataIcon sx={{ scale: 0.7}}/>
          </Icon>
          <Typography fontWeight={600}>
            {isMoney && (<span style={{textDecoration: 'underline'}}>đ</span>)}
            {data}
          </Typography>
        </Box>
        <Box display={'flex'}>
          <Icon>
            <ArrowUpwardIcon sx={{ fill: '#45C266', scale: 0.8 }} />
          </Icon>
          <Typography color={'#45C266'} fontSize={'14px'} fontWeight={500}>
            {percentage}
          </Typography>
        </Box>
      </Stack>
      <Typography marginTop={'4px'} fontSize={'14px'} width={'100%'} textAlign={'end'}>
        So với tháng trước
      </Typography>
  </Box>
)

export default Dashboard