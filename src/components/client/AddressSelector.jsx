import { Box, IconButton, Modal, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { colors, serverUrl } from "../../services/const";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "80%", sm: 500 },
  maxHeight: "60vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  pb: 3,
  px: 3,
  borderRadius: "8px",
};

const AddressSelector = ({
  open,
  selectedId = null,
  handleClose = () => {},
  handleSelect = (
    name,
    phone,
    email,
    address,
    province,
    district,
    ward,
    id
  ) => {},
}) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addressList, setAddressList] = useState([]);
  console.log(addressList);

  const getData = async () => {
    axios
      .get(serverUrl + `addresses/${currentUser.id}`)
      .then((res) => setAddressList(res.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getData();
  }, [currentUser]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 2,
            top: 2,
            zIndex: 20,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          position={"sticky"}
          top={0}
          bgcolor={"white"}
          pt={2}
          marginBottom={1}
        >
          Chọn địa chỉ của bạn
        </Typography>
        <Stack gap={"8px"}>
          {addressList
            .sort((a, b) => b.is_default - a.is_default)
            .map((address) => {
              const fullAddress = [
                address.address,
                address.ward,
                address.district,
                address.province,
              ];

              const isSelected = address.id === selectedId;
              return (
                <Box
                  onClick={() => {
                    handleSelect(
                      address.receiver_name,
                      address.receiver_phone,
                      address.email,
                      address.address,
                      address.province,
                      address.district,
                      address.ward,
                      address.id
                    );
                    handleClose();
                  }}
                  sx={{
                    padding: 1,
                    borderRadius: "4px",
                    cursor: !isSelected && "pointer",
                    "&:hover": {
                      bgcolor: !isSelected && "#eee",
                    },
                  }}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    flexWrap={"wrap"}
                  >
                    <Stack gap={"4px"} position={"relative"}>
                      <Typography fontWeight={500} fontSize={"14px"}>
                        {address.receiver_name}
                      </Typography>

                      {isSelected && (
                        <Stack
                          direction={"row"}
                          border={`1px solid ${colors.red}`}
                          alignItems={"center"}
                          justifyContent={"center"}
                          sx={{
                            width: "100px",
                            height: "32px",
                            borderRadius: "16px",
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
                        >
                          <Typography
                            sx={{ color: colors.red, fontSize: "12px" }}
                          >
                            Đang chọn
                          </Typography>
                        </Stack>
                      )}
                      <Typography sx={{ fontSize: "14px" }}>
                        {address.receiver_phone}
                      </Typography>
                      <Typography sx={{ fontSize: "14px", textWrap: "wrap" }}>
                        {fullAddress.filter((i) => i !== null).join(", ")}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddressSelector;
