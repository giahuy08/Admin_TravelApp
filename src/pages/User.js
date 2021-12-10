import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import callApi from 'src/api/apiService';
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
import UserMenu from '../components/_dashboard/user/UserMenu.js';
import Message from '../components/Message';

//
import USERLIST from '../_mocks_/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'deleted', label: 'Deleted', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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

export default function User() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //lấy danh sách user
  const [allUser, setAllUser] = useState([]);
  
  useEffect(() => {
    callApi(
      `admin/getAllUserWithDeleted`,
      "GET"
    ).then((res) => {
      console.log(res.data.data)
      setAllUser(res.data.data);
    });
  }, []);

  //phần add user
  const [openAddUser, setOpenAddUser] = useState(false);
  const handleOpenAddUser = () => setOpenAddUser(true);
  const handleCloseAddUser = () => setOpenAddUser(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [verify, setVerify] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const clickAddUser = async () =>{
    console.log({
      email,
      password,
      phone,
      name,
      address,
      verify
    })
  
    let link = 'https://app-travelbe.herokuapp.com/admin/createUser'
    
    const response = await fetch(link, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("accessToken")},
        body : JSON.stringify({
          email,
          password,
          phone,
          name,
          address,
          verify
        })
    });
    const content = await response.json();
    console.log(content.data)
    if(content.data){
      setNotify({ isOpen: true, message: "Thêm tài khoản thành công", type: "success" });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
    
    }else {
      setNotify({ isOpen: true, message: "Thêm tài khoản thất bại", type: "error" });
     
    }
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allUser.map((n) => n._id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allUser.length) : 0;

  const filteredUsers = applySortFilter(allUser, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User | TravelApp">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User (số lượng {allUser.length}) 
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpenAddUser}
          >
            Thêm tài khoản
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
                  rowCount={allUser.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, name, phone, deleted, email, avatar, role, address } = row;
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
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={_id} src={avatar} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{role==0 ? 'Khách hàng' : 'Admin'}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(deleted == true && 'error') || 'success'}
                            >
                              {deleted == true && 'Blocked' || 'Online'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <UserMenu id={_id} name={name} phone={phone} email={email} address={address} deleted={deleted}/>
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
            count={allUser.length}
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
        open={openAddUser}
        onClose={handleCloseAddUser}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        <Fade in={openAddUser}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Thêm tài khoản
            </Typography>

            

          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(event)=>setName(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="email" label="Email" variant="outlined" value={email} onChange={(event)=>setEmail(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="password" label="Password" variant="outlined" value={password} onChange={(event)=>setPassword(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" type="number" label="Phone" variant="outlined" value={phone} onChange={(event)=>setPhone(event.target.value)}/>
          <TextField style={{marginTop: '10px', width: '100%'}} id="outlined-basic" label="Address" variant="outlined" value={address} onChange={(event)=>setAddress(event.target.value)}/>    
        
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Nhớ điền đầy đủ thông tin nha!
            </Typography>

            <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={clickAddUser}
          >
            Lưu
          </Button>

          </Box>
        </Fade>
      </Modal>

    </Page>
  );
}
