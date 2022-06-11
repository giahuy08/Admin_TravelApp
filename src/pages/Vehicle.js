import { filter } from "lodash";
import { Icon } from "@iconify/react";
import * as React from "react";
// import { sentenceCase } from 'change-case';
import { useState, useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import callApi from "src/api/apiService";
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
  TablePagination,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../components/_dashboard/user";
import Message from '../components/Message';
//
import USERLIST from "../_mocks_/user";
//css
import AddTour from "./AddTour.css";
import VehicleMenu from "src/components/_dashboard/user/VehicleMenu";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Tên", alignRight: false },
  { id: "type", label: "Loại", alignRight: false },
  { id: "vehicleNumber", label: "Biển số xe", alignRight: false },
  // { id: "status", label: "Hoạt động", alignRight: false },
  { id: "deleted", label: "Trạng thái", alignRight: false },
  // { id: 'star', label: 'Star', alignRight: false },
  // { id: 'place', label: 'Place', alignRight: false },
  // { id: 'deleted', label: 'Deleted', alignRight: false },
  { id: "" },
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
  return order === "desc"
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
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Vehicle() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //biến add tour
  const [openAddTour, setOpenAddTour] = React.useState(false);
  const handleOpenAddTour = () => setOpenAddTour(true);
  const handleCloseAddTour = () => setOpenAddTour(false);

  const [enterprise, setEnterprise] = React.useState([]);
  const [idEnterprise, setIDEnterprise] = React.useState("");

  const [vehicle, setVehicle] = React.useState([]);
  const [idVehicles, setidVehicles] = React.useState([]);

  const [name, setName] = React.useState("");
  const [vehiclenumber, setVehicleNumber] = React.useState("");
  const [detail, setDetail] = React.useState("");
  const [payment, setPayment] = React.useState("");
  const [time, setTime] = React.useState("");
  const [ImagesVehicle, setImagesVehicle] = React.useState([]);

  const [type, setType] = React.useState(0);
  const [openCategory, setOpenCategory] = React.useState(false);

  const [notify, setNotify] = React.useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleChangeCategory = (event) => {
    setType(event.target.value);
  };

  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
  };

  //sửa lý add tour
  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://be-travel.herokuapp.com/enterprise/getAllEnterprise",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      const content = await response.json();
      setEnterprise(content.data);
    })();
  }, []);

 

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://be-travel.herokuapp.com/vehicle/getAllVehicle",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      const content = await response.json();
      setVehicle(content.data);
    })();
  }, []);

  const clickAddVehicle = async () => {
   

    let link = "https://be-travel.herokuapp.com/vehicle/createVehicle";
    let addvehicle = new FormData();
  
    addvehicle.append("name", name);
    addvehicle.append("type", type);
    addvehicle.append("vehicleNumber", vehiclenumber);
     addvehicle.append("ImagesVehicle", ImagesVehicle);

    
    const response = await fetch(link, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: addvehicle,
    });
    const content = await response.json();
    console.log(content.data);
    if (content.data) {
     setNotify({ isOpen: true, message: "Thêm thành công", type: "success" });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      setNotify({ isOpen: true, message: "Thêm thất bại", type: "error" });
    }
  };

  //
  

  // useEffect(() => {
  //   callApi(`tour/getAllTourWithDeleted?search&skip&limit`, "GET").then(
  //     (res) => {
  //       console.log(res.data.data);
  //       setVehicle(res.data.data);
  //     }
  //   );
  // }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = vehicle.map((n) => n.name);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - vehicle.length) : 0;

  const filteredUsers = applySortFilter(
    vehicle,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Phương Tiện | TRAVEL">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Phương tiện (Số lượng {vehicle.length})
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpenAddTour}
          >
            Thêm phương tiện
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
                  rowCount={vehicle.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        _id,
                        name,
                        type,
                        vehicleNumber,
                        imagesVehicle,
                        deleted,
                        // status
                       
                      } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

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
                              onChange={(event) => handleClick(event, name)}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            sx={{ maxWidth: 400 }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar alt="" src={imagesVehicle[0]} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* {/* <TableCell align="left">{company}</TableCell> */}
                          <TableCell align="left">
                          {(type===0 && "Ôtô")}
                          {(type===1 && "Xe Bus")}
                          {(type===2 && "Tàu")}
                          {(type===3 && "Máy bay")}
                           </TableCell>
                          <TableCell align="left">{vehicleNumber}</TableCell>
                          {/* <TableCell align="left">{(status === 0 && "Còn") || "Hết"}</TableCell> */}
                       
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(deleted !== false && "error") || "success"}
                            >
                              {(deleted === false && "Hoạt động") || "Đã xóa"}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <VehicleMenu
                              id={_id}
                              name={name}
                              type={row.type}
                              vehicleNumber={row.vehicleNumber}
                              deleted={row.deleted}
                             status={row.status}
                             
                            />
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
            count={vehicle.length}
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
        open={openAddTour}
        onClose={handleCloseAddTour}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddTour}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Thêm phương tiện
            </Typography>

           
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Tên"
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Biển số xe"
              variant="outlined"
              value={vehiclenumber}
              onChange={(event) => setVehicleNumber(event.target.value)}
            />
         

            <FormControl sx={{ marginTop: "10px", width: "100%" }}>
              <InputLabel id="demo-controlled-open-select-label">
                Loại
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={openCategory}
                onClose={handleCloseCategory}
                onOpen={handleOpenCategory}
                value={type}
                label="Age"
                onChange={handleChangeCategory}
              >
                <MenuItem value={0}>
                  <em>Ôtô</em>
                </MenuItem>
                <MenuItem value={1}>Xe bus</MenuItem>
                <MenuItem value={2}>Tàu</MenuItem>
                <MenuItem value={3}>Máy bay</MenuItem>
         
              </Select>
            </FormControl>

         

            <div class="input-file">
              <input
                type="file"
                name="file"
                id="file"
                onChange={(event) => setImagesVehicle(event.target.files[0])}
              />
              <label for="file" class="input-label">
                <i class="fas fa-cloud-upload-alt icon-upload">
                  <CloudUploadIcon />
                </i>
              </label>
            </div>

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Nhớ điền đầy đủ thông tin nha!
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={clickAddVehicle}
            >
              Lưu
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Page>
  );
}
