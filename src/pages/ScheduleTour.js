import { filter } from "lodash";
import { Icon } from "@iconify/react";
import * as React from "react";
// import { sentenceCase } from 'change-case';
import { useState, useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import callApi from "src/api/apiService";
import { Link } from "react-router-dom";
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
import Message from "../components/Message";
import { UserListHead, UserListToolbar } from "../components/_dashboard/user";

import TourMenu from "../components/_dashboard/user/TourMenu";
//
import USERLIST from "../_mocks_/user";
//css
import "./AddTour.css";
import Map from "./Map";
import ScheduleTourMenu from "src/components/_dashboard/user/ScheduleTourMenu";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "nameTour", label: "Tên tour", alignRight: false },
  { id: "slot", label: "Số lượng chỗ", alignRight: false },
  { id: "booked", label: "Đã đặt", alignRight: false },
  { id: "MFG", label: "Ngày đăng ký", alignRight: false },
  { id: "EXP", label: "Ngày kết thúc", alignRight: false },
  { id: "startDate", label: "Ngày khởi hành", alignRight: false },
  { id: "endDate", label: "Ngày về", alignRight: false },
  { id: "delete", label: "Tình trạng", alignRight: false },
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
    console.log(query);
    return filter(
      array,
      (_user) => _user.nameTour.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

export default function ScheduleTour() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  //
  const [openAddScheduleTour, setOpenAddScheduleTour] = useState(false);
  const handleOpenAddScheduleTour = () => setOpenAddScheduleTour(true);
  const handleCloseAddScheduleTour = () => setOpenAddScheduleTour(false);

  //cách biến thêm ScheduleTour
  const [ScheduleTour, setScheduleTour] = useState("");
  const [idTour, setIDTour] = useState("");
  const [slot, setSlot] = useState("");
  const [MFG, setMFG] = useState("");
  const [EXP, setEXP] = useState("");
  //add ScheduleTour
  const clickAddScheduleTour = async () => {
    let link =
      "https://be-travel.herokuapp.com/scheduletour/createScheduleTour";

    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        idTour,
        slot,
        MFG,
        EXP,
      }),
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
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    }
  };

  //lấy danh sách Schedule Tour
  const [allScheduleTour, setAllScheduleTour] = useState([]);

  useEffect(() => {
    callApi(`scheduletour/getAllScheduleTour`, "GET").then((res) => {
      console.log(res.data.data);
      setAllScheduleTour(res.data.data);
    });
  }, []);

  //lấy danh sách tour
  const [tours, setTours] = useState([]);

  useEffect(() => {
    callApi(`tour/getAllTour?search&skip&limit`, "GET").then((res) => {
      console.log(res.data.data);
      setTours(res.data.data);
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = allScheduleTour.map((n) => n._id);
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
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - allScheduleTour.length)
      : 0;

  const filteredScheduleTour = applySortFilter(
    allScheduleTour,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredScheduleTour.length === 0;

  return (
    <Page title="Lịch Trình Chuyến Đi | TRAVEL">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Lịch Trình Chuyến Đi (Số lượng {allScheduleTour.length})
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpenAddScheduleTour}
          >
            Thêm lịch trình
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
                  rowCount={allScheduleTour.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredScheduleTour
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        _id,
                        nameTour,
                        slot,
                        booked,
                        MFG,
                        EXP,
                        startDate,
                        endDate,
                        tour,
                        status,
                        idTour,
                        deleted,
                      } = row;
                      const name = row.tour.name;
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
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            sx={{ maxWidth: 350 }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar alt={_id} src={tour.imagesTour[0]} />
                              <Typography variant="subtitle2" noWrap>
                                <Link
                                  to={{
                                    pathname: `/dashboard/scheduletour/${_id}`,
                                    state: {
                                      id: _id,
                                    },
                                  }}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  {nameTour}
                                </Link>
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{slot}</TableCell>
                          <TableCell align="left">{booked.length}</TableCell>
                          <TableCell align="left">
                            {new Date(MFG).toISOString("vi-VN").slice(0, 10)}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(EXP).toISOString("vi-VN").slice(0, 10)}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(startDate)
                              .toISOString("vi-VN")
                              .slice(0, 10)}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(endDate)
                              .toISOString("vi-VN")
                              .slice(0, 10)}
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={
                                (slot > booked.length && "success") || "error"
                              }
                            >
                              {(slot > booked.length && "Còn trống") ||
                                "Hết chỗ"}
                            </Label>
                          </TableCell>
                          <TableCell align="right">
                            <ScheduleTourMenu
                              id={_id}
                              slot={slot}
                              MFG={MFG}
                              EXP={EXP}
                              status={status}
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
            count={allScheduleTour.length}
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
        open={openAddScheduleTour}
        onClose={handleCloseAddScheduleTour}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        <Fade in={openAddScheduleTour}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Thêm lịch trình
            </Typography>

            <Autocomplete
              style={{ marginTop: "10px" }}
              id="free-solo-demo"
              disableClearable
              options={tours.map((t) => t.name)}
              renderInput={(params) => <TextField {...params} label="Tour" />}
              onChange={(event, newValue) => {
                tours.map((t) => {
                  if (newValue == t.name) setIDTour(t._id);
                });
                console.log(idTour);
              }}
            />

            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Số lượng chỗ"
              variant="outlined"
              value={slot}
              onChange={(event) => setSlot(event.target.value)}
            />
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Ngày đăng ký:
            </Typography>
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              type="date"
              variant="outlined"
              value={MFG}
              onChange={(event) => setMFG(event.target.value)}
            />
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Ngày kết thúc:
            </Typography>
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              type="date"
              variant="outlined"
              value={EXP}
              onChange={(event) => setEXP(event.target.value)}
            />
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Kiểm tra trước khi nhấn "Thêm"!
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={clickAddScheduleTour}
            >
              Thêm
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Page>
  );
}
