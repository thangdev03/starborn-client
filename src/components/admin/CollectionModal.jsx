import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { serverUrl } from "../../services/const";
import { toast } from "react-toastify";
  
  const CollectionModal = ({
    title,
    actionBtn,
    isOpen = false,
    isEdit = false,
    customStyle,
    oldName = "",
    handleClose = () => {},
    reloadData = () => {}
  }) => {
    const [newName, setNewName] = useState("");

    const handleCreate = () => {
      axios
        .post(serverUrl + "collection", {
          name: newName
        }, {
          withCredentials: true
        })
        .then((res) => {
          if (res.status === 201) {
            toast.success("Tạo bộ sưu tập mới thành công!");
            reloadData();
            handleClose();
          }
        })
        .catch((error) => console.log(error))
    };
  
    useEffect(() => {
      if (isEdit) {
        setNewName(oldName);
      } else {
        setNewName("");
      }
    }, [isEdit, oldName]);
  
    return (
      <Modal
        open={isOpen}
        onClose={(e) => handleClose(e)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ customStyle }}
      >
        <Box sx={styleModal} onClick={(e) => e.stopPropagation()}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontSize: { xs: "18px", md: "20px" } }}
          >
            {title}
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ mt: "16px" }}
            gap={"8px"}
          >
            <TextField
              id="new-name"
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ flexGrow: 1 }}
              onClick={handleCreate}
            >
              {actionBtn}
            </Button>
          </Stack>
        </Box>
      </Modal>
    );
  };
  
  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: 200,
      md: 400,
    },
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };
  
  export default CollectionModal;
  