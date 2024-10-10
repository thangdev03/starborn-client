import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { colors, serverUrl } from "../../services/const";
import RedButton from "../common/RedButton";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const AddressModal = ({
  open = false,
  handleClose,
  type,
  address,
  getAddress = () => {},
}) => {
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [isDefault, setIsDefault] = useState(
    address?.is_default === 1 ? address.is_default : false
  );
  const [name, setName] = useState(address ? address.receiver_name : "");
  const [phone, setPhone] = useState(address ? address.receiver_phone : "");
  const [exactAddress, setExactAddress] = useState(
    address ? address.address : ""
  );
  const { currentUser } = useAuth();
  const [requesting, setRequesting] = useState(false);

  const getProvinces = () => {
    axios
      .get("https://vapi.vnappmob.com/api/province/", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setProvinceList(res.data.results))
      .catch((error) => console.log(error));
  };

  const getDistricts = () => {
    axios
      .get(
        "https://vapi.vnappmob.com/api/province/district/" +
          selectedProvince.province_id,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => setDistrictList(res.data.results))
      .catch((error) => console.log(error));
  };

  const getWards = () => {
    axios
      .get(
        "https://vapi.vnappmob.com/api/province/ward/" +
          selectedDistrict.district_id,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => setWardList(res.data.results))
      .catch((error) => console.log(error));
  };

  const handleSelect = (e, field) => {
    if (field === "province") {
      setSelectedProvince(e.target.value);
      setSelectedDistrict("");
      setSelectedWard("");
    } else if (field === "district") {
      setSelectedDistrict(e.target.value);
      setSelectedWard("");
    } else if (field === "ward") {
      setSelectedWard(e.target.value);
    }
  };

  const resetSelection = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setIsDefault(false);
    setExactAddress("");
    setPhone("");
    setName("");
  };

  const handleCreate = async () => {
    if (!name) {
      return alert("Điền tên người nhận!");
    }
    if (!phone) {
      return alert("Điền số điện thoại người nhận!");
    }
    if (!exactAddress || !selectedProvince || !selectedDistrict) {
      return alert(
        "Điền đầy đủ địa chỉ nhà, tỉnh/thành và quận/huyện của bạn!"
      );
    }

    setRequesting(true);
    axios
      .post(
        serverUrl + `addresses/${currentUser.id}`,
        {
          is_default: isDefault,
          address: exactAddress,
          ward: selectedWard.ward_name,
          district: selectedDistrict.district_name,
          province: selectedProvince.province_name,
          receiver_name: name,
          receiver_phone: phone,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          resetSelection();
          handleClose();
          toast.success("Thêm địa chỉ thành công");
          getAddress();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Có lỗi xảy ra!");
      })
      .finally(() => setRequesting(false));
  };

  const handleUpdate = async () => {
    axios
      .put(
        serverUrl + `addresses/${address.id}`,
        {
          // is_default: isDefault,
          address: exactAddress,
          ward: selectedWard.ward_name,
          district: selectedDistrict.district_name,
          province: selectedProvince.province_name,
          receiver_name: name,
          receiver_phone: phone,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          resetSelection();
          handleClose();
          toast.success(res.data.message);
          getAddress();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Có lỗi xảy ra!");
      })
      .finally(() => setRequesting(false));
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      getWards();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (address && provinceList.length !== 0) {
      setSelectedProvince(
        provinceList.find((i) => i.province_name === address.province)
      );
    }
  }, [provinceList]);

  useEffect(() => {
    if (address && districtList.length !== 0) {
      setSelectedDistrict(
        districtList.find((i) => i.district_name === address.district)
      );
    }
  }, [districtList]);

  useEffect(() => {
    if (address?.ward && wardList.length !== 0) {
      setSelectedWard(wardList.find((i) => i.ward_name === address.ward));
    }
  }, [wardList]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          borderRadius: "8px",
          bgcolor: "white",
          padding: 3,
          width: "50%",
        }}
      >
        <Grid container spacing={"16px"}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              label="Tên người nhận"
              required
              fullWidth
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              label="Số điện thoại"
              required
              fullWidth
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              label="Địa chỉ"
              required
              fullWidth
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
              value={exactAddress}
              onChange={(e) => setExactAddress(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="select-province-label">
                Chọn Tỉnh/Thành
              </InputLabel>
              <Select
                name="select-province"
                labelId="select-province-label"
                label="Chọn Tỉnh/Thành"
                variant="outlined"
                fullWidth
                value={selectedProvince}
                onChange={(e) => handleSelect(e, "province")}
              >
                {provinceList.map((province) => (
                  <MenuItem key={province.province_id} value={province}>
                    {province.province_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="select-district-label">
                Chọn Quận/Huyện
              </InputLabel>
              <Select
                name="select-district"
                labelId="select-district-label"
                label="Chọn Quận/Huyện"
                variant="outlined"
                fullWidth
                disabled={selectedProvince === "" ? true : false}
                value={selectedDistrict}
                onChange={(e) => handleSelect(e, "district")}
              >
                {districtList.map((district) => (
                  <MenuItem key={district.district_id} value={district}>
                    {district.district_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="select-ward-label">Chọn Phường/Xã</InputLabel>
              <Select
                name="select-ward"
                labelId="select-ward-label"
                label="Chọn Phường/Xã"
                variant="outlined"
                fullWidth
                disabled={selectedDistrict === "" ? true : false}
                value={selectedWard}
                onChange={(e) => handleSelect(e, "ward")}
              >
                {wardList.map((ward) => (
                  <MenuItem key={ward.ward_id} value={ward}>
                    {ward.ward_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {!address && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isDefault}
                onClick={() => setIsDefault(!isDefault)}
              />
            }
            label="Đặt làm mặc định"
            sx={{
              marginTop: "4px",
            }}
          />
        )}

        <Stack
          direction={"row"}
          justifyContent={"end"}
          gap={"8px"}
          marginTop={address && 3}
        >
          <Button
            variant="outlined"
            sx={{
              borderRadius: "8px",
              paddingX: "28px",
            }}
            onClick={() => {
              handleClose();
              resetSelection();
            }}
          >
            Hủy
          </Button>
          {type === "create" && (
            <RedButton
              title={"Thêm"}
              customStyle={{
                paddingX: "28px",
              }}
              onClick={() => handleCreate()}
            />
          )}

          {type === "update" && (
            <RedButton
              title={"Lưu"}
              customStyle={{
                paddingX: "28px",
              }}
              onClick={() => handleUpdate()}
            />
          )}
        </Stack>
        {requesting && (
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              bgcolor: "rgba(0,0,0,0.15)",
            }}
          >
            <CircularProgress size={"28px"} />
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default AddressModal;
