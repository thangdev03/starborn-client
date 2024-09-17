import { Box, Stack } from '@mui/material'
import React from 'react'

const AddImagesModal = () => {
  return (
    <Stack 
        sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            zIndex: 40,
            bgcolor: 'rgba(0,0,0,0.5)'
        }}
        alignItems={'center'}
    >
        <Box 
            sx={{
                marginTop: '10vh',
                height: '200px',
                width: '200px',
                bgcolor: 'white'
            }}
        >

        </Box>
    </Stack>
  )
}

export default AddImagesModal