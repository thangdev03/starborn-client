import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { colors } from '../../services/const'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import axios from 'axios';

const AddressItem = ({ address, handleSetDefault = () => {}, onClickUpdate = () => {}, onClickDelete = () => {} }) => {
  const fullAddress = [
    address.address,
    address.ward,
    address.district,
    address.province
  ];

  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Stack gap={"12px"} width={"70%"}>
          <Stack direction={"row"} alignItems={"center"} gap={"12px"} height={"32px"}>
            <Typography fontWeight={500}>
              {address.receiver_name}
            </Typography>

            {address.is_default === 1 && (
              <Stack 
                direction={"row"} 
                bgcolor={colors.red} 
                alignItems={"center"} 
                justifyContent={"center"}
                gap={"4px"}
                sx={{
                  width: "100px",
                  height: "32px",
                  borderRadius: "4px"
                }}
              >
                <StarRoundedIcon sx={{ color: colors.yellow }}/>
                <Typography sx={{ color: "white", fontSize: "12px" }}>Mặc định</Typography>
              </Stack>
            )}
          </Stack>
          <Typography sx={{ opacity: 0.6 }}>{address.receiver_phone}</Typography>
          <Typography sx={{ opacity: 0.6, textWrap: "wrap" }}>{fullAddress.filter(i => i !== null).join(", ")}</Typography>
        </Stack>

        <Stack justifyContent={"space-between"}>
          <Stack direction={"row"} gap={"12px"} flexGrow={0} justifyContent={"right"}>
            <Typography onClick={onClickUpdate} color={"#334FE0"} sx={{ cursor: "pointer", "&:hover": { color: colors.primaryColor } }}>Cập nhật</Typography>
            <Divider orientation="vertical" flexItem/>
            <Typography onClick={onClickDelete} color={"#334FE0"} sx={{ cursor: "pointer", "&:hover": { color: colors.primaryColor } }}>Xóa</Typography>
          </Stack>
          {!address.is_default && (
            <Button
              variant="outlined"
              onClick={handleSetDefault}
              sx={{
                color: colors.primaryColor,
                textTransform: "inherit",
                borderColor: colors.primaryColor,
                "&:hover": {
                  borderColor: colors.primaryColor
                },
                borderRadius: "32px"
              }}
            >
              Đặt làm mặc định
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider sx={{ marginTop: "24px" }}/>
    </Box>
  )
}

export default AddressItem