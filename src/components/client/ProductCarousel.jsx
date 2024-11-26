import { Box, IconButton, Rating, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ProductGridItem from "./ProductGridItem";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import ArrowCircleRightRoundedIcon from "@mui/icons-material/ArrowCircleRightRounded";
import {
  formatVNDCurrency,
  getPriceAfterDiscount,
} from "../../utils/currencyUtils";
import { colors } from "../../services/const";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductItem from "./ProductItem";

const ProductCarousel = ({ products, isLoading }) => {
  const responsive = {
    largeDesktop: {
      breakpoint: {
        max: 3000,
        min: 1400,
      },
      items: 6,
    },
    desktop: {
      breakpoint: {
        max: 1400,
        min: 768,
      },
      items: 4,
    },
    tablet: {
      breakpoint: {
        max: 768,
        min: 464,
      },
      items: 3,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 2,
    },
  }
  return (
    <Carousel
      additionalTransform={0}
      arrows
      draggable={false}
      infinite
      centerMode={false}
      minimumTouchDrag={80}
      pauseOnHover
      partialVisbile={false}
      slidesToSlide={4}
      responsive={responsive}
      swipeable={true}
    >
      {(isLoading ? Array.from(new Array(6)) : products)?.map(
        (product, index) => (
          <ProductItem key={index} productData={product} />
        )
      )}
    </Carousel>
  );
};

export default ProductCarousel;
