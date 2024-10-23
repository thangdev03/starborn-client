import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { colors } from '../../services/const'

const AccountNavigation = () => {
  const navItems = [
    {
        id: "info",
        title: "Thông tin tài khoản",
        href: "/account/info"
    },
    {
        id: "address",
        title: "Sổ địa chỉ",
        href: "/account/address"
    },
    {
        id: "orders",
        title: "Lịch sử đơn hàng",
        href: "/account/orders"
    },
    {
        id: "orders-cancel",
        title: "Đơn hàng đã hủy",
        href: "/account/orders-cancel"
    },
    {
        id: 5,
        title: "Trả hàng/ Hoàn tiền",
        href: "#"
    },
    {
        id: 6,
        title: "Đánh giá & Phản hồi",
        href: "#"
    }
  ];

  const location = useLocation();
  const paths = (location.pathname.split('/').filter((x) => x));

  return (
    <Stack gap={"24px"}>
        {navItems.map(item => {
            const isCurrent = paths[1] === item.id;
            return (
                <Link 
                key={item.id} 
                to={item.href}
                style={{ textDecoration: "none" }}
                >
                    <Typography
                    sx={{
                        color: isCurrent ? colors.primaryColor : "rgba(27, 33, 65, 0.6)",
                        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            color: colors.primaryColor
                        }
                    }}
                    >
                        {item.title}
                    </Typography>
                </Link>
            )
        })}
    </Stack>
  )
}

export default AccountNavigation