import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import RedButton from '../common/RedButton'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { serverUrl } from '../../services/const'
import AddressModal from './AddressModal'
import AddressItem from './AddressItem'
import { toast } from 'react-toastify'

const AddressBook = () => {
  const { currentUser } = useAuth();
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedAddress, setSelectedAddress] = useState(null);

  const getData = async () => {
    axios.get(serverUrl + `addresses/${currentUser.id}`)
    .then((res) => setAddressList(res.data))
    .catch((error) => console.log(error))
  }

  const notifyUpdateSuccess = () => toast.success("Cập nhật địa chỉ thành công!")
  const notifyError = () => toast.error("Có lỗi xảy ra!")

  const handleSetDefault = async (address) => {
    axios.put(serverUrl + `addresses/${address.id}/setDefault`, {
      customer_id: address.customer_id
    }, {
      withCredentials: true
    })
    .then((res) => {
      if (res.status === 200) {
        getData();
        notifyUpdateSuccess();
      }
    })
    .catch((error) => {
      console.log(error);
      notifyError();
    })
  };

  const handleDelete = async (addressId) => {
    axios.delete(serverUrl + `addresses/${addressId}`, {
      withCredentials: true
    })
    .then((res) => {
      if (res.status === 200) {
        getData();
        toast.success("Đã xóa địa chỉ này!");
      }
    })
    .catch((error) => {
      console.log(error);
      notifyError();
    })
  }

  useEffect(() => {
    getData();
  }, [currentUser])

  return (
    <Paper
      elevation={6}
      sx={{
        flexGrow: 1,
        padding: "40px",
      }}
    >
        <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontSize={"28px"} fontWeight={500}>
              Địa chỉ của tôi
            </Typography>
            <RedButton 
              title={"Thêm địa chỉ mới"}
              onClick={() => {
                setOpenModal(true);
                setModalType("create");
                setSelectedAddress(null);
              }}
            />
        </Stack>

        <Divider sx={{ marginTop: "24px" }}/>

        <Typography marginY={"20px"} fontSize={"20px"} fontWeight={500}>
          Sổ địa chỉ
        </Typography>

        <Stack gap={"24px"}>
          {addressList
          .sort((a, b) => b.is_default - a.is_default)
          .map((item) => (
            <AddressItem 
              key={item.id}
              address={item}
              onClickUpdate={() => {
                setOpenModal(true)
                setModalType("update")
                setSelectedAddress(item)
              }}
              onClickDelete={() => handleDelete(item.id)}
              handleSetDefault={() => handleSetDefault(item)}
            />
          ))}
        </Stack>

        {
          openModal && (
            <AddressModal 
              open={openModal}
              handleClose={() => setOpenModal(false)}
              getAddress={() => getData()}
              type={modalType}
              address={selectedAddress}
            />
          )
        }
    </Paper>
  )
}

export default AddressBook