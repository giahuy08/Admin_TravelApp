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
export default function VehicleMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = React.useState(props.type);
  const [openEditVehicle, setOpenEditVehicle] = React.useState(false);
  const handleOpenEditVehicle = () => setOpenEditVehicle(true);
  const handleCloseEditVehicle = () => setOpenEditVehicle(false);
  const [idEnterprise, setIDEnterprise] = React.useState(props.idEnterprise);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [idVehicles, setidVehicles] = React.useState(props.idVehicles);

  const [name, setName] = React.useState(props.name);
  const [vehicleNumber, setVehicleNumber] = React.useState(props.vehicleNumber);
  const [detail, setDetail] = React.useState(props.detail);
  const [payment, setPayment] = React.useState(props.payment);
  const [time, setTime] = React.useState(props.time);
  const [ImagesVehicle, setImagesVehicle] = React.useState();
  const [deleted, setDeleted] = useState(props.deleted);

  const [category, setCategory] = React.useState(props.category);
  const [openCategory, setOpenCategory] = React.useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleClickDialogClose = () => {
    setOpenDialog(false);
  };
  const handleClickDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleChangeCategory = (event) => {
    setType(event.target.value);
  };

  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
  };

  
  const clickEditVehicle = async () => {
    console.log({
      idEnterprise,
      idVehicles,
      name,
      vehicleNumber,
      detail,
      payment,
      ImagesVehicle,
      category,
      time,
    });

    let link = "https://app-travelbe.herokuapp.com/vehicle/updateVehicle";
    let editvehicle = new FormData();
    editvehicle.append("id", props.id);
    editvehicle.append("name", name);
    editvehicle.append("type", type);
    editvehicle.append("vehicleNumber", vehicleNumber);
    editvehicle.append("ImagesVehicle", ImagesVehicle);
    const response = await fetch(link, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: editvehicle,
    });
    const content = await response.json();
    console.log(content.data);
    if (content.data) {
      setNotify({
        isOpen: true,
        message: "Sửa thành công",
        type: "success",
      });
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    } else {
      setNotify({
        isOpen: true,
        message: "Sửa thất bại",
        type: "error",
      });
    }
  };

  const handleDeleteVehicle = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`vehicle/deleteForceVehicle?id=${props.id}`, "DELETE")
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
            primary="Xóa"
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
            onClick={handleOpenEditVehicle}
            primary="Chỉnh sửa"
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
              handleDeleteVehicle();
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
        open={openEditVehicle}
        onClose={handleCloseEditVehicle}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEditVehicle}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Sửa phương tiện
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
              value={vehicleNumber}
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
              Kiểm tra thông tin nha!
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={clickEditVehicle}
            >
              Lưu
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
