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
  reloadData = () => {},
}) => {
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setNewImage(imageFile);
    const newURL = URL.createObjectURL(imageFile);
    setPreviewImage(newURL);
  };

  const uploadImages = async () => {
    try {
      const image = new FormData();
      image.append("file", newImage);
      image.append("cloud_name", "ddgwckqgy");
      image.append("upload_preset", "starborn-storage");
      image.append("folder", "starborn_product_photos/collections");

      const removeAuthInterceptor = axios.interceptors.request.use(
        (config) => {
          // Loại bỏ Authorization header nếu có
          delete config.headers["Authorization"];
          return config;
        }
      );

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/ddgwckqgy/image/upload",
        image
      );

      axios.interceptors.request.eject(removeAuthInterceptor);
      setPreviewImage("");
      return res.data.url.toString();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return null;
    }
  };

  const handleCreate = async () => {
    if (!newName || !newImage || !newSlug) {
      return toast.warn("Vui lòng nhập đẩy đủ thông tin BST!");
    }
    const uploadedImage = await uploadImages();
    if (!uploadedImage) {
      return toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }

    setIsLoading(true)
    axios
      .post(
        serverUrl + "collection",
        {
          name: newName,
          slug: newSlug,
          imageUrl: uploadedImage,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 201) {
          toast.success("Tạo bộ sưu tập mới thành công!");
          reloadData();
          handleClose();
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false))
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
      onClose={(e) => {
        handleClose(e);
        setNewImage("");
        setPreviewImage("");
        setNewName("");
      }}
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
        <Stack sx={{ mt: "16px" }} gap={"8px"}>
          <TextField
            id="new-name"
            label="Tên BST"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            id="new-slug"
            label="Slug (không dấu)"
            variant="outlined"
            value={newSlug}
            onChange={(e) => {
              const newValue = e.target.value;
              setNewSlug(newValue.trim());
            }}
          />
          <input
            type="file"
            accept="image/*"
            style={{
              padding: "8px",
              border: "1px solid #bbb",
              borderRadius: "4px",
            }}
            name="image"
            onChange={handleImageChange}
          />
          <img
            src={previewImage}
            alt={previewImage?.name}
            loading="lazy"
            style={{
              objectFit: "contain",
            }}
            width={"100%"}
          />
          <Button
            disabled={isLoading}
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
