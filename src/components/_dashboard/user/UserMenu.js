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
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Message from "../../Message";
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
export default function UserMoreMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [openEditUser, setOpenEditUser] = React.useState(false);
  const handleOpenEditUser = () => setOpenEditUser(true);
  const handleCloseEditUser = () => setOpenEditUser(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(props.name);
  const [phone, setPhone] = useState(props.phone);
  const [address, setAddress] = useState(props.address);
  const [verify, setVerify] = useState(true);
  const [id, setID] = useState(props.id);
  const [deleted, setDeleted] = useState(props.deleted);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  //sửa lý edit user
  const clickEditUser = async () => {
    console.log({
      id,
      email,
      password,
      phone,
      name,
      address,
      verify,
    });

    let link = "https://app-travelbe.herokuapp.com/admin/updateUser";
    const response = await fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        id,
        email,
        password,
        phone,
        name,
        address,
        verify,
      }),
    });
    const content = await response.json();
    console.log(content.data);
    if (content.data) {
      window.location.reload();
      setNotify({
        isOpen: true,
        message: "Sửa tài khoản thành công",
        type: "success",
      });
     
    } else {
      setNotify({
        isOpen: true,
        message: "Sửa tài khoản thất bại",
        type: "error",
      });
    }
  };

  const handleDeleteUser = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`admin/deleteForceUser?id=${props.id}`, "DELETE")
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

  const handleBlockUser = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`admin/deleteUser?id=${props.id}`, "DELETE")
      .then((res) => {
        console.log(res);
        setNotify({
          isOpen: true,
          message: "Block tài khoản thành công",
          type: "success",
        });
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Block tài khoản thất bại",
          type: "error",
        });
      });
  };

  const handleUnblockUser = () => {
    console.log(localStorage.getItem("accessToken"));

    callApi(`admin/restoreUser?id=${props.id}`, "POST")
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "UnBlock tài khoản thành công",
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
            onClick={handleDeleteUser}
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
              onClick={handleUnblockUser}
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
              onClick={handleBlockUser}
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
            onClick={handleOpenEditUser}
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>

     

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditUser}
        onClose={handleCloseEditUser}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        <Fade in={openEditUser}>
      
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Edit user
            </Typography>

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
              type="email"
              label="Email"
              variant="outlined"
              value={props.email}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              type="number"
              label="Phone"
              variant="outlined"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <TextField
              style={{ marginTop: "10px", width: "100%" }}
              id="outlined-basic"
              label="Address"
              variant="outlined"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />

            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Kiểm tra trước khi nhấn save!
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={clickEditUser}
            >
              Lưu
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
