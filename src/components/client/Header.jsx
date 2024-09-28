import React, { useState } from 'react'
import { Box, Stack, Typography, List, InputBase, ListItemButton, IconButton, Avatar, Drawer, Button, Icon } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { colors } from '../../services/const';
import SearchIcon from '@mui/icons-material/Search'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { openAuthModal, currentUser } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  const toggleDrawer = (state) => {
    setOpenMenu(state)
  };

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: '0.5px solid', borderColor: 'rgba(27,33,65,0.5)', bgcolor: 'white' }}>
        <Stack 
        direction={'row'}
        gap={'4px'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
            bgcolor: colors.primaryColor,
            color: 'white',
            padding: '8px 0',
            display: {
                xs: 'none',
                sm: 'flex'
            }
        }}
        >
            <Typography 
            sx={{
              fontFamily: 'Roboto',
              color: 'white',
              fontWeight: 400,
              fontSize: '14px'
            }}
            >
                6.6 NGÀY ĐÔI SALE BỘI - GIẢM TỚI 50% VÀ NHIỀU MÃ FREESHIP!
            </Typography>
            <Link
            to='/'
            sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: 'white',
                '&:hover': {
                    textDecorationColor: 'white',
                }
            }}
            >
                <Stack direction={'row'} alignItems={'center'}>
                    <Typography 
                    sx={{
                        fontFamily: 'Roboto',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 600,
                        display: 'inline-block'
                    }}>
                        Khám phá ngay
                    </Typography>
                    <ArrowForwardRoundedIcon sx={{ color: 'white', fontSize: '16px', fontWeight: 600 }}/>
                </Stack>
            </Link>
        </Stack>

        <Stack 
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        sx={{
            padding: {
                xs: '8px 8px',
                sm: '8px 52px'
            },
            paddingY: {
                lg: '0px'
            }
        }}
        >
            <Box 
            sx={{ 
                width: {
                    sm: '120px'
                },
                display: {
                    xs: 'block',
                    lg: 'none'
                } 
            }}
            >
                <IconButton onClick={() => toggleDrawer(true)}>
                    <MenuRoundedIcon sx={{ color: colors.primaryColor }}/>
                </IconButton>
                <IconButton>
                    <SearchIcon sx={{ color: colors.primaryColor }}/>
                </IconButton>
            </Box>

            <Link
                to="/"
                style={{
                    width: {xl: '200px'},
                    fontWeight: 700,
                    fontSize: '24px',
                    textDecoration: 'none',
                    color: colors.primaryColor
                }}
            >
                Starborn
            </Link>

            <List 
                sx={{
                    display: {xs: 'none', lg: 'flex'},
                    flexDirection: 'row',
                    paddingY: 0,
                    height: '62px',
                    color: colors.primaryColor,
                }}
            >
                <Link to={'/'} className='nav-link'>
                    SALE
                </Link>
                <Link to={'/'} className='nav-link'>
                    Bộ sưu tập
                </Link>
                <Link to={'/nam'} className='nav-link'>
                    Nam
                </Link>
                <Link to={'/nu'} className='nav-link'>
                    Nữ
                </Link>
                <Link to={'/'} className='nav-link'>
                    Đồ thể thao
                </Link>
                <Link to={'/'} className='nav-link'>
                    Mặc hàng ngày
                </Link>
            </List>
            
            <Stack direction={'row'} alignItems={'center'} gap='24px'>
                <Stack direction={'row'} alignItems={'center'} 
                sx={{ 
                    bgcolor: colors.secondaryColor, 
                    width: '200px', 
                    display: {xs: 'none', lg: 'flex'}
                }}
                >
                    <InputBase
                    placeholder='Tìm kiếm sản phẩm'
                    sx={{ 
                        padding: '4px 0px 4px 12px', 
                        color: colors.primaryColor,
                        borderRadius: '4px'
                    }}
                    />
                    <IconButton>
                        <SearchIcon sx={{ color: colors.primaryColor }}/>
                    </IconButton>
                </Stack>
                <Stack direction={'row'} alignItems={'center'}>
                    <IconButton sx={{ display: {xs: 'none', sm: 'block'}, height: '44px' }}>
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3313 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9738 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4613 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1812 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8188 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z" fill="#1B2141"/>
                        </svg>
                    </IconButton>

                    <IconButton href='/cart'>
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z" stroke="#1B2141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z" stroke="#1B2141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 5H7L10 22H26" stroke="#1B2141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 18H25.59C25.7056 18.0001 25.8177 17.9601 25.9072 17.8868C25.9966 17.8135 26.0579 17.7115 26.0806 17.5981L27.8806 8.59813C27.8951 8.52555 27.8934 8.45066 27.8755 8.37886C27.8575 8.30705 27.8239 8.24012 27.7769 8.1829C27.73 8.12567 27.6709 8.07959 27.604 8.04796C27.5371 8.01633 27.464 7.99995 27.39 8H8" stroke="#1B2141" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </IconButton>
                    {console.log(currentUser)}
                    {currentUser ? (
                        <Avatar 
                        onClick={openAuthModal} 
                        sx={{ marginLeft: '4px', bgcolor: colors.red, width: '34px', height: '34px', cursor: 'pointer' }}>
                            {currentUser.fullname[0]}
                        </Avatar>
                    ) : (
                        <Typography>Đăng nhập</Typography>
                    )}
                </Stack>
            </Stack>
        </Stack>

        {/* --------------------------- MOBILE MENU -------------------------------- */}
        <Drawer open={openMenu} onClose={() => toggleDrawer(false)} sx={{ display: {lg: 'none'} }}>
            <Stack sx={{ width: '250px', height: '100vh' }} onClick={() => toggleDrawer(false)} justifyContent={'space-between'}>
                <List 
                sx={{
                    flexDirection: 'column',
                    color: colors.primaryColor,
                }}
                >
                    <MobileNavItem 
                        title={'SALE'}
                        href={'/'}
                    />
                    <MobileNavItem 
                        title={'Bộ sưu tập'}
                        href={'/'}
                    />
                    <MobileNavItem 
                        title={'Nam'}
                        href={'/nam'}
                    />
                    <MobileNavItem 
                        title={'Nữ'}
                        href={'/nu'}
                    />
                    <MobileNavItem 
                        title={'Đồ thể thao'}
                        href={'/'}
                    />
                    <MobileNavItem 
                        title={'Mặc hàng ngày'}
                        href={'/'}
                    />
                </List>
                <ListItemButton 
                href='/'
                sx={{ color: colors.primaryColor, flexGrow: 0, marginBottom: '24px', justifyContent: 'space-between' }}
                >
                    Sản phẩm đã thích
                    <Icon sx={{ display: {xs: 'block', sm: 'none'} }}>
                        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3313 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9738 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4613 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1812 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8188 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z" fill="#1B2141"/>
                        </svg>
                    </Icon>
                </ListItemButton>
            </Stack>
        </Drawer>
    </Box>
  )
}

const MobileNavItem = ({ title, href }) => {
    return (
        <ListItemButton sx={{ justifyContent: 'space-between' }}>
            <Link to={href} style={{ color: colors.primaryColor, textDecoration: 'none', padding: '10px 16px' }}>
                {title}
            </Link>
            <ChevronRightRoundedIcon sx={{ fontSize: '18px' }}/>
        </ListItemButton>
    )
}

export default Header