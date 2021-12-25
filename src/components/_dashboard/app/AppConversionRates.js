import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------
import callApi from 'src/api/apiService';
import { useEffect, useState } from 'react';

const CHART_DATA = [{ data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380] }];

export default function AppConversionRates() {
  const [data,setData] =useState([])
  const [name,setName] =useState([])
 
  console.log(data)
  useEffect( () => {
     callApi(
      `statistic/getStatisticByData`,
      "GET"
    ).then((res) => {
      const place = res.data.data.statistictour
      const placeData = place.map((row, a, n) => { return row['countbooktour'] })
      const nameData = place.map((row, a, n) => { return row['nameTour'] })
      
      setData(placeData);
      
      setName(nameData)

      
    });
  }, []);
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: [
        ...name
      ]
    }
  });

  return (
    <Card>
      <CardHeader title="Các tour của ứng dụng" subheader="" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: data }]} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
