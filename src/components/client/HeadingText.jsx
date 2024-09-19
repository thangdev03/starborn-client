import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { colors } from '../../services/const'

const HeadingText = ({ title, subtitle, titleColor = colors.red}) => {
  return (
    <Stack gap={'12px'}>
        <Stack direction={'row'} gap={'16px'} alignItems={'center'}>
            <Box sx={{ width: '20px', height: '40px', bgcolor: colors.red, borderRadius: '4px' }}></Box>
            <Typography
            sx={{
                color: titleColor,
                fontSize: '18px',
                fontWeight: 600
            }}
            >
                {title}
            </Typography>
        </Stack>
        <Typography
        sx={{
            fontSize: '36px',
            fontWeight: 600
        }}
        >
            {subtitle}
        </Typography>
    </Stack>
  )
}

export default HeadingText