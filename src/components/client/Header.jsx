import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography, List, InputBase, ListItemButton, IconButton, Avatar, Drawer, Button, Icon, Paper, ListItem, ListItemText, debounce, CircularProgress } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { colors, serverUrl } from '../../services/const';
import SearchIcon from '@mui/icons-material/Search'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useCart } from "../../contexts/CartContext";
import SearchBarResults from './SearchBarResults';
import axios from 'axios';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

const Header = () => {
  const { openAuthModal, handleLogout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [openUserActions, setOpenUserActions] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const accountType = JSON.parse(localStorage.getItem('accountType'));
  const { quantity } = useCart();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [openCollectionList, setOpenCollectionList] = useState(false);
  const [level, setLevel] = useState(0);
  const location = useLocation();
  const searchBarRef = useRef(null);
  const collectionListRef = useRef(null);
  const profileRef = useRef(null);
  const [searching, setSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const closeSearchResult = () => {
    setShowSearchResult(false);
    setSearchInput("");
  };

  const openSearchResult = () => {
    setShowSearchResult(true);
  };

  const getProducts = async () => {
    axios
      .get(serverUrl + "products?getVariants=1")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => console.log(error))
  };

  const handleChangeSearch = (value) => {
    setSearchInput(value);
    setSearching(true);
    const results = products?.filter((product) => (
      product.name.toLowerCase().includes(value.toLowerCase())
    ));
    setSearchResult(results);
    setSearching(false);
  };

  const toggleDrawer = (state) => {
    setOpenMenu(state)
  };

  const toggleActionsModal = (state) => {
    setOpenUserActions(state);
  };

  useEffect(() => {
    const handleCloseModal = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        closeSearchResult();
      }
      if (collectionListRef.current && !collectionListRef.current.contains(e.target)) {
        setOpenCollectionList(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenUserActions(false);
      }
    };

    window.addEventListener("click", handleCloseModal);

    return () => window.removeEventListener("click", handleCloseModal);
  }, [])

  useEffect(() => {
    getProducts();
    axios
      .get(serverUrl + "collection")
      .then((res) => setCollectionData(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setOpenMenu(false);
    setLevel(0);
    setShowSearchResult(false);
    inputRef.current?.blur();
  }, [location])

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        borderBottom: "0.5px solid",
        borderColor: "rgba(27,33,65,0.5)",
        bgcolor: "white",
      }}
    >
      <Stack
        direction={"row"}
        gap={"4px"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          bgcolor: colors.primaryColor,
          color: "white",
          padding: "8px 0",
          display: {
            xs: "none",
            sm: "flex",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Roboto",
            color: "white",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          6.6 NGÀY ĐÔI SALE BỘI - GIẢM TỚI 50% VÀ NHIỀU MÃ FREESHIP!
        </Typography>
        <Link
          to="/"
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "white",
            "&:hover": {
              textDecorationColor: "white",
            },
          }}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <Typography
              sx={{
                fontFamily: "Roboto",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              Khám phá ngay
            </Typography>
            <ArrowForwardRoundedIcon
              sx={{ color: "white", fontSize: "16px", fontWeight: 600 }}
            />
          </Stack>
        </Link>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          padding: {
            xs: "8px 8px",
            sm: "8px 52px",
          },
          paddingY: {
            lg: "0px",
          },
        }}
      >
        <Box
          sx={{
            width: {
              sm: "120px",
            },
            display: {
              xs: "block",
              lg: "none",
            },
          }}
        >
          <IconButton onClick={() => toggleDrawer(true)}>
            <MenuRoundedIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
          <IconButton>
            <SearchIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
        </Box>

        <Link
          to="/"
          style={{
            width: { xl: "200px" },
            fontWeight: 700,
            fontSize: "24px",
            textDecoration: "none",
            color: colors.primaryColor,
          }}
        >
          Starborn
        </Link>

        <List
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "row",
            paddingY: 0,
            height: "62px",
            color: colors.primaryColor,
          }}
        >
          <Link to={"/"} className="nav-link">
            SALE
          </Link>
          <Typography
            sx={{
              cursor: "pointer",
              position: "relative",
              ":hover": { bgcolor: "transparent" },
            }}
            onClick={() => setOpenCollectionList(!openCollectionList)}
            ref={collectionListRef}
            className="nav-link"
          >
            Bộ sưu tập
            {openCollectionList && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: -4,
                  width: "220px",
                  bgcolor: "white",
                  borderRadius: "4px",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
              >
                <List>
                  {collectionData.map((collection) => (
                    <ListItem disablePadding>
                      <ListItemButton to={`/collection/${collection.slug}`}>
                        <ListItemText primary={collection.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Typography>
          <Link to={"/nam"} className="nav-link">
            Nam
          </Link>
          <Link to={"/nu"} className="nav-link">
            Nữ
          </Link>
          <Link to={"/collection/do-the-thao"} className="nav-link">
            Đồ thể thao
          </Link>
          <Link to={"/collection/mac-hang-ngay"} className="nav-link">
            Mặc hàng ngày
          </Link>
        </List>

        <Stack direction={"row"} alignItems={"center"} gap="24px">
          <Stack
            ref={searchBarRef}
            direction={"row"}
            alignItems={"center"}
            sx={{
              bgcolor: colors.secondaryColor,
              width: "200px",
              display: { xs: "none", lg: "flex" },
              borderRadius: "4px",
              position: "relative",
            }}
          >
            <InputBase
              inputRef={inputRef}
              placeholder="Tìm kiếm sản phẩm"
              value={searchInput}
              onChange={(e) => handleChangeSearch(e.target.value)}
              onFocus={() => openSearchResult()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/search?keywords=${searchInput}`);
                }
              }}
              sx={{
                padding: "4px 0px 4px 12px",
                color: colors.primaryColor,
              }}
            />
            <IconButton
              title="Thêm kết quả khác"
              onClick={() => navigate(`/search?keywords=${searchInput}`)}
            >
              <SearchIcon sx={{ color: colors.primaryColor }} />
            </IconButton>

            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: "-20px",
                marginTop: "20px",
                display: showSearchResult && searchInput ? "display" : "none",
              }}
            >
              {
                searching ? (
                  <Stack alignItems={"center"}>
                    <CircularProgress />
                  </Stack>
                ) : (
                  <SearchBarResults
                    results={searchResult}
                    closeSearchResult={() => closeSearchResult()}
                  />
                )
              }
            </Paper>
          </Stack>
          <Stack direction={"row"} alignItems={"center"}>
            {/* BUTTON TO FAVORITES PAGE */}
            <Link to={"/favorites"}>
              <IconButton
                sx={{ display: { xs: "none", sm: "block" }, height: "44px" }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3313 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9738 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4613 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1812 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8188 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z"
                    fill="#1B2141"
                  />
                </svg>
              </IconButton>
            </Link>

            {/* BUTTON TO CART PAGE */}
            <Link to={"/cart"} style={{ position: "relative" }}>
              <IconButton>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z"
                    stroke="#1B2141"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z"
                    stroke="#1B2141"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 5H7L10 22H26"
                    stroke="#1B2141"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 18H25.59C25.7056 18.0001 25.8177 17.9601 25.9072 17.8868C25.9966 17.8135 26.0579 17.7115 26.0806 17.5981L27.8806 8.59813C27.8951 8.52555 27.8934 8.45066 27.8755 8.37886C27.8575 8.30705 27.8239 8.24012 27.7769 8.1829C27.73 8.12567 27.6709 8.07959 27.604 8.04796C27.5371 8.01633 27.464 7.99995 27.39 8H8"
                    stroke="#1B2141"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
              <Typography
                sx={{
                  position: "absolute",
                  top: 0,
                  right: "-4px",
                  borderRadius: "20px",
                  paddingX: 1,
                  paddingY: "2px",
                  color: "white",
                  bgcolor: colors.red,
                  fontSize: "10px",
                }}
              >
                {quantity}
              </Typography>
            </Link>
            {currentUser && accountType === "customer" ? (
              <Box 
                ref={profileRef}
                sx={{ position: "relative" }}
              >
                <Avatar
                  onClick={() => toggleActionsModal(!openUserActions)}
                  src={currentUser?.avatar}
                  sx={{
                    marginLeft: "4px",
                    bgcolor: colors.red,
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                  }}
                >
                  {!currentUser.avatar && currentUser.fullname[0]}
                </Avatar>
                <Paper
                  sx={{
                    position: "absolute",
                    top: { xs: "120%", sm: "140%" },
                    right: { xs: 0, sm: -20 },
                    display: openUserActions ? "block" : "none",
                  }}
                >
                  <List
                    onClick={() => toggleActionsModal(false)}
                    sx={{ width: "240px", color: colors.primaryColor }}
                  >
                    <Link
                      to={"/account/info"}
                      style={{
                        textDecoration: "none",
                        color: colors.primaryColor,
                      }}
                    >
                      <ListItemButton sx={{ gap: "4px" }}>
                        <PermIdentityOutlinedIcon />
                        Tài khoản của tôi
                      </ListItemButton>
                    </Link>
                    <Link
                      to={"/account/address"}
                      style={{
                        textDecoration: "none",
                        color: colors.primaryColor,
                      }}
                    >
                      <ListItemButton sx={{ gap: "4px" }}>
                        <HomeWorkOutlinedIcon />
                        Sổ địa chỉ
                      </ListItemButton>
                    </Link>
                    <Link
                      to={"/account/orders"}
                      style={{
                        textDecoration: "none",
                        color: colors.primaryColor,
                      }}
                    >
                      <ListItemButton sx={{ gap: "4px" }}>
                        <InventoryOutlinedIcon />
                        Lịch sử đơn hàng
                      </ListItemButton>
                    </Link>
                    <Link
                      to={"/account/rating"}
                      style={{
                        textDecoration: "none",
                        color: colors.primaryColor,
                      }}
                    >
                      <ListItemButton sx={{ gap: "4px" }}>
                        <StarsOutlinedIcon />
                        Đánh giá và phản hồi
                      </ListItemButton>
                    </Link>
                    <ListItemButton onClick={handleLogout} sx={{ gap: "4px" }}>
                      <LogoutOutlinedIcon />
                      Đăng xuất
                    </ListItemButton>
                  </List>
                </Paper>
              </Box>
            ) : (
              <Button
                sx={{ color: colors.primaryColor }}
                onClick={() => openAuthModal()}
              >
                Đăng nhập
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* --------------------------- MOBILE MENU -------------------------------- */}
      <Drawer
        open={openMenu}
        onClose={() => toggleDrawer(false)}
        sx={{ display: { lg: "none" } }}
      >
        {level === 0 ? (
          <Stack
            sx={{ width: "250px", height: "100vh" }}
            // onClick={() => toggleDrawer(false)}
            justifyContent={"space-between"}
          >
            <List
              sx={{
                flexDirection: "column",
                color: colors.primaryColor,
              }}
            >
              <MobileNavItem title={"SALE"} href={"/"} />
              <ListItemButton 
                onClick={() => setLevel(level + 1)}
                sx={{ justifyContent: 'space-between' }}
              >
                <Typography sx={{ color: colors.primaryColor, padding: '10px 16px' }}>
                  Bộ sưu tập
                </Typography>
                <ChevronRightRoundedIcon sx={{ fontSize: '18px' }}/>
              </ListItemButton>
              <MobileNavItem title={"Nam"} href={"/nam"} />
              <MobileNavItem title={"Nữ"} href={"/nu"} />
              <MobileNavItem title={"Đồ thể thao"} href={"/collection/do-the-thao"} />
              <MobileNavItem title={"Mặc hàng ngày"} href={"/collection/mac-hang-ngay"} />
            </List>
            <ListItemButton
              href="/favorites"
              sx={{
                color: colors.primaryColor,
                flexGrow: 0,
                marginBottom: "24px",
                justifyContent: "space-between",
              }}
            >
              Sản phẩm đã thích
              <Icon sx={{ display: { xs: "block", sm: "none" } }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3313 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9738 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4613 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1812 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8188 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z"
                    fill="#1B2141"
                  />
                </svg>
              </Icon>
            </ListItemButton>
          </Stack>
        ) : (
          <Stack
            sx={{ width: "250px", height: "100vh" }}
          >
            <List
              sx={{
                flexDirection: "column",
                color: colors.primaryColor,
              }}
            >
              <Box paddingX={"16px"}>
                <IconButton onClick={() => setLevel(0)}>
                  <ChevronLeftRoundedIcon />
                </IconButton>
              </Box>
              {collectionData?.map((collection, index) => (
                <ListItemButton 
                  key={index} 
                  href={`/collection/${collection.slug}`}
                  sx={{ justifyContent: 'space-between', paddingX: "32px" }}
                >
                  {collection.name}
                </ListItemButton>
              ))}
            </List>
          </Stack>
        )}
      </Drawer>
    </Box>
  );
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