import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { colors, serverUrl } from "../../services/const";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ActionBtn from "./ActionBtn";
import axios from "axios";

const AddImagesModal = ({ variantId, handleCloseModal, reloadVariantsData }) => {
  const [newVariantImages, setNewVariantImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    let results = [];

    for (let file of e.target.files) {
      const newUrl = URL.createObjectURL(file);

      results.push({
        file: file,
        previewUrl: newUrl,
      });
    }

    setNewVariantImages(results);
  };

  const handleRemove = (removeIndex) => {
    const newResult = newVariantImages.filter(
      (i, index) => index !== removeIndex
    );
    setNewVariantImages(newResult);

    const dataTransfer = new DataTransfer();

    newResult.forEach((image) => {
      dataTransfer.items.add(image.file);
    });

    fileInputRef.current.files = dataTransfer.files;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      let imageURLs = [];
      for (let variantImage of newVariantImages) {
        const image = new FormData();
        image.append("file", variantImage.file);
        image.append("cloud_name", "ddgwckqgy");
        image.append("upload_preset", "starborn-storage");
        image.append("folder", "starborn_product_photos");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/ddgwckqgy/image/upload",
          image
        );
        imageURLs.push(res.data.url.toString());
      }

      axios
        .post(serverUrl + 'productImages/' + variantId, {
          imageLinks: imageURLs
        })
        .then((res) => {
          if (res.status === 201) {
            setNewVariantImages([]);
            alert('Thêm ảnh thành công!');
            handleCloseModal();
            reloadVariantsData();
          }
          setIsLoading(false);
        })
        .catch((err) => {throw new Error})
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewVariantImages([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    handleCloseModal();
  };

  return (
    <Stack
      onClick={handleCloseModal}
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
        bgcolor: "rgba(0,0,0,0.5)",
      }}
      alignItems={"center"}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          marginTop: "10vh",
          bgcolor: "white",
          padding: "16px",
          width: {
            xs: "80%",
            sm: "40%",
          },
          borderRadius: "8px",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
          Tải lên hình ảnh sản phẩm
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={"16px"}
          marginTop={"8px"}
          flexWrap={"wrap"}
        >
          <input
            type="file"
            multiple
            ref={fileInputRef}
            accept="image/*"
            style={{
              padding: "8px 4px",
              border: "1px dashed",
              borderColor: colors.primaryColor,
              borderRadius: "8px",
              flex: 1,
              overflow: "hidden",
            }}
            name="image"
            onChange={(e) => handleImageChange(e)}
          />
          <Typography
            sx={{
              fontSize: "14px",
              fontStyle: "italic",
              flexShrink: 0,
              textWrap: 0,
            }}
          >
            (Nên sử dụng ảnh tỉ lệ <strong>9:11</strong>)
          </Typography>
        </Stack>

        <Stack
          sx={{
            width: "100%",
            marginTop: "16px",
            overflowX: "auto",
            paddingY: "8px",
          }}
          direction={"row"}
          gap={"12px"}
        >
          {newVariantImages.map((image, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0,
                height: "220px",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: colors.red,
                }}
                onClick={() => handleRemove(index)}
              >
                <CloseRoundedIcon />
              </IconButton>
              <img
                src={image.previewUrl}
                loading="lazy"
                style={{
                  objectFit: "cover",
                }}
                width={"180px"}
                height={"100%"}
              />
            </div>
          ))}
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          gap={"16px"}
          paddingTop={"16px"}
          sx={{ flexWrap: "wrap" }}
        >
          <ActionBtn
            type={"save"}
            title={!isLoading ? "Tải ảnh" : "Đang tải..."}
            disabled={newVariantImages.length === 0 || isLoading === true}
            handleClick={handleSubmit}
            customStyle={{
              flexGrow: 1,
            }}
          />
          <ActionBtn
            type={"cancel"}
            title={"Hủy"}
            handleClick={handleCancel}
            customStyle={{
              flexGrow: 1,
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default AddImagesModal;