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
export default function ScheduleTourMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [openEditScheduleTour, setOpenEditScheduleTour] = React.useState(false);
  const handleOpenEditScheduleTour = () => setOpenEditScheduleTour(true);
  const handleCloseEditScheduleTour = () => setOpenEditScheduleTour(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [id, setID] = useState(props.id);
  const [slot, setSlot] = useState(props.slot);
  const [MFG, setMFG] = useState(props.MFG);
  const [EXP, setEXP] = useState(props.EXP);
  const [status, setStatus] = useState(props.status);
  const [scheduletour, setScheduleTour] = useState();
  const [scheduletourEmail, setScheduleTourEmail] = useState([]);
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

  //các hàm xử lý
  const clickEditScheduleTour = () => {
    console.log(localStorage.getItem("accessToken"));
    callApi(`scheduletour/updateScheduleTour`, "PUT", { id, slot, MFG, EXP })
      .then((res) => {
        window.location.reload();
        setNotify({
          isOpen: true,
          message: "Sửa thành công",
          type: "success",
        });
      })
      .catch((err) => {
        setNotify({
          isOpen: true,
          message: "Sửa thất bại",
          type: "error",
        });
      });
  };

  useEffect(() => {
    callApi(`scheduletour/getOneScheduleTour?id=${id}`, "GET").then(
      (res) => {
   
          setScheduleTour(res.data.data);
          setScheduleTourEmail(res.data.data.listEmail)
      
      },
     
    )
    .catch(err=>{
      console.log(err)
    })
  },[]);

  const handleDeleteScheduleTour = () => {
    console.log(localStorage.getItem("accessToken"));
    console.log(id);
    callApi(`scheduletour/deleteScheduleTour?id=${id}`, "DELETE")
      .then((res) => {
        setNotify({
          isOpen: true,
          message: "xóa thành công",
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
        <MenuItem
          component={RouterLink}
          to="#"
          sx={{ color: "text.secondary" }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            onClick={handleOpenEditScheduleTour}
            primary="Chỉnh sửa"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
        {(status == 0 && (
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
        )) ||
          ""}
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
            style={{ textAlign: "center",marginBottom:"10px" }}
          >
            Bạn có muốn xóa lịch trình? <br></br> 
            Hệ thống sẽ gửi đến những email này để hoàn tiền
          </DialogContentText>
          
          { scheduletourEmail?
            scheduletourEmail.map(mail=><p>{mail}</p>):<p></p>
          }
         
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleDeleteScheduleTour();
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
        open={openEditScheduleTour}
        onClose={handleCloseEditScheduleTour}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 0,
        }}
      >
        <Fade in={openEditScheduleTour}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Sửa lịch trình
            </Typography>

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
              Kiểm tra trước khi nhấn "Lưu"!
            </Typography>

            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={plusFill} />}
              onClick={clickEditScheduleTour}
            >
              Lưu
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
