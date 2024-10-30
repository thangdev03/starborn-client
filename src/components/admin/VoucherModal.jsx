import { Box, Button, FormControl, inputBaseClasses, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colors, serverUrl } from '../../services/const'
import Grid from '@mui/material/Grid'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import { toast } from 'react-toastify';

const VoucherModal = ({ action, coupon = {}, open = () => {}, handleClose = () => {}, reloadData = () => {} }) => {
    const style = {
        position: 'absolute',
        top: {
            xs: '2%',
            md: '10%'
        },
        left: '50%',
        transform: 'translateX(-50%)',
        width: {
            xs: '80%',
            md: '480px'
        },
        maxHeight: '80vh',
        overflowY: 'auto',
        bgcolor: 'white',
        borderRadius: '8px',
        boxShadow: 4,
        p: {
            xs: 2,
            md: 4
        },
    };
    const [isEnable, setIsEnable] = useState(1);
    const [isReusable, setIsReusable] = useState('');
    const [discountType, setDiscountType] = useState('%');
    const [activeDate, setActiveDate] = useState(new dayjs());
    const [expireDate, setExpireDate] = useState(new dayjs());
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [totalLimit, setTotalLimit] = useState(0);
    const [minOrder, setMinOrder] = useState(0);
    const [amount, setAmount] = useState(0);
    const [limitReuse, setLimitReuse] = useState(0);

    const handleCreateCoupon = () => {
        axios.post(serverUrl + 'coupons', {
           code: code, 
           description: description, 
           amount: amount, 
           type: discountType, 
           active_date: activeDate.format('YYYY-MM-DD HH:mm'), 
           expiration_date: expireDate.format('YYYY-MM-DD HH:mm'), 
           total_limit: totalLimit, 
           min_order_value: minOrder, 
           can_reuse: isReusable, 
           limit_reuse: limitReuse, 
           is_enabled: isEnable
        })
        .then((res) => {
            if (res.status === 201) {
                handleClose();
                toast.success('Tạo mã giảm giá thành công');
                reloadData();
            }
        })
        .catch((err) => console.log(err))
    };

    const handleUpdateCoupon = () => {
        axios.put(serverUrl + 'coupons/' + code, {
            description: description, 
            amount: amount, 
            type: discountType, 
            active_date: activeDate.format('YYYY-MM-DD HH-mm'), 
            expiration_date: expireDate.format('YYYY-MM-DD HH-mm'), 
            total_limit: totalLimit, 
            min_order_value: minOrder, 
            can_reuse: isReusable, 
            limit_reuse: limitReuse, 
            is_enabled: isEnable
        })
        .then((res) => {
            if (res.status === 200) {
                handleClose();
                alert('Cập nhật thành công');
                reloadData();
            }
        })
        .catch((err) => console.log(err))
    }
 
    useEffect(() => {
        if (action === 'detail') {
            setCode(coupon.code);
            setIsEnable(coupon.is_enabled);
            console.log(coupon.is_enabled)
            setDescription(coupon.description);
            setActiveDate(dayjs(coupon.active_date));
            setExpireDate(dayjs(coupon.expiration_date));
            setTotalLimit(coupon.total_limit);
            setMinOrder(coupon.min_order_value);
            setAmount(coupon.amount);
            setDiscountType(coupon.type);
            setIsReusable(coupon.can_reuse);
            setLimitReuse(coupon.limit_reuse);
        }
    },[action])

    useEffect(() => {
        if (!open) {
            setCode('');
            setIsEnable(1);
            setDescription('');
            setActiveDate(new dayjs());
            setExpireDate(new dayjs());
            setTotalLimit(0);
            setMinOrder(0);
            setAmount(0);
            setDiscountType('%');
            setIsReusable(0);
            setLimitReuse(0);
        }
    },[open])

    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-voucher" sx={{ mb: '20px', textTransform: 'uppercase', fontSize: '20px', fontWeight: 600 }}>
                {action === 'create' ? 'Tạo mã giảm giá' : (action === 'detail' && 'Chi tiết mã giảm giá')}
                </Typography>

                <Box sx={{ width: '100%' }}>
                    <Grid width={'100%'} container spacing={{ md: 2 }} rowSpacing={{ xs: 2 }} margin={0} gridTemplateColumns={2} gridColumn={2}>
                        <Grid item xs={12} md={6}>
                            <TextField 
                            fullWidth
                            id="code" 
                            label="Mã áp dụng" 
                            variant="outlined"
                            size='small'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size='small'>
                                <InputLabel id="enable-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="enable-label"
                                    id="enable-select"
                                    value={isEnable}
                                    label="Trạng thái"
                                    onChange={(e) => setIsEnable(e.target.value)}
                                >
                                    <MenuItem value={1}>Kích hoạt</MenuItem>
                                    <MenuItem value={0}>Vô hiệu hóa</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                            fullWidth
                            multiline
                            maxRows={4}
                            id="description" 
                            label="Mô tả" 
                            variant="outlined"
                            size='small'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                label="Thời gian bắt đầu"
                                value={activeDate}
                                onChange={(newValue) => setActiveDate(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                label="Thời gian kết thúc"
                                value={expireDate}
                                onChange={(newValue) => setExpireDate(newValue)}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                            fullWidth
                            id="total-limit" 
                            label="Giới hạn lượt dùng" 
                            type='number'
                            variant="outlined"
                            size='small'
                            value={totalLimit}
                            onChange={(e) => setTotalLimit(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                            fullWidth
                            id="min-order-value" 
                            label="Giá trị đơn tối thiểu (VNĐ)"
                            type='number'
                            variant="outlined"
                            size='small'
                            value={minOrder}
                            onChange={(e) => setMinOrder(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                            fullWidth
                            id="amount" 
                            label="Lượng giảm"
                            type='number'
                            variant="outlined"
                            size='small'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size='small'>
                                <InputLabel id="type-label" >Loại giảm giá</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type-select"
                                    value={discountType}
                                    label="Trạng thái"
                                    onChange={(e) => setDiscountType(e.target.value)}
                                >
                                    <MenuItem value={'%'}>%</MenuItem>
                                    <MenuItem value={'VNĐ'}>VNĐ</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth size='small'>
                                <InputLabel id="reuse-label">Sử dụng lại</InputLabel>
                                <Select
                                    labelId="reuse-label"
                                    id="reuse-select"
                                    label="Trạng thái"
                                    value={isReusable}
                                    onChange={(e) => setIsReusable(e.target.value)}
                                >
                                    <MenuItem value={1}>Cho phép</MenuItem>
                                    <MenuItem value={0}>Không cho phép</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField 
                            fullWidth
                            id="limit-reuse" 
                            label="Giới hạn số lượt dùng lại"
                            type='number'
                            variant="outlined"
                            size='small'
                            value={limitReuse}
                            onChange={(e) => setLimitReuse(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Stack direction={'row'} justifyContent={'center'} gap={'20px'} sx={{ mt: '40px' }}>
                    {action === 'create' ? (
                        <Button 
                        onClick={handleCreateCoupon}
                        variant='contained' 
                        sx={{ 
                            bgcolor: colors.red, 
                            width: '160px', 
                            '&:hover': {
                                bgcolor: '#c93c3c'
                            } 
                        }}>
                            Tạo
                        </Button>
                    ) : (action === 'detail' && (
                        <Button 
                        variant='contained' 
                        onClick={handleUpdateCoupon}
                        sx={{ 
                            bgcolor: colors.red, 
                            width: '160px', 
                            '&:hover': {
                                bgcolor: '#c93c3c'
                            } 
                        }}>
                            Cập nhật
                        </Button>
                    ))}
                    <Button variant='outlined' color='error' sx={{ width: '160px' }} onClick={handleClose}>
                        Hủy
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}

export default VoucherModal