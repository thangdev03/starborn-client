import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { formatVNDCurrency, getPriceAfterDiscount } from "../../utils/currencyUtils";
import { useNavigate } from "react-router-dom";

const SearchBarResults = ({ results, closeSearchResult = () => {} }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "360px",
        maxHeight: "400px",
        overflowY: "auto"
      }}
    >
      <List>
        {
            results?.length !== 0 ?
            results?.map((product) => (
            <ListItem disablePadding key={product.id}>
                <ListItemButton
                    onClick={() => {
                        closeSearchResult();
                        navigate(`product/${product.slug}?color=${product.variants[0]?.variant_slug}`);
                    }}
                >
                <Box borderRadius={"4px"} overflow={"hidden"}>
                    <img
                    src={product?.variants[0]?.images[0]}
                    alt=""
                    width={"40px"}
                    height={"60px"}
                    style={{
                        objectFit: "cover",
                    }}
                    />
                </Box>
                <Stack gap={"4px"} marginLeft={"12px"}>
                    <Typography
                    sx={{
                        fontSize: "14px",
                    }}
                    >
                    {product.name}
                    </Typography>
                    {Number(product.variants[0]?.discount) === 0 ? (
                    <Typography fontSize={"12px"} fontWeight={600}>
                        {formatVNDCurrency(product.variants[0]?.price)}
                    </Typography>
                    ) : (
                    <Stack direction={"row"} gap={"8px"}>
                        <Typography fontSize={"12px"} fontWeight={600}>
                        {formatVNDCurrency(getPriceAfterDiscount(product.variants[0]?.price, product.variants[0]?.discount))}
                        </Typography>
                        <Typography fontSize={"12px"} sx={{ textDecoration: "line-through", opacity: 0.6 }}>
                        {formatVNDCurrency(product.variants[0]?.price)}
                        </Typography>
                    </Stack>
                    )}
                </Stack>
                </ListItemButton>
            </ListItem>
            )) : (
                <Typography padding={"8px 24px"} fontSize={"14px"} textAlign={"center"}>Không tìm thấy sản phẩm nào!</Typography>
            )
        }
      </List>
    </Box>
  );
};

export default SearchBarResults;
