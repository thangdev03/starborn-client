import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Modal, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { colors, serverUrl } from "../../services/const";
import axios from "axios";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  pb: 3,
  borderRadius: "8px"
};

const ChooseCollectionModal = ({ open = true, productSelected = [], handleClose = () => {} }) => {
  const [collectionList, setCollectionList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const getCollectionList = () => {
        axios
          .get(serverUrl + "collection", {
            withCredentials: true
          })
          .then((res) => {
            setCollectionList(res.data);
          })
          .catch((err) => console.log(err))
    }

    getCollectionList();
  }, [])

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleCheck = (collectionId) => {
    const selectedIndex = selected.indexOf(collectionId);
    let newSelected = [];

    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, collectionId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangeSearch = (e) => {
    setSearchText(e.target.value);
  };

  const submitAdd = async () => {
    axios
      .post(serverUrl + "collection/add-batch", {
        collections: selected,
        products: productSelected
      }, {
        withCredentials: true
      })
      .then((res) => {
        toast.success("Thêm vào bộ sưu tập thành công!");
        handleClose();
      })
      .catch((error) => console.log(error))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...style, width: 500 }}>
        <Typography fontWeight={500} fontSize={"20px"} paddingX={4}>
          Thêm {productSelected.length} sản phẩm vào Bộ sưu tập
        </Typography>

        <Box
          sx={{
            borderWidth: "1px 0px",
            borderStyle: "solid",
            borderColor: "#ddd",
            my: 2,
            px: 4,
            py: 2,
          }}
        >
          <TextField size="small" placeholder="Tìm kiếm Bộ sưu tập" fullWidth onChange={handleChangeSearch}/>
          <FormGroup sx={{ marginTop: "8px" }}>
            {collectionList
            .map((collection) => {
              const isItemSelected = isSelected(collection.id);

              return (collection.name).toLowerCase().includes(searchText.toLowerCase()) && (
                <FormControlLabel
                  key={collection.id}
                  control={
                    <Checkbox
                      checked={isItemSelected}
                      onChange={() => handleCheck(collection.id)}
                      name={collection.name}
                    />
                  }
                  label={collection.name}
                />
              );
            })}
          </FormGroup>
        </Box>

        <Stack
          direction={"row"}
          justifyContent={"end"}
          gap={"8px"}
          paddingX={4}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              width: "80px",
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={submitAdd}
            variant="contained"
            sx={{
              width: "80px",
            }}
          >
            Lưu
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ChooseCollectionModal;
