import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import trademark from '@iconify/icons-ant-design/trademark'
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'User',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Tour',
    path: '/dashboard/tour',
    icon: getIcon(trademark)
  },
  {
    title: 'Book Tour',
    path: '/dashboard/booktour',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'Discount',
    path: '/dashboard/discount',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Vehicle',
    path: '/dashboard/vehicle',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Enterprise',
    path: '/dashboard/enterprise',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Room',
    path: '/dashboard/room',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'Table',
    path: '/dashboard/table',
    icon: getIcon(fileTextFill)
  },
 
];

export default sidebarConfig;
