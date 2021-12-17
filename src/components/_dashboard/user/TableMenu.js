import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import callApi from "src/api/apiService";
import editFill from "@iconify/icons-eva/edit-fill";
import { Link as RouterLink } from "react-router-dom";
import alertCircleOutline from "@iconify/icons-eva/alert-circle-outline";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import * as React from "react";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
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
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import plusFill from "@iconify/icons-eva/plus-fill";
import { useEffect } from "react";
import Message from "../../Message";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// ----------------------------------------------------------------------
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
export default function RoomMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = React.useState(props.type);
  const [openEditTour, setOpenEditTour] = React.useState(false);
  const handleOpenEditTour = () => setOpenEditTour(true);
  const handleCloseEditTour = () => setOpenEditTour(false);

  const [enterprise, setEnterprise] = React.useState([]);
  const [idEnterprise, setIDEnterprise] = React.useState(props.idEnterprise);

  const [name, setName] = React.useState(props.name);
  const [size, setSize] = React.useState(props.size);
  const [floor, setFloor] = React.useState(props.floor);
  const [detail, setDetail] = React.useState(props.detail);
  const [checkIn, setCheckIn] = React.useState(props.checkIn);
  const [price, setPrice] = React.useState(props.price);
  const [checkOut, setCheckOut] = React.useState(props.checkOut);
  const [deleted, setDeleted] = React.useState(props.deleted);
  const [id, setId] = React.useState(props.id);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://app-travelbe.herokuapp.com/enterprise/getAllEnterprise",
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

  const handleChangeCategory = (event) => {
    setType(event.target.value);
  };
  const handleClickDialogClose = () => {
    setOpenDialog(false);
  };
  const handleClickDialogOpen = () => {
    setOpenDialog(true);
  };
  const clickEditTour = async () => {
    console.log({
      idEnterprise,
      name,
      size,
      floor,
      detail,
      price,
      checkIn,
      checkOut,
    });

    let link =
      "https://app-travelbe.herokuapp.com/restauranttable/updateRestaurantTable";

    const response = await fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id,
        idEnterprise,
        name,
        size,
        floor,
        detail,
        price,
        checkIn,
        checkOut,
      }),
    });
    const content = await response.json();
    console.log(content.data);
    if (content.data) {
      window.location.reload();
      setNotify({
        isOpen: true,
        message: "Sửa thành công",
        type: "success",
      });
    } else {
      setNotify({
        isOpen: true,
        message: "Sửa thất bại",
        type: "error",
      });
    }
  };

  const handleDeleteTable = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(
      `restauranttable/deleteForceRestaurantTable?id=${props.id}`,
      "DELETE"
    )
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Xóa thành công",
          type: "success",
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>
      <Message notify={notify} setNotify={setNotify} />
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
            onClick={handleClickDialogOpen}
          />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          to="#"
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            onClick={handleOpenEditTour}
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={handleClickDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ width: 500 }}>
          {"Xác nhận xóa?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center" }}
          >
            Bạn có muốn xóa
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleDeleteTable();
            }}
          >
            Xóa
          </Button>
          <Button onClick={handleClickDialogClose} autoFocus>
            Thoát
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditTour}
        onClose={handleCloseEditTour}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        <Fade in={openEditTour}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Sửa Table
            </Typography>

            <Autocomplete
              value={enterprise.map((e) => {
                if (idEnterprise == e._id) return e.name;
              })}
              style={{ marginTop: "10px" }}
              id="free-solo-demo"
              disableClearable
              options={enterprise.map((e) => e.name)}
              renderInput={(params) => (
                <TextField {...params} label="Enterprise" />
              )}
              onChange={(event, newValue) => {
                enterprise.map((enterprise) => {
                  if (newValue == enterprise.name)
                    setIDEnterprise(enterprise._id);
                });
                console.log(idEnterprise);
              }}
            />

            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              type="number"
              label="Size"
              variant="outlined"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              type="number"
              label="Floor"
              variant="outlined"
              value={floor}
              onChange={(event) => setFloor(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              multiline
              rows={2}
              id="outlined-basic"
              label="Detail"
              variant="outlined"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              type="number"
              label="Price(VNĐ)"
              variant="outlined"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Kiểm tra trước khi lưu!
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={clickEditTour}
            >
              Save
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
