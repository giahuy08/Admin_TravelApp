import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import emailFill from '@iconify/icons-eva/email-fill'
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import trademark from '@iconify/icons-ant-design/trademark'
import pricetagsFill from '@iconify/icons-eva/pricetags-fill';
import globe2Fill from '@iconify/icons-eva/globe-2-fill';
import briefcaseFill from '@iconify/icons-eva/briefcase-fill';
import carFill from '@iconify/icons-eva/car-fill';
import homeFill from '@iconify/icons-eva/home-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Thống kê',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Người dùng',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Tour',
    path: '/dashboard/tour',
    icon: getIcon(globe2Fill)
  },
  {
    title: 'Các Tour đã đặt',
    path: '/dashboard/booktour',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'Mã giảm giá',
    path: '/dashboard/discount',
    icon: getIcon(pricetagsFill)
  },
  {
    title: 'Phương tiện',
    path: '/dashboard/vehicle',
    icon: getIcon(carFill)
  },
  {
    title: 'Đối tác',
    path: '/dashboard/enterprise',
    icon: getIcon(briefcaseFill)
  },
  {
    title: 'Phòng ở',
    path: '/dashboard/room',
    icon: getIcon(homeFill)
  },
  {
    title: 'Bàn ăn',
    path: '/dashboard/table',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Tư vấn',
    path: '/dashboard/chat',
    icon: getIcon(emailFill)
  },
  
 
];

export default sidebarConfig;
