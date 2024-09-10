import { Accordion, AccordionDetails, AccordionSummary, Box, Checkbox, Divider, FormGroup, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../../services/const';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddVariantForm = () => {
  const [checked, setChecked] = React.useState([0]);

  return (
    <Box sx={{ marginTop: '16px', paddingY: '16px' }}>
        <Stack direction={'row'} gap={'20px'} width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
            <TextField 
            id="variant-color" 
            label="Màu sắc" 
            variant="outlined" 
            aria-required 
            size='small'
            />
            <TextField 
            id="variant-hex" 
            label="Mã màu (hex)" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='color' 
            sx={{ width: '120px' }}
            />
            <TextField 
            id="variant-price" 
            label="Giá (VNĐ)" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='number' 
            sx={{ flexGrow: 1 }}
            />
            <TextField 
            id="variant-discount" 
            label="Giảm giá (%)" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='number' 
            sx={{ flexGrow: 1 }}
            />
            <TextField 
            id="variant-quantity" 
            label="Số lượng tồn kho" 
            variant="outlined" 
            aria-required 
            size='small' 
            type='number' 
            sx={{ flexGrow: 1 }}
            />
            <IconButton>
                <DeleteIcon sx={{ color: colors.red, fontSize: '24px' }}/>
            </IconButton>
        </Stack>
        <Accordion sx={{ mt: '16px' }}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            >
                <Typography>Chọn size</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormGroup>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {[0, 1, 2, 3].map((value) => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                            <ListItem
                                key={value}
                                // secondaryAction={
                                // <IconButton edge="end" aria-label="comments">
                                //     <CommentIcon />
                                // </IconButton>
                                // }
                                disablePadding
                            >
                                <ListItemButton 
                                role={undefined} 
                                // onClick={handleToggle(value)} 
                                dense>
                                <ListItemIcon>
                                    <Checkbox
                                    edge="start"
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                                </ListItemButton>
                            </ListItem>
                            );
                        })}
                    </List>
                </FormGroup>
            </AccordionDetails>
        </Accordion>
        {/* <Stack direction={'column'} marginTop={'16px'}>
            <input type="file" style={{ padding: '8px', border: '1px dashed', borderColor: colors.primaryColor, width: '280px', borderRadius: '8px' }}/>

        </Stack> */}
        <Divider sx={{ marginTop: '16px' }}/>
    </Box>
  )
}

export default AddVariantForm