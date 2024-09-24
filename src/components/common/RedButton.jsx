import { Button } from '@mui/material'
import React from 'react'
import { colors } from '../../services/const'

const RedButton = ({ 
    title, 
    href, 
    fontSize = '14px',
    disabled = false,
    customStyle,
    icon,
    onClick = () => {} 
}) => {
  return (
    <Button 
    href={href} 
    onClick={onClick}
    disabled={disabled}
    sx={{
        textWrap: 'nowrap',
        padding: '12px 40px',
        bgcolor: colors.red,
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center',
        '&:hover': {
            bgcolor: '#ed6161',
        },
        fontSize: fontSize,
        ...customStyle,
    }}
    >
      {icon}
      {title}
    </Button>
  )
}

export default RedButton