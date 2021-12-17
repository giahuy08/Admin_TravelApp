import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import callApi from 'src/api/apiService';
import Message from '../components/Message';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import DiscountMenu from '../components/_dashboard/user/DiscountMenu.js';
//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'nameTour', label: 'Name Tour', alignRight: false },
  { id: 'code', label: 'Code', alignRight: false },
  { id: 'discount', label: 'Discount', alignRight: false },
  { id: 'startDiscount', label: 'Start Discount', alignRight: false },
  { id: 'endDiscount', label: 'End Discount', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

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


function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.nameTour.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function Discount() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  //
  const [openAddDiscount, setOpenAddDiscount] = useState(false);
  const handleOpenAddDiscount = () => setOpenAddDiscount(true);
  const handleCloseAddDiscount = () => setOpenAddDiscount(false);
  
  //cách biến thêm discount
  const [discount, setDiscount] = useState('');
  const [code, setCode] = useState('');
  const [idTour, setIDTour] = useState('');
  const [startDiscount, setStartDiscount] = useState('');
  const [endDiscount, setEndDiscount] = useState('');
  //add discount
  const clickAddDiscount = async () =>{
    console.log({
        idTour,
        code,
        discount,
        startDiscount,
        endDiscount
    })
  
    let link = 'https://app-travelbe.herokuapp.com/discount/createDiscount'
    
    const response = await fetch(link, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("accessToken")},
        body : JSON.stringify({
            idTour,
            code,
            discount,
            startDiscount,
            endDiscount
        })
    });
    const content = await response.json();
    console.log(content.data)
    if(content.data){
      setNotify({ isOpen: true, message: "Thêm thành công", type: "success" });
      window.location.reload()
    }else {
      window.alert('Thất bại !')
    }
  }

  //lấy danh sách user
  const [allDiscount, setAllDiscount] = useState([]);
  
  useEffect(() => {
    callApi(
      `discount/getAllDiscount`,
      "GET"
    ).then((res) => {
      console.log(res.data.data)
      setAllDiscount(res.data.data);
    });
  }, []);
  //lấy danh sách tour
  const [tours, setTours] = useState([]);
  
  useEffect(() => {
    callApi(
      `tour/getAllTour?search&skip&limit`,
      "GET"
    ).then((res) => {
      console.log(res.data.data)
      setTours(res.data.data);
    });
  }, []);
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allDiscount.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allDiscount.length) : 0;

  const filteredDiscount = applySortFilter(allDiscount, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredDiscount.length === 0;


  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Discount (Số lượng {allDiscount.length})
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpenAddDiscount}
          >
            Thêm Discount 
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allDiscount.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredDiscount
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, nameTour, status, startDiscount, endDiscount, idTour, code, discount, imageTour } = row;
                      const isItemSelected = selected.indexOf(_id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, _id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none" sx={{ maxWidth: 350 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={_id} src={imageTour} />                            
                              <Typography variant="subtitle2" noWrap>
                                {nameTour}                              
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" >{code}</TableCell>
                          <TableCell align="left">{discount} %</TableCell>                      
                          <TableCell align="left" >{new Date(startDiscount).toISOString('vi-VN').slice(0, 10)}</TableCell>
                          <TableCell align="left">{new Date(endDiscount).toISOString('vi-VN').slice(0, 10)}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status == 0 && 'success') ||  'error'}
                            >
                              {(status == 0 && 'Còn') || 'Đã Hủy'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <DiscountMenu id={_id} status={status} discount={discount} code={code} idTour={idTour}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allDiscount.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>   
      <Message notify={notify} setNotify={setNotify} />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddDiscount}
        onClose={handleCloseAddDiscount}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        
        <Fade in={openAddDiscount}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Sửa discount
            </Typography>

            <Autocomplete
              style={{marginTop: '10px'}}
              id="free-solo-demo"
              disableClearable             
              options={tours.map((t) => t.name)}
              renderInput={(params) => <TextField {...params} label="Tour" />}
              onChange={(event, newValue) => {
                tours.map((t) => {if(newValue == t.name) setIDTour(t._id) 
                })
                console.log(idTour)
              }}
            />

          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" label="Code" variant="outlined" value={code} onChange={(event)=>setCode(event.target.value)}/>               
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Discount" variant="outlined" value={discount} onChange={(event)=>setDiscount(event.target.value)}/>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
          Start Discount:
            </Typography>     
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="date"  variant="outlined" value={startDiscount} onChange={(event)=>setStartDiscount(event.target.value)}/>
          <Typography id="transition-modal-description" sx={{ mt: 2 }}>
          End Discount:
            </Typography> 
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="date"  variant="outlined" value={endDiscount} onChange={(event)=>setEndDiscount(event.target.value)}/>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Kiểm tra trước khi nhấn save!
            </Typography>


            <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={clickAddDiscount}
          >
            Add
          </Button>

          </Box>
        </Fade>
      </Modal>


    </Page> 
  );
}
