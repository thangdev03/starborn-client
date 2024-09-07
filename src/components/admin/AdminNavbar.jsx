import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  List,
  ListItemButton,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { colors } from '../../services/const'
import Stack from '@mui/material/Stack'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import { Link, useLocation } from 'react-router-dom';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';

const AdminNavbar = ({activeNav, handleCloseNavbar = () => {}}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    windowWidth < 900 ? (
      <Box
          display={activeNav ? 'block' : 'none'}
          sx={{
          position: 'fixed', 
          zIndex: 1000, 
          top: 0,
          right: 0,
          left: 0,
          bottom: 0, 
          bgcolor: 'rgba(0,0,0,0.2)',
          }}
          onClick={handleCloseNavbar}
      >
        <Stack
          direction='column'
          alignItems='center'
          paddingX={'8px'}
          sx={{
            width: {xs: '70%'},
            height: '100vh',
            bgcolor: '#FAFAFA',
            position: {xs: 'fixed'},
            top: 0,
            left: 0,
            boxShadow: 2,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography 
            sx={{
              marginTop: {xs: '20px'},
              color: colors.primaryColor,
              fontWeight: 700,
              wordSpacing: '3%',
              fontSize: 32
            }}
          >
              Starborn
          </Typography>
          <List 
            sx={{
              mt: {xs: '16px'},
              color: colors.primaryColor,
              fontSize: '16px',
              fontWeight: 700,
              width: '100%',
              maxWidth: '216px'
            }}
          >
            <NavItem link='dashboard' icon={DashboardOutlinedIcon} label='TỔNG QUAN' handleCloseNavbar={handleCloseNavbar}/>
            <NavItem 
              icon={CategoryOutlinedIcon} 
              label='DANH MỤC'
              nestedList={[
                {
                  title: 'Đối tượng sử dụng',
                  link: 'objects'
                }, 
                {
                  title: 'Danh mục SP',
                  link: 'categories'
                }, 
                {
                  title: 'Tiểu danh mục SP',
                  link: 'subcategories'
                }
              ]}
              handleCloseNavbar={handleCloseNavbar}
            />
            <NavItem link='products' icon={Inventory2OutlinedIcon} label='TẤT CẢ SẢN PHẨM' handleCloseNavbar={handleCloseNavbar}/>
            <NavItem link='orders' icon={EventNoteOutlinedIcon} label='ĐƠN HÀNG' handleCloseNavbar={handleCloseNavbar}/>
            <NavItem link='customers' icon={PersonOutlineOutlinedIcon} label='KHÁCH HÀNG' handleCloseNavbar={handleCloseNavbar}/>
            <NavItem link='coupons' icon={DiscountOutlinedIcon} label='MÃ GIẢM GIÁ' handleCloseNavbar={handleCloseNavbar}/>
            <NavItem link='news' icon={NewspaperOutlinedIcon} label='TIN TỨC' handleCloseNavbar={handleCloseNavbar}/>
          </List>
        </Stack>
      </Box>
    ) : (
      <Stack
        direction='column'
        alignItems='center'
        sx={{
          width: '280px',
          height: '100vh',
          bgcolor: '#FAFAFA',
          position: 'fixed',
          paddingX: '8px',
          top: 0,
          left: 0,
          boxShadow: 2,
        }}
      >
        <Typography 
          sx={{
            marginTop: {xs: '20px'},
            color: colors.primaryColor,
            fontWeight: 700,
            wordSpacing: '3%',
            fontSize: 32
          }}
        >
            Starborn
        </Typography>
        <List 
          sx={{
            mt: {xs: '16px'},
            color: colors.primaryColor,
            fontSize: '16px',
            fontWeight: 700,
            width: '100%',
            maxWidth: '216px',
          }}
        >
          <NavItem link='dashboard' icon={DashboardOutlinedIcon} label='TỔNG QUAN' />
          <NavItem 
            link='categories' 
            icon={CategoryOutlinedIcon} 
            label='DANH MỤC'
            nestedList={[
              {
                title: 'Đối tượng sử dụng',
                link: 'objects'
              }, 
              {
                title: 'Danh mục SP',
                link: 'categories'
              }, 
              {
                title: 'Tiểu danh mục SP',
                link: 'subcategories'
              }
            ]}
          />
          <NavItem link='products' icon={Inventory2OutlinedIcon} label='TẤT CẢ SẢN PHẨM' />
          <NavItem link='orders' icon={EventNoteOutlinedIcon} label='ĐƠN HÀNG' />
          <NavItem link='customers' icon={PersonOutlineOutlinedIcon} label='KHÁCH HÀNG' />
          <NavItem link='coupons' icon={DiscountOutlinedIcon} label='MÃ GIẢM GIÁ' />
          <NavItem link='news' icon={NewspaperOutlinedIcon} label='TIN TỨC' />
        </List>
      </Stack>
    )
  )
}

const NavItem = ({icon: Icon, label, link, nestedList = null, handleCloseNavbar = () => {}}) => {
  const [open, setOpen] = useState(false);
  const [isCurrentPage, setIsCurrentPage] = useState(false);
  const toggleNestedList = () => {
    setOpen((prev) => !prev);
  };
  const { pathname } = useLocation();
  useEffect(() => {
    if (!nestedList) {
      if (pathname === `/admin/${link}`) {
        setIsCurrentPage(true);
      } else {
        setIsCurrentPage(false);
      }
    }
  },[pathname]);

  return (
    <>
      <ListItemButton 
        sx={{ 
          paddingY: 0,
          width: '100%',
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
          bgcolor: !nestedList && isCurrentPage && colors.primaryColor,
          '&:hover': {
            bgcolor: !nestedList && (isCurrentPage && colors.primaryColor)
          }
        }}
      >
        <Link 
          to={!nestedList && `/admin/${link}`} 
          style={{
            paddingTop: '16px',
            paddingBottom: '16px',
            textDecoration: 'none',
            color: !nestedList && isCurrentPage ? 'white' : colors.primaryColor,
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => !nestedList ? handleCloseNavbar() : toggleNestedList()}
        >
          <Icon sx={{ fontSize: '16px', mr: '8px' }}/>
          {label}
        </Link>
        {nestedList && (open ? (
          <IconButton
            sx={{
              position: 'absolute',
              right: 0
            }}
            onClick={toggleNestedList}
          >
            <ExpandLessRounded />
          </IconButton>
        ) : (
          <IconButton
            sx={{
              position: 'absolute',
              right: 0
            }}
            onClick={toggleNestedList}
          >
            <ExpandMoreRounded />
          </IconButton>
        ))}
      </ListItemButton>
      {nestedList && (
        <Collapse in={open} timeout={'auto'} unmountOnExit>
          <List component={'div'} disablePadding>
            {nestedList.map((item, index) => {
              let isCurrentLink = (pathname === '/admin/' + item.link);
              return (
                <ListItemButton key={index} sx={{ px: 0, py: 0 }} onClick={handleCloseNavbar}>
                    <Link 
                      style={{
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        paddingLeft: '32px',
                        paddingRight: '16px',
                        textDecoration: 'none',
                        color: isCurrentLink ? 'white' : colors.primaryColor,
                        backgroundColor: isCurrentLink && colors.primaryColor,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      to={`/admin/${item.link}`}
                    >
                      {item.title}
                    </Link>
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      )}
    </>
)};

export default AdminNavbar