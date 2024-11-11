import { Stack, Typography, InputBase, Switch, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import { colors, serverUrl } from '../../services/const';
import axios from 'axios'
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';

const headCells = [
  {
    id: 'number',
    numeric: true,
    disablePadding: true,
    label: 'ID',
    alignDirection: 'left',
    sortable: true
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Tên',
    alignDirection: 'left',
    sortable: true
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'Số lượng tồn kho',
    alignDirection: 'center',
    sortable: true
  },
  {
    id: 'rating',
    numeric: false,
    disablePadding: false,
    label: 'Đánh giá',
    alignDirection: 'center',
    sortable: true
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Phân loại',
    alignDirection: 'center',
    sortable: false
  },
  {
    id: 'isFeatured',
    numeric: false,
    disablePadding: false,
    label: 'Sản phẩm đặc trưng',
    alignDirection: 'center',
    sortable: false
  },
  {
    id: 'isActive',
    numeric: false,
    disablePadding: false,
    label: 'Kích hoạt',
    alignDirection: 'center',
    sortable: false
  },
  {
    id: 'detailView',
    numeric: false,
    disablePadding: false,
    label: 'Xem chi tiết',
    alignDirection: 'center',
    sortable: false
  }
];

const Products = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const getData = () => {
    axios.get(serverUrl + 'products')
    .then((res) => setData(res.data))
    .catch((err) => console.log(err))
  }

  useEffect(() => {
    getData();
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchRequest = () => {
    axios.get(serverUrl + 'products?keywords=' + searchText)
    .then((res) => {
      if (res.status === 404) {
        return setData([]);
      }  
      return setData(res.data)
    }
    )
    .catch((err) => {
      console.log(err);
      setData([]);
    })
  }

  const handleDeleteRequest = () => {
    if (window.confirm('Bạn có chắc muốn vô hiệu hóa các sản phẩm đã chọn không?')) {
      axios.put(serverUrl + 'products/disable', {
          productIds: selected
      })
      .then((res) => {
          if (res.status === 200) {
            getData();
          } else {
            alert(res.data?.message);
          }
      })
      .catch((err) => console.log(err))
    }
  }

  const handleToggleSwitch = (type, currentValue, product) => {
    axios.put(serverUrl + 'products/update/' + product.id, {
      name: product.name,
      detail: product.detail,
      subcategory_id: product.subcategory_id,
      is_featured: type === 'feature' ? !currentValue : product.is_featured,
      is_active: type === 'active' ? !currentValue : product.is_active,
      slug: product.slug
    })
    .then((res) => {
      if (res.status === 200) {
        getData();
      } else {
        alert(res.data?.message);
      }
    })
    .catch((err) => console.log(err))
  }

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data],
  );

  return (
    <Box sx={{ paddingX: {xs: '8px', md: '24px'}, margin: 0, paddingBottom: '160px' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'end' }} justifyContent={'space-between'} gap={{ xs: '12px', md: 'auto' }}>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '24px'
            }}
          >
            TẤT CẢ SẢN PHẨM
          </Typography>
          <AppBreadcrumbs />
        </Box>
        <Stack direction={'row'} gap={'8px'}>
          <Box flexGrow={1} maxWidth={'400px'} height={'36px'} position={'relative'} border={'1px solid rgba(102,102,102,0.5)'} borderRadius={'8px'}>
            <InputBase 
              sx={{ width: '100%', height: '100%', paddingRight: '24px', fontSize: '14px', paddingLeft: '8px' }} placeholder='Tìm kiếm'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchRequest()}
            />
            <IconButton 
              onClick={handleSearchRequest} 
              sx={{ position: 'absolute', top: '50%', right: '4px', transform: 'translateY(-50%)', color: '#1B2141', opacity: 0.7 }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          <Link
            href="/admin/products/create"
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textDecoration: 'none',
              textTransform: 'none', 
              color: 'white', 
              bgcolor: colors.red, 
              borderRadius: '8px' ,
              width: '100px',
              fontSize: '14px',
              fontWeight: 500,
              transitionProperty: 'all',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '150ms',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: colors.red,
                opacity: 0.8
              }
            }}
          >
            <AddCircleOutlineRoundedIcon sx={{ width: '18px', marginRight: '4px' }}/>
            Thêm
          </Link>
        </Stack>
      </Stack>

      <Box sx={{ marginTop: '24px', bgcolor: 'white', borderRadius: '16px', width: '100%', overflow: 'hidden' }}>
        <EnhancedTableToolbar numSelected={selected.length} onDeleteClick={handleDeleteRequest} />
        <TableContainer>
          <Table>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.length !== 0 ? visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell 
                      padding="checkbox" 
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                    >
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align='left'
                    >
                      {row.id}
                    </TableCell>
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='center' sx={{ paddingRight: '40px' }}>{row.total_stock}</TableCell>
                    <TableCell align='center' sx={{ paddingRight: '40px' }}>
                      {row.average_rating || 'Chưa có'}
                    </TableCell>
                    <TableCell align='center'>
                      {row.subcategory_id ? (
                        `${row.category}/${row.object}`
                        ) : (
                        'Chưa có'
                      )}
                    </TableCell>
                    <TableCell align='center'>
                      <Switch 
                        checked={row.is_featured === 1 ? true : false}
                        onClick={() => handleToggleSwitch('feature', row.is_featured, row)}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      <Switch 
                        checked={row.is_active === 1 ? true : false}
                        onClick={() => handleToggleSwitch('active', row.is_active, row)}
                      />
                    </TableCell>
                    <TableCell align="center">
                        <IconButton href={`/admin/products/${row.id}`}>
                          <VisibilityIcon sx={{ color: colors.primaryColor }}/>
                        </IconButton>
                      </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={'100%'} sx={{ fontSize: '16px', textAlign: 'center' }}>Không tìm thấy sản phẩm nào!</TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

    </Box>
  )
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableToolbar(props) {
  const { numSelected, onDeleteClick } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Đã chọn {numSelected}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Danh sách sản phẩm
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Vô hiệu hóa">
          <IconButton onClick={onDeleteClick}>
            <BlockIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all products',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignDirection}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                sx={{ color: colors.primaryColor, opacity: 1 }}
              >
                <span style={{ fontWeight: 600, fontSize: '16px' }}>
                  {headCell.label}
                </span>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Typography sx={{ fontWeight: 600 }}>
                {headCell.label}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default Products