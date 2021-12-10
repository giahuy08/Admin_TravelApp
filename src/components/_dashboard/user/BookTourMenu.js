import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import callApi from 'src/api/apiService'
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import alertCircleOutline from '@iconify/icons-eva/alert-circle-outline';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import * as React from 'react';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useEffect} from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Message from "../../Message";
// ----------------------------------------------------------------------

export default function BookTourMenu(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const [id, setID] = useState(props.id);
  const [status, setStatus] = useState(props.status);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  

  //các hàm xử lý
  const handleCancelBookTour = () => {

    console.log(localStorage.getItem("accessToken"))
    const status = '2'
    console.log(id, status)
    callApi(`booktour/updateBookTour`, "PUT", {id, status})
      .then((res) => {
        window.location.reload();
        setNotify({
          isOpen: true,
          message: "Hủy thành công",
          type: "success",
        });
        
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const handleConfirmBookTour = () => {

    console.log(localStorage.getItem("accessToken"))
    const status = '1'
    console.log(id, status)
    callApi(`booktour/updateBookTour`, "PUT", {id, status})
      .then((res) => {
        console.log(res);
        window.location.reload()
        
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
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Cancel" primaryTypographyProps={{ variant: 'body2' }} onClick={handleCancelBookTour}/>
        </MenuItem>
        {status == 0 && <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={alertCircleOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Confirm" primaryTypographyProps={{ variant: 'body2' }} onClick={handleConfirmBookTour}/>
        </MenuItem> || ''}             
      </Menu>

      
    </>
  );
}
