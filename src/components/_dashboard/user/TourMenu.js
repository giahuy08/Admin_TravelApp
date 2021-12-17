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
export default function TourMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEditTour, setOpenEditTour] = React.useState(false);
  const handleOpenEditTour = () => setOpenEditTour(true);
  const handleCloseEditTour = () => setOpenEditTour(false);

  const [enterprise, setEnterprise] = React.useState([]);
  const [idEnterprise, setIDEnterprise] = React.useState(props.idEnterprise);

  const [vehicle, setVehicle] = React.useState([]);
  const [idVehicles, setidVehicles] = React.useState(props.idVehicles);

  const [name, setName] = React.useState(props.name);
  const [place, setPlace] = React.useState(props.place);
  const [detail, setDetail] = React.useState(props.detail);
  const [payment, setPayment] = React.useState(props.payment);
  const [time, setTime] = React.useState(props.time);
  const [ImagesTour, setImagesTour] = React.useState();
  const [deleted, setDeleted] = useState(props.deleted);

  const [category, setCategory] = React.useState(props.category);
  const [openCategory, setOpenCategory] = React.useState(false);
  const handleClickDialogClose = () => {
    setOpenDialog(false);
  };
  const handleClickDialogOpen = () => {
    setOpenDialog(true);
  };
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  const handleOpenCategory = () => {
    setOpenCategory(true);
  };

  //sửa lý edit tour
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

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "https://app-travelbe.herokuapp.com/vehicle/getAllVehicle",
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

  const clickEditTour = async () => {
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
    });

    let link = "https://app-travelbe.herokuapp.com/tour/updateTour";
    let addtour = new FormData();
    addtour.append("id", props.id);
    addtour.append("idEnterprise", idEnterprise);
    addtour.append("idVehicles[]", idVehicles);
    addtour.append("name", name);
    addtour.append("place", place);
    addtour.append("detail", detail);
    addtour.append("payment", payment);
    addtour.append("ImagesTour", ImagesTour);
    addtour.append("category", category);
    addtour.append("time", time);
    const response = await fetch(link, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: addtour,
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
      setNotify({ isOpen: true, message: "Sửa thất bại", type: "error" });
    }
  };

  const handleDeleteTour = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`tour/deleteForceTour?id=${props.id}`, "DELETE")
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Xóa thành công",
          type: "success",
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBlockTour = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`tour/deleteTour?id=${props.id}`, "DELETE")
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "Block thành công",
          type: "success",
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUnblockTour = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`tour/restoreTour?id=${props.id}`, "POST")
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "UnBlock thành công",
          type: "success",
        });
        window.location.reload();
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

        {(deleted == true && (
          <MenuItem sx={{ color: "text.secondary" }}>
            <ListItemIcon>
              <Icon icon={alertCircleOutline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Unblock"
              primaryTypographyProps={{ variant: "body2" }}
              onClick={handleUnblockTour}
            />
          </MenuItem>
        )) || (
          <MenuItem sx={{ color: "text.secondary" }}>
            <ListItemIcon>
              <Icon icon={alertCircleOutline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="Block"
              primaryTypographyProps={{ variant: "body2" }}
              onClick={handleBlockTour}
            />
          </MenuItem>
        )}

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
              handleDeleteTour();
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
        <Fade in={openEditTour} style={{ height: "90%", overflowY: "scroll" }}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit Tour
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

            <Autocomplete
              value={vehicle.map((v) => {
                if (idVehicles == v._id) return v.name;
              })}
              style={{ marginTop: "10px" }}
              id="free-solo-demo"
              disableClearable
              options={vehicle.map((vehicle) => vehicle.name)}
              renderInput={(params) => (
                <TextField {...params} label="Vehicle" />
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
              label="Name"
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Place"
              variant="outlined"
              value={place}
              onChange={(event) => setPlace(event.target.value)}
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
              label="Payment(VNĐ)"
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
              label="Time"
              variant="outlined"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />

            <div class="input-file">
              <input
                type="file"
                name="file"
                id="file"
                onChange={(event) => setImagesTour(event.target.files[0])}
              />
              <label for="file" class="input-label">
                <i class="fas fa-cloud-upload-alt icon-upload">
                  <CloudUploadIcon />
                </i>
              </label>
            </div>

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Nhớ kiểm tra trước khi save nha!
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
