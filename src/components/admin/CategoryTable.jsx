import React, { useEffect, useState } from 'react'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  InputBase,
  Stack,
  Box,
  TableContainer,
  ButtonGroup,
  Link,
  IconButton,
  List,
  ListItem,
  ListItemButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import FilterListIcon from '@mui/icons-material/FilterList'
import { colors } from '../../services/const';
import { useLocation, useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import { useRef } from 'react';

const CategoryTable = ({ 
  containerMargin = '24px 0 0', 
  showObject = false, 
  showCategory = false, 
  data = [], 
  onClickCreateBtn = () => {},
  onClickDeleteBtn = () => {},
  onPage = 'object' || 'category' || 'subcategory',
  handleUpdate = () => {},
  filterOptions = [],
  onSelectFilter = (value) => {}
}) => {
  const [searchText, setSearchText] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const filterRef = useRef(null);

  const handleRowClick = (id) => {
    if (pathname.startsWith('/admin/objects')) {
      navigate(`/admin/categories?object_id=${id}`);
    } else if (pathname.startsWith('/admin/categories')) {
      navigate(`/admin/subcategories?category_id=${id}`);
    }
  }

  const toggleFilter = () => {
    setOpenFilter((prev) => !prev);
  }

  return (
    <Box sx={{ bgcolor: '#fff', paddingY: '24px', borderRadius: '16px', paddingX: '16px', margin: containerMargin }}>
      <Stack direction={'row'} justifyContent={'space-between'} gap={'8px'} marginBottom={'4px'}>
        <Stack direction={'row'} gap={'8px'}>
          <Box flexGrow={1} maxWidth={'400px'} height={'36px'} position={'relative'} border={'1px solid rgba(102,102,102,0.5)'} borderRadius={'8px'}>
            <InputBase 
              sx={{ width: '100%', height: '100%', paddingRight: '24px', fontSize: '14px', paddingLeft: '8px' }} placeholder='Tìm kiếm'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <SearchIcon sx={{ position: 'absolute', top: '50%', right: '4px', transform: 'translateY(-50%)', color: '#1B2141', opacity: 0.7 }} />
          </Box>
          {onPage !== 'object' && (
            <Box sx={{ position: 'relative' }}>
              <IconButton onClick={toggleFilter}>
                <FilterListIcon />
              </IconButton>
              <List
                ref={filterRef}
                sx={{
                  position: 'absolute',
                  top: 44,
                  left: -20,
                  bgcolor: 'white',
                  width: {
                    xs: 100,
                    md: 200
                  },
                  maxHeight: 260,
                  overflowY: 'auto',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  zIndex: 20,
                  color: colors.primaryColor,
                  display: openFilter? 'block' : 'none'
                }}
              >
                {filterOptions.map(option => (
                  <ListItem
                    key={option.id}
                    onClick={() => {
                      onSelectFilter(option.id);
                      setOpenFilter(false);
                    }}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#f3f3f3'
                      } 
                    }}
                  >
                    {option.name} 
                    {option.object_name && (
                      <span>- {option.object_name}</span>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>
        <Button
          onClick={onClickCreateBtn}
          sx={{ 
            textTransform: 'none', 
            color: 'white', 
            bgcolor: colors.red, 
            borderRadius: '8px' ,
            width: '100px',
            fontSize: '14px',
            transitionProperty: 'all',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms',
            '&:hover': {
              bgcolor: colors.red,
              opacity: 0.8
            }
          }}
        >
          <AddCircleOutlineRoundedIcon sx={{ width: '18px', marginRight: '4px' }}/>
          Thêm
        </Button>
      </Stack>
      <TableContainer>
        <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '44px', textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>
                  STT
                </TableCell>
                <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>
                  Tên
                </TableCell>
                {showObject && (
                  <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>
                    Đối tượng
                  </TableCell>
                )}
                {showCategory && (
                  <TableCell sx={{ textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>
                    Danh mục
                  </TableCell>
                )}
                <TableCell sx={{ width: '90px', textAlign: 'center', paddingX: 0, paddingY: '12px', color: '#1B2141', opacity: '0.6', fontSize: '16px', fontWeight: '600' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data !== null ? data.map((item, index) => 
              String(item.name).toLowerCase().includes(String(searchText).toLowerCase()) &&
              (
                <TableRow 
                  sx={{ 
                    color: colors.primaryColor,
                  }}
                  hover={true}
                  key={item.id}
                >
                  <TableCell sx={{ textAlign: 'center', fontSize: '16px', paddingY: '4px' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell 
                    sx={{ textAlign: 'center', fontSize: '16px', paddingY: '0px' }}
                  >
                    {!pathname.startsWith('/admin/subcategories') ? (
                      <Link 
                        sx={{ 
                          paddingX: '12px',
                          paddingY: '10px',
                          height: '100%',
                          cursor: 'pointer', 
                          textDecoration: 'none', 
                          color: colors.primaryColor,
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() => handleRowClick(item.id)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  {showObject && (
                    <TableCell sx={{ textAlign: 'center', fontSize: '16px', paddingY: '4px' }}>
                      {item.object_name}
                    </TableCell>
                  )}
                  {showCategory && (
                    <TableCell sx={{ textAlign: 'center', fontSize: '16px', paddingY: '4px' }}>
                      {item.category_name}
                    </TableCell>
                  )}
                  <TableCell sx={{ textAlign: 'center', fontSize: '16px', paddingY: '4px' }}>
                    <ButtonGroup variant='text'>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenEdit(true);
                          setSelectedItem(item);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button 
                        sx={{ color: colors.red }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClickDeleteBtn(item);
                        }}
                      >
                        Xóa
                      </Button>
                    </ButtonGroup>
                    <CategoryModal 
                      type={onPage}
                      title={'Cập nhật thông tin'}
                      inputLabel={'Tên'}
                      actionBtn={'Cập nhật'}
                      isOpen={openEdit}
                      setOpenToFalse={() => setOpenEdit(false)}
                      handleClickBtn={(newName) => handleUpdate(selectedItem, newName)}
                      isEdit={true}
                      oldName={selectedItem?.name}
                      fixedObject={selectedItem?.object_name || null}
                      fixedCategory={selectedItem?.category_name || null}
                    />
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={'100%'} align='center' sx={{ color: colors.primaryColor, fontSize: '16px' }}>
                    Không có dữ liệu nào!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CategoryTable