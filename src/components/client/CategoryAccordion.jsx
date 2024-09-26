import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material'
import React from 'react'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { colors } from '../../services/const';

const CategoryAccordion = ({ category, handleChangeCategory = () => {} }) => {
  return (
    <Accordion sx={{ boxShadow: 'none' }}>
        <AccordionSummary
          expandIcon={<KeyboardArrowDownRoundedIcon />}
          sx={{ paddingX: 0 }}
        >
          <Typography 
          onClick={(e) => {
            e.stopPropagation();
            handleChangeCategory(category.slug);
          }} 
          fontSize={'18px'}
          sx={{
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          >
            {category?.name}
          </Typography>
        </AccordionSummary>
        {category?.subcategories?.map((item) => (
            <AccordionDetails key={item.sub_id} sx={{ paddingX: 0, paddingY: 0}}>
                <Button 
                onClick={() => handleChangeCategory(category.slug, item.sub_slug)}
                sx={{ paddingX: '20px', paddingY: '6px', width: '100%', justifyContent: 'start', color: colors.primaryColor }}
                >
                    {item.sub_name}
                </Button>
            </AccordionDetails>
        ))}
    </Accordion>
  )
}

export default CategoryAccordion