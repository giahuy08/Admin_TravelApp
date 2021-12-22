import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import callApi from 'src/api/apiService';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import Message from '../components/Message'
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const btnSubmit = (e)=>{
    e.preventDefault();
 
    if (values.email !== "" && values.password !== "") {
      let data = {
        email: values.email,
        password: values.password,
      };
      callApi(`user/loginAdmin`, "POST", data)
        .then((res) => {
          console.log(res);
          console.log(res.data.data.token)       
          localStorage.setItem("accessToken",res.data.data.token)
          localStorage.setItem("name",res.data.data.user.name)
          localStorage.setItem("email",res.data.data.user.email)

          setNotify({
            isOpen: true,
            message: "Đăng nhập thành công",
            type: "success",
          });
          setTimeout(function () {
            navigate('/dashboard', { replace: true });
          }, 1500);
      
          
         
        })
        .catch((err) => {
          setNotify({
            isOpen: true,
            message: "Đăng nhập thất bại",
            type: "error",
          });
          console.log(err);
        });
    }
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => btnSubmit()
  });

  const { errors, touched, values, isSubmitting, getFieldProps } = formik;
  console.log(values.email)

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={btnSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
         

         
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
      <Message notify={notify} setNotify={setNotify} />
    </FormikProvider>
  );
}
