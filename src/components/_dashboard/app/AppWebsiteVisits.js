import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

// const CHART_DATA = [
//   {
//     name: 'Team A',
//     type: 'column',
//     data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
//   },
//   {
//     name: 'Team B',
//     type: 'area',
//     data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
//   },
//   {
//     name: 'Team C',
//     type: 'line',
//     data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 500]
//   }
// ];

export default function AppWebsiteVisits(props) {

  const CHART_DATA = [
    {
      name: 'Total Book Tour',
      type: 'column',
      data: props.bookTour
    },
    {
      name: 'Total Money(VNĐ)',
      type: 'area',
      data: props.money
    },
  
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0,1] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient'] },
    labels: props.date,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
     
    }
  });

  return (
    <Card >
      <CardHeader title="Thống kê doanh thu" subheader="" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} disable/>
      </Box>
    </Card>
  );
}
