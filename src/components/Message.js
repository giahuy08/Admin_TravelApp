import * as React from "react";
import Stack from "@mui/material/Stack";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Message(props) {
  const { notify, setNotify } = props;

  const handleClose = () => {
    
    setNotify({
      ...notify,
      isOpen:false
    })
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      
      <Snackbar open={notify.isOpen} autoHideDuration={2000}  onClose={handleClose}  anchorOrigin={{ vertical:'bottom',horizontal:'center' }}>
        <Alert onClose={handleClose} severity={notify.type} sx={{ width: "100%" }}>
        {notify.message}
        </Alert>
      </Snackbar>
     
    </Stack>
  );
}

export default Message;
