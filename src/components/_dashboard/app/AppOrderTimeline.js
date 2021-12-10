import faker from 'faker';
import PropTypes from 'prop-types';
// material
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineDot
} from '@mui/lab';
// utils
import { fDateTime } from '../../../utils/formatTime';
import callApi from 'src/api/apiService';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

const TIMELINES = [
  {
    title: '1983, orders, $4220',
    time: faker.date.past(),
    type: 'order1'
  },
  {
    title: '12 Invoices have been paid',
    time: faker.date.past(),
    type: 'order2'
  },
  {
    title: 'Order #37745 from September',
    time: faker.date.past(),
    type: 'order3'
  },
  {
    title: 'New order placed #XF-2356',
    time: faker.date.past(),
    type: 'order4'
  },
  {
    title: 'New order placed #XF-2346',
    time: faker.date.past(),
    type: 'order5'
  }
];

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              // (type === 'order1' && 'primary.main') ||
              // (type === 1 && 'success.main') ||
              // (type === 2 && 'info.main') ||
              // (type === 0 && 'warning.main') ||
              // 'error.main'
              
              (type === 1 && 'success.main') ||             
              (type === 0 && 'warning.main') ||
              'error.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AppOrderTimeline() {
  const [data,setData] =useState([])
  useEffect(() => {
     callApi(
      `statistic/getStatisticByData`,
      "GET"
    ).then((res) => {     
      const place = res.data.data.listbooktour
      const booktour =  place.map((row, a, n) => { return {
        title: row.nameTour,
        time: row.booktour.startDate,
        type: row.booktour.status
      } })
      console.log(booktour)
      setData(booktour)
      
    });
  }, []);
  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
      style={{ height: "17%", overflowY: "scroll" }}
    >
      <CardHeader title="Book Tour Timeline" />
      <CardContent>
        <Timeline>
          {data && data.map((item, index) => (
            <OrderItem key={item.title} item={item} isLast={index === data.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
