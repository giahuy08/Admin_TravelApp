// material
import { Box, Grid, Container, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import callApi from 'src/api/apiService';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import DesktopDateRangePicker from '@mui/lab/DesktopDateRangePicker';
import * as React from 'react';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [value, setValue] = useState([null, null]);

  const [totalUser, setTotalUser] = useState('');
  const [totalTour, setTotalTour] = useState('');
  const [totalBookTour, setTotalBookTour] = useState('');
  const [totalEnterprise, setTotalEnterprise] = useState('');
  const [totalBookTourAwait, setTotalBookTourAwait] = useState('');
  const [totalBookTourCancel, setTotalBookTourCancel] = useState('');
  const [totalStatisticBookTour, setTotalStatisticBookTour] = useState([]);
  const [date, setDate] = useState([]);
  const [bookTour, setBookTour] = useState([]);
  const [money, setMoney] = useState([]);

  useEffect(async () => {
    await callApi(
      `statistic/getStatisticByData`,
      "GET"
    ).then((res) => {
      setTotalUser(res.data.data.user);
      setTotalTour(res.data.data.tour.all);
      setTotalBookTour(res.data.data.booktour.complete);
      setTotalEnterprise(res.data.data.enterprise);
      setTotalBookTourAwait(res.data.data.booktour.await)
      setTotalBookTourCancel(res.data.data.booktour.cancel)
    });
  }, []);



  const clickOK = async (e) => {
    e.preventDefault()

    await callApi(
      'statistic/getStatisticByBookTour?timeStart=' + new Date(value[0]) + '&timeEnd=' + new Date(value[1]),
      "GET"
    ).then((res) => {
      console.log(res.data)
     
      console.log(totalStatisticBookTour)
      var data = res.data.data;

        const a = data.map((row, a, n) => { return Object.keys(row)[0] })
        console.log(a)
        setDate(a)
        const money1 = data.map((row, a, n) => { return row[Object.keys(row)]['totalMoney'] })
        console.log(money1)
        setMoney(money1)
        const bookTour1 = data.map((row, a, n) => { return row[Object.keys(row)]['totalBookTour'] })
        console.log(bookTour1)
        setBookTour(bookTour1)
        setTotalStatisticBookTour(res.data.data)



    });
  
   
  }

  return (
    <Page title="Thống Kê | TRAVEL">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Xin chào, quản lý ứng dụng TRAVEL</Typography>
        </Box>
        {totalUser == '' && <div>
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
          || <div>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AppWeeklySales totalTour={totalTour} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppNewUsers totalUser={totalUser} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppItemOrders totalBookTour={totalBookTour} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppBugReports totalEnterprise={totalEnterprise} />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>

                    <DesktopDateRangePicker
                      startText="Ngày bắt đầu"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                      }}
                      renderInput={(startProps, endProps) => (
                        <React.Fragment>
                          <TextField {...startProps} />
                          <Box sx={{ mx: 2 }}> đến </Box>
                          <TextField {...endProps} />
                        </React.Fragment>
                      )}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    style={{marginTop:20,marginBottom:20,width:200,height:60}}
                    onClick={clickOK}
                  >
                    Thống kê
                  </Button>

                </LocalizationProvider>

                <AppWebsiteVisits date={date} bookTour={bookTour} money={money} />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <AppCurrentVisits totalStatisticBookTour={[totalBookTour, totalBookTourAwait, totalBookTourCancel]} />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
              <AppConversionRates />
            </Grid>
  
            {/* <Grid item xs={12} md={6} lg={4}>
              <AppCurrentSubject />
            </Grid> */}
  
            {/* <Grid item xs={12} md={6} lg={8}>
              <AppNewsUpdate />
            </Grid> */}
  
            <Grid item xs={12} md={6} lg={4}>
              <AppOrderTimeline />
            </Grid>
  
            {/* <Grid item xs={12} md={6} lg={4}>
              <AppTrafficBySite />
            </Grid>
  
            <Grid item xs={12} md={6} lg={8}>
              <AppTasks />
            </Grid> */}
            </Grid>
          </div>}



      </Container>
    </Page>
  );

}
