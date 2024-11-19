import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../../services/const";

const CategoryModal = ({
  customStyle,
  type = "object" || "category" || "subcategory",
  title,
  inputLabel,
  actionBtn,
  handleClickBtn = (data) => {},
  isOpen = false,
  setOpenToFalse = () => {},
  isEdit = false,
  oldName = "",
  fixedObject = "",
  fixedCategory = "",
}) => {
  const [newName, setNewName] = useState(oldName);
  const [objectsList, setObjectsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [disableBtn, setDisableBtn] = useState(true);

  const handleClose = (event) => {
    event.stopPropagation();
    setOpenToFalse();
    setNewName(oldName);
    setSelectedObject(null);
    setSelectedCategory(null);
  };

  useEffect(() => {
    if (type !== "object" && type !== "category" && type !== "subcategory") {
      return console.error(
        "Type of this CategoryModal must be in object, category or subcategory"
      );
    }
  }, [type]);

  useEffect(() => {
    if (isEdit) {
      setNewName(oldName);
    } else {
      setNewName("");
    }
  }, [isEdit, oldName]);

  useEffect(() => {
    if (type === "category" || type === "subcategory") {
      axios
        .get(serverUrl + "categories/object")
        .then((res) => setObjectsList(res.data))
        .catch((err) => console.log(err));
    }
  }, [type]);

  useEffect(() => {
    if (type === "subcategory" && selectedObject) {
      console.log("THIS CALLED");
      axios
        .get(serverUrl + "categories?object_id=" + selectedObject.id)
        .then((res) => setCategoriesList(res.data))
        .catch((err) => console.log(err));
    }
  }, [selectedObject, type]);

  useEffect(() => {
    if (type === "category" && selectedObject === null && !isEdit) {
      return setDisableBtn(true);
    }
    if (type === "subcategory" && selectedCategory === null && !isEdit) {
      return setDisableBtn(true);
    }
    if (oldName !== "" && oldName === newName) {
      return setDisableBtn(true);
    }

    return newName !== "" ? setDisableBtn(false) : setDisableBtn(true);
  }, [type, selectedCategory, selectedObject, newName, oldName, isEdit]);

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
        {isEdit &&
          (type === "category" ? (
            <TextField
              label="Đối tượng"
              value={fixedObject}
              variant="outlined"
              fullWidth
              sx={{ mt: "8px" }}
              disabled
            />
          ) : (
            type === "subcategory" && (
              <>
                <TextField
                  label="Đối tượng sử dụng"
                  value={fixedObject}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: "8px" }}
                  disabled
                />
                <TextField
                  label="Danh mục sản phẩm"
                  value={fixedCategory}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: "8px" }}
                  disabled
                />
              </>
            )
          ))}
        {!isEdit && type === "category" && (
          <Selector
            label={"Đối tượng sử dụng"}
            setSelectedValue={(value) => setSelectedObject(value)}
            options={objectsList}
          />
        )}
        {!isEdit && type === "subcategory" && (
          <>
            <Selector
              label={"Đối tượng sử dụng"}
              setSelectedValue={(value) => setSelectedObject(value)}
              options={objectsList}
              disabled={isEdit}
            />
            <Selector
              label={"Danh mục sản phẩm"}
              setSelectedValue={(value) => setSelectedCategory(value)}
              options={categoriesList}
              disabled={selectedObject === null || isEdit}
            />
          </>
        )}
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ mt: "16px" }}
          gap={"8px"}
        >
          <TextField
            id="new-name"
            label={inputLabel}
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ flexGrow: 1 }}
            disabled={disableBtn}
            onClick={() => {
              if (isEdit) {
                return handleClickBtn(newName);
              } else {
                switch (type) {
                  case "object":
                    handleClickBtn(newName);
                    break;
                  case "category":
                    handleClickBtn({
                      objectId: selectedObject?.id,
                      name: newName,
                    });
                    break;
                  case "subcategory":
                    handleClickBtn({
                      categoryId: selectedCategory?.id,
                      name: newName,
                    });
                    break;
                  default:
                    handleClickBtn(newName);
                }
              }
            }}
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

const Selector = ({
  disabled,
  label,
  setSelectedValue = (value) => {},
  options = [],
}) => {
  const [selectedDisplay, setSelectedDisplay] = useState("");
  const handleChange = (e) => {
    const selectedOption = options.find(
      (option) => option.name === e.target.value
    );
    setSelectedValue(selectedOption);
    setSelectedDisplay(e.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: "8px" }}>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        disabled={disabled}
        fullWidth={true}
        labelId={label}
        label={label}
        value={selectedDisplay}
        onChange={(e) => handleChange(e)}
      >
        {options?.map((option) => (
          <MenuItem key={option.id} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategoryModal;
