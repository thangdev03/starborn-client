import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { colors } from '../../services/const';

const ActionBtn = ({ type, title, customStyle, handleClick = () => {}, disabled = false }) => {
  const [bgColor, setBgColor] = useState('inherit');
  useEffect(() => {
    let color;
    switch (type) {
      case 'cancel':
          color = 'inherit';
          break;
      case 'delete':
      case 'save':
          color = 'error';
          break;
      case 'update':
          color = 'primary';
          break;
    }
    setBgColor(color);
  },[type])

  return (
    <Button 
    disabled={disabled}
    style={customStyle}
    onClick={handleClick}
    color={bgColor}
    variant={type === 'cancel' ? 'outlined' : 'contained'}
    sx={{
        fontWeight: 600,
        fontSize: '16px',
        paddingX: '16px',
        paddingY: '8px',
        borderRadius: '8px',
        minWidth: '148px'
    }}
    >
        {title}
    </Button>
  )
}

export default ActionBtn