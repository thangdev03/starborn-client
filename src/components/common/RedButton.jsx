import { Button } from '@mui/material'
import React from 'react'
import { colors } from '../../services/const'

const RedButton = ({ 
    title, 
    href, 
    width,
    onClick = () => {} 
}) => {
  return (
    <Button 
    href={href} 
    onClick={onClick}
    sx={{
        padding: '12px 40px',
        bgcolor: colors.red,
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        '&:hover': {
            bgcolor: '#ed6161',
        }
    }}
    >
        {title}
    </Button>
  )
}

export default RedButton