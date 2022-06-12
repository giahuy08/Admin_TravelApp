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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Tên", alignRight: false },
  { id: "payment", label: "Giá(VNĐ)", alignRight: false },
  { id: "time", label: "Thời gian", alignRight: false },
  { id: "star", label: "Đánh giá", alignRight: false },
  { id: "place", label: "Địa điểm", alignRight: false },
  { id: "startingplace", label: "Điểm xuất phát", alignRight: false },
  { id: "deleted", label: "Tình trạng", alignRight: false },
  { id: "itinerary", label: "Lịch trình", alignRight: false },

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

export default function Tour() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Files

  //biến add tour
  const [openAddTour, setOpenAddTour] = React.useState(false);
  const handleOpenAddTour = () => setOpenAddTour(true);
  const handleCloseAddTour = () => setOpenAddTour(false);

  const [enterprise, setEnterprise] = React.useState([]);
  const [idEnterprise, setIDEnterprise] = React.useState("");

  const [vehicle, setVehicle] = React.useState([]);
  const [idVehicles, setidVehicles] = React.useState([]);

  const [name, setName] = React.useState("");
  const [itinerary, setItinerary] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longtitude, setLongtitude] = React.useState("");
  const [detail, setDetail] = React.useState("");
  const [payment, setPayment] = React.useState("");
  const [time, setTime] = React.useState("");
  const [ImagesTour, setImagesTour] = React.useState([]);
  const [startingplace, setStartingPlace] = React.useState("");
  const [file, setFile] = React.useState([]);
  const [category, setCategory] = React.useState(0);
  const [openCategory, setOpenCategory] = React.useState(false);

  const [notify, setNotify] = React.useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleLatitude = (data) => {
    setLatitude(data);
  };
  const handleLongtitude = (data) => {
    setLongtitude(data);
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

  const clickAddTour = async () => {
    console.log({
      idEnterprise,
      idVehicles,
      name,
      place,
      detail,
      payment,
      ImagesTour,
      category,
      time,
      file,
    });

    let link = "https://be-travel.herokuapp.com/tour/createTour";
    let addtour = new FormData();
    addtour.append("idEnterprise", idEnterprise);
    addtour.append("idVehicles[]", idVehicles);
    addtour.append("name", name);
    addtour.append("place", place);
    addtour.append("latitude", latitude);
    addtour.append("longtitude", longtitude);
    addtour.append("detail", detail);
    addtour.append("payment", payment);
    addtour.append("startingplace", startingplace);
    for (let i = 0; i < ImagesTour.length; i++) {
      addtour.append("ImagesTour", ImagesTour[i]);
    }

    // addtour.append("ImagesTour", ImagesTour);
    addtour.append("category", category);
    addtour.append("time", time);
    addtour.append("FilesTour", file);

    const response = await fetch(link, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: addtour,
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
  const [tours, setTours] = useState([]);
  const onChangeInputFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files);
  };
  useEffect(() => {
    callApi(`tour/getAllTourWithDeleted?search&skip&limit`, "GET").then(
      (res) => {
        console.log(res.data.data);
        setTours(res.data.data);
      }
    );
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tours.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const removeImage = (index) => {
    //  const s = ImagesTour.filter((item, i) => i !==index )

    const images = Array.from(ImagesTour);
    images.splice(index, 1);

    console.log(images);
    setImagesTour(images);
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

  const onChangeInput = (e) => {
    setImagesTour(e.target.files);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tours.length) : 0;

  const filteredUsers = applySortFilter(
    tours,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Tour | TRAVEL">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Tour (Số lượng {tours.length})
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={handleOpenAddTour}
          >
            Thêm tour
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
                  rowCount={tours.length}
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
                        payment,
                        time,
                        place,
                        latitude,
                        longtitude,
                        star,
                        startingplace,
                        imagesTour,
                        deleted,
                        itinerary,
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
                              <Avatar alt={name} src={imagesTour[0]} />
                              <Typography variant="subtitle2" noWrap>
                                <Link
                                  to={{
                                    pathname: `/dashboard/review/${_id}`,
                                    state: {
                                      idTour: _id,
                                    },
                                  }}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  {name}
                                </Link>
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/* {/* <TableCell align="left">{company}</TableCell> */}
                          <TableCell align="left">
                            {payment.toLocaleString("en-US")} VNĐ
                          </TableCell>
                          <TableCell align="left">{time}</TableCell>
                          <TableCell align="left">{star.toFixed(2)}</TableCell>

                          <TableCell align="left">{place}</TableCell>
                          <TableCell align="left">{startingplace}</TableCell>

                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(deleted == true && "error") || "success"}
                            >
                              {(deleted == true && "Đã khóa") || "Hoạt động"}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            {itinerary == "" || itinerary == null ? (
                              <p>Trống</p>
                            ) : (
                              <a
                                style={{
                                  color: "#46ac3b",
                                  textDecoration: "none",
                                }}
                                href={itinerary}
                              >
                                File PDF
                              </a>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <TourMenu
                              id={_id}
                              name={name}
                              detail={row.detail}
                              payment={payment}
                              time={time}
                              place={place}
                              category={row.category}
                              idEnterprise={row.idEnterprise}
                              idVehicles={row.idVehicles}
                              deleted={deleted}
                              imagesTour={imagesTour}
                              startingplace={startingplace}
                              latitude={latitude}
                              longtitude={longtitude}
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
            count={tours.length}
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
          timeout: 400,
        }}
      >
        <Fade in={openAddTour} style={{ height: "90%", overflowY: "scroll" }}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Thêm tour mới
            </Typography>

            <Autocomplete
              style={{ marginTop: "10px" }}
              id="free-solo-demo"
              disableClearable
              options={enterprise.map((enterprise) => enterprise.name)}
              renderInput={(params) => (
                <TextField {...params} label="Doanh nghiệp" />
              )}
              onChange={(event, newValue) => {
                enterprise.map((enterprise) => {
                  if (newValue == enterprise.name)
                    setIDEnterprise(enterprise._id);
                });
                console.log(idEnterprise);
              }}
            />

            <Autocomplete
              style={{ marginTop: "10px" }}
              id="free-solo-demo"
              disableClearable
              options={vehicle.map((vehicle) => vehicle.name)}
              renderInput={(params) => (
                <TextField {...params} label="Phương tiện" />
              )}
              onChange={(event, newValue) => {
                vehicle.map((vehicle) => {
                  if (newValue == vehicle.name) setidVehicles(vehicle._id);
                });
                console.log(idVehicles);
              }}
            />

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
              label="Địa điểm"
              variant="outlined"
              value={place}
              onChange={(event) => setPlace(event.target.value)}
            />

            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Điểm xuất phát"
              variant="outlined"
              value={startingplace}
              onChange={(event) => setStartingPlace(event.target.value)}
            />

            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Latitude"
              variant="outlined"
              value={latitude}
              // onChange={(event) => handleLatitude(event)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%", marginBottom: "10px" }}
              id="outlined-basic"
              label="Longtitude"
              variant="outlined"
              value={longtitude}
              // onChange={ (event) => handleLongtitude(event)}
            />

            <Map handleLat={handleLatitude} handleLng={handleLongtitude} />

            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              multiline
              rows={2}
              id="outlined-basic"
              label="Chi tiết"
              variant="outlined"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Giá(VNĐ)"
              variant="outlined"
              value={payment}
              onChange={(event) => setPayment(event.target.value)}
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
                value={category}
                label="Age"
                onChange={handleChangeCategory}
              >
                <MenuItem value={0}>
                  <em>Khác</em>
                </MenuItem>
                <MenuItem value={1}>Biển-Đảo</MenuItem>
                <MenuItem value={2}>Núi</MenuItem>
              </Select>
            </FormControl>

            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Thời gian"
              variant="outlined"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />

            <div class="input-file">
              <input
                type="file"
                multiple
                name="file"
                id="file"
                onChange={onChangeInput}
              />
              <label for="file" class="input-label">
                <i class="fas fa-cloud-upload-alt icon-upload">
                  <CloudUploadIcon />
                </i>
              </label>
            </div>

            <div style={{ display: "flex" }}>
              {ImagesTour &&
                Array.from(ImagesTour).map((image, index) => {
                  return (
                    <div className="preview" key={index}>
                      <span
                        className="close"
                        onClick={(e) => removeImage(index)}
                      >
                        x
                      </span>
                      <img
                        accept="image/*"
                        className="vote-file-preview "
                        src={URL.createObjectURL(image)}
                        // src={image}
                        alt=""
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: "10px",
                        }}
                      />{" "}
                    </div>
                  );
                })}
            </div>

            <div class="input-file">
              <input
                type="file"
                name="file"
                id="filePdf"
                onChange={onChangeInputFile}
              />
              <label for="filePdf" class="input-label">
                {file.length == 0 ? (
                  <p>Chọn File PDF</p>
                ) : (
                  <p style={{ color: "#00ab55" }}>{file.name}</p>
                )}
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
              onClick={clickAddTour}
            >
              Lưu
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Page>
  );
}
