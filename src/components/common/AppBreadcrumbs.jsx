import React from 'react'
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { colors } from '../../services/const';
import { useLocation } from 'react-router-dom';

const AppBreadcrumbs = () => {
  const location = useLocation();
  const paths = (location.pathname.split('/').filter((x) => x));

  const breadcrumbsItem = [];

  paths.map((p, index, allPath) => {
    let title;
  
    switch (p) {
      case 'admin': 
        title = 'Trang chủ';
        break;
      case 'dashboard': 
        title = 'Tổng quan';
        break;
      case 'customers': 
        title = 'Khách hàng';
        break;
      case 'categories': 
        title = 'Danh mục sản phẩm';
        break;
      case 'subcategories': 
        title = 'Tiểu danh mục sản phẩm';
        break;
      case 'objects': 
        title = 'Đối tượng sử dụng';
        break;
      case 'products': 
        title = 'Tất cả sản phẩm';
        break;
      case 'orders': 
        title = 'Đơn hàng';
        break;
      case 'coupons': 
        title = 'Mã giảm giá';
        break;
      case 'create':
        if (allPath[index-1] === 'products') {
          title = 'Thêm sản phẩm mới';
        }
        break;
    }

    breadcrumbsItem.push({
      title: title,
      link: `/${paths.slice(0, index + 1).join('/')}`
    })
  })

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize='14px' color='inherit'/>}
      aria-label='breadcrumb'
      sx={{
        display: 'flex',
        alignItems: 'center',
        '& .MuiBreadcrumbs-separator': {
          mx: '4px',
        },
      }}
      maxItems={3}
      itemsAfterCollapse={2}
    >
      {breadcrumbsItem?.map((b, index) => {
        return (index === breadcrumbsItem.length - 1) ? (
          <Link key={index} underline='none' color={colors.primaryColor} fontSize={'14px'}>
            {b.title}
          </Link>
         ) : (
          <Link key={index} underline='hover' color={colors.primaryColor} href={b.link} fontSize={'14px'} sx={{ opacity: 0.8 }}>
            {b.title}
          </Link>
         )
      })}
    </Breadcrumbs>
  )
}

export default AppBreadcrumbs