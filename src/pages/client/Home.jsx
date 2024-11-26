import {
  Box,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageSlider from "../../components/client/ImageSlider";
import HeadingText from "../../components/client/HeadingText";
import ProductCarousel from "../../components/client/ProductCarousel";
import { serverUrl } from "../../services/const";
import axios from "axios";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { colors } from "../../services/const";
import RedButton from "../../components/common/RedButton";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

const Home = () => {
  const IMAGES = [
    "../assets/img/collection1.jpg",
    "../assets/img/collection2.jpg",
    "../assets/img/collection3.jpg",
    "../assets/img/collection4.jpg",
    "../assets/img/collection5.jpg",
  ];
  const [flashSaleProducts, setFlashSaleProducts] = useState(null);
  const [hottestProducts, setHottestProducts] = useState(null);
  const [newestProducts, setNewestProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Small devices (mobile)
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablets

  const getFlashSaleProducts = () => {
    setIsLoading(true);
    axios
      .get(serverUrl + "products?getVariants=1", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const result = res.data.filter(i => i.is_active === 1);
        if (result) {
          setFlashSaleProducts(result.filter(i => i.is_featured === 1));
          setHottestProducts([...result].sort((a, b) => Number(b.total_purchase) - Number(a.total_purchase)).slice(0, 8));
          setNewestProducts([...result].sort((a, b) => b.id - a.id).slice(0, 10));
        } else {
          setFlashSaleProducts([]);
          setHottestProducts([]);
          setHottestProducts([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getFlashSaleProducts();
  }, []);

  const getStyles = () => {
    if (isMobile) {
      return {
        labelStyle: {
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
        },
        digitBlockStyle: { width: 25, height: 40, fontSize: 20 },
        separatorStyle: { color: colors.primaryColor, size: "4px" },
      };
    } else if (isTablet) {
      return {
        labelStyle: {
          fontSize: 12,
          fontWeight: 500,
          textTransform: "uppercase",
        },
        digitBlockStyle: { width: 35, height: 50, fontSize: 25 },
        separatorStyle: { color: colors.primaryColor, size: "5px" },
      };
    } else {
      return {
        labelStyle: {
          fontSize: 14,
          fontWeight: 500,
          textTransform: "uppercase",
        },
        digitBlockStyle: { width: 40, height: 60, fontSize: 30 },
        separatorStyle: { color: colors.primaryColor, size: "6px" },
      };
    }
  };

  const styles = getStyles();

  return (
    <Box>
      <ImageSlider imageUrls={IMAGES} showText={true}/>

      {/* ---------------------FLASH SALE SECTION---------------------- */}
      {
        flashSaleProducts?.length !== 0 && (
          <Box
            sx={{
              marginTop: "32px",
              padding: {
                xs: "8px",
                sm: "0 52px",
              },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent={"space-between"}
              alignItems={{ xs: "start", md: "end" }}
            >
              <HeadingText title={"Hôm nay"} subtitle={"Flash Sale"} />
              <Stack justifyContent={"end"}>
                <Box sx={{ flexGrow: 1 }} />
                <Box>
                  <FlipClockCountdown
                    showSeparators={true}
                    to={new Date().getTime() + 1 * 3600 * 1000}
                    labels={["NGÀY", "GIỜ", "PHÚT", "GIÂY"]}
                    labelStyle={styles.labelStyle}
                    digitBlockStyle={styles.digitBlockStyle}
                    separatorStyle={styles.separatorStyle}
                    duration={0.5}
                    hideOnComplete={false}
                  ></FlipClockCountdown>
                </Box>
              </Stack>
            </Stack>

            <Box sx={{ marginTop: "24px" }}>
              <ProductCarousel products={flashSaleProducts} isLoading={isLoading} />
            </Box>

            <Stack
              width={"100%"}
              direction={"row"}
              justifyContent={"center"}
              marginTop={"32px"}
            >
              <RedButton title="Xem Tất Cả" />
            </Stack>
          </Box>
        )
      }

      {/* ---------------------MOST POPULAR SECTION---------------------- */}
      <Box
        sx={{
          marginTop: "32px",
          padding: {
            xs: "8px",
            sm: "0 52px",
          },
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <HeadingText title={"Hàng HOT giá xịn"} subtitle={"Phổ biến nhất"} />
          <Stack sx={{ pb: "8px" }}>
            <Box sx={{ flexGrow: 1 }} />
            <RedButton title={"Khám Phá Thêm"} />
          </Stack>
        </Stack>

        <Box sx={{ marginTop: "24px" }}>
          <ProductCarousel products={hottestProducts} isLoading={isLoading} />
        </Box>
      </Box>

      {/* ---------------------NEW PRODUCTS SECTION---------------------- */}
      <Box
        sx={{
          marginTop: "32px",
          padding: {
            xs: "8px",
            sm: "0 52px",
          },
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <HeadingText title={"Đặc biệt"} subtitle={"Sản phẩm mới"} />
          <Stack sx={{ pb: "8px" }}>
            <Box sx={{ flexGrow: 1 }} />
            <RedButton title={"Khám Phá Thêm"} />
          </Stack>
        </Stack>

        <Box sx={{ marginTop: "24px", marginBottom: "60px" }}>
          <ProductCarousel products={newestProducts} isLoading={isLoading} />
        </Box>
      </Box>

      {/* ---------------------COLLECTIONS SECTION---------------------- */}
      <Grid
        container
        width={"100%"}
        marginTop={"60px"}
        columnSpacing={{ md: "16px" }}
        rowSpacing={{ md: "12px" }}
      >
        <Grid item xs={12} position={"relative"}>
          <img
            src="../assets/img/summer-collection.png"
            alt="summer collection"
            style={{
              width: "100%",
              minHeight: "220px",
              objectFit: "cover",
            }}
          />
          <Stack
            justifyContent={"center"}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translateX(-50%) translateY(-50%)",
            }}
          >
            <Typography
              fontSize={{ xs: "24px", md: "36px" }}
              fontWeight={600}
              color={"white"}
              sx={{
                marginBottom: "20px",
                flexGrow: 1,
                textAlign: "center",
                textWrap: "nowrap",
              }}
            >
              BỘ SƯU TẬP HÈ 2024
            </Typography>

            <Stack direction={"row"} justifyContent={"center"}>
              <RedButton title={"KHÁM PHÁ NGAY"} />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} position={"relative"}>
          <img
            src="../assets/img/spring-summer-collection-2024.png"
            alt="spring - summer collection 2024"
            style={{
              width: "100%",
              minHeight: "220px",
              objectFit: "cover",
            }}
          />
          <Stack
            sx={{
              position: "absolute",
              top: { xs: "50%", sm: "10%" },
              left: { xs: "50%", sm: "10%" },
              transform: {
                xs: "translateX(-50%) translateY(-50%)",
                sm: "none",
              },
            }}
          >
            <Typography
              fontSize={{ xs: "24px", md: "36px" }}
              fontWeight={600}
              color={"white"}
              sx={{
                marginBottom: "20px",
                flexGrow: 1,
                textWrap: "nowrap",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              BST ÁO BRA <br />
              XUÂN/ HÈ 2024
            </Typography>

            <Stack
              direction={"row"}
              justifyContent={{ xs: "center", sm: "start" }}
              flexShrink={0}
            >
              <RedButton title={"KHÁM PHÁ NGAY"} />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} position={"relative"}>
          <img
            src="../assets/img/office-collection.png"
            alt="spring - summer collection 2024"
            style={{
              width: "100%",
              minHeight: "220px",
              objectFit: "cover",
            }}
          />
          <Stack
            sx={{
              position: "absolute",
              top: { xs: "50%", sm: "10%" },
              left: { xs: "50%", sm: "10%" },
              transform: {
                xs: "translateX(-50%) translateY(-50%)",
                sm: "none",
              },
            }}
          >
            <Typography
              fontSize={{ xs: "24px", md: "36px" }}
              fontWeight={600}
              color={"white"}
              sx={{
                marginBottom: "20px",
                flexGrow: 1,
                textWrap: "nowrap",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              BST THỜI TRANG <br />
              CÔNG SỞ
            </Typography>

            <Stack
              direction={"row"}
              justifyContent={{ xs: "center", sm: "start" }}
              flexShrink={0}
            >
              <RedButton title={"KHÁM PHÁ NGAY"} />
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* ---------------------POLICIES SECTION------------------------ */}
      <Stack
        direction={"row"}
        marginTop={"80px"}
        justifyContent={"space-around"}
        flexWrap={"wrap"}
        gap={"20px"}
      >
        <Stack alignItems={"center"}>
          <Box
            sx={{
              bgcolor: "rgba(27, 33, 65, 0.2)",
              padding: "8px",
              borderRadius: "100%",
              flexGrow: 0,
              width: "fit-content",
            }}
          >
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                bgcolor: colors.primaryColor,
                width: "60px",
                height: "60px",
                borderRadius: "100%",
              }}
            >
              <LocalShippingOutlinedIcon
                sx={{ color: "white", fontSize: "36px" }}
              />
            </Stack>
          </Box>
          <Typography sx={{ mt: "16px", fontSize: "20px", fontWeight: 600 }}>
            MIỄN PHÍ GIAO HÀNG
          </Typography>
          <Typography sx={{ mt: "8px", fontSize: "14px" }}>
            cho tất cả các đơn trên 200.000đ
          </Typography>
        </Stack>

        <Stack alignItems={"center"}>
          <Box
            sx={{
              bgcolor: "rgba(27, 33, 65, 0.2)",
              padding: "8px",
              borderRadius: "100%",
              flexGrow: 0,
              width: "fit-content",
            }}
          >
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                bgcolor: colors.primaryColor,
                width: "60px",
                height: "60px",
                borderRadius: "100%",
              }}
            >
              <SupportAgentOutlinedIcon
                sx={{ color: "white", fontSize: "36px" }}
              />
            </Stack>
          </Box>
          <Typography sx={{ mt: "16px", fontSize: "20px", fontWeight: 600 }}>
            HỖ TRỢ 24/7
          </Typography>
          <Typography sx={{ mt: "8px", fontSize: "14px" }}>
            hỗ trợ khách hàng 24/7 và thân thiện
          </Typography>
        </Stack>

        <Stack alignItems={"center"}>
          <Box
            sx={{
              bgcolor: "rgba(27, 33, 65, 0.2)",
              padding: "8px",
              borderRadius: "100%",
              flexGrow: 0,
              width: "fit-content",
            }}
          >
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                bgcolor: colors.primaryColor,
                width: "60px",
                height: "60px",
                borderRadius: "100%",
              }}
            >
              <VerifiedUserOutlinedIcon
                sx={{ color: "white", fontSize: "36px" }}
              />
            </Stack>
          </Box>
          <Typography sx={{ mt: "16px", fontSize: "20px", fontWeight: 600 }}>
            CHÍNH SÁCH ĐỔI TRẢ
          </Typography>
          <Typography sx={{ mt: "8px", fontSize: "14px" }}>
            miễn phí đổi trả trong vòng 7 ngày
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
