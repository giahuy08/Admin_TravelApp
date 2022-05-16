import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import Tour from './pages/Tour';
import BookTour from './pages/BookTour';

import NotFound from './pages/Page404';
import Discount from './pages/Discount';
import Vehicle from './pages/Vehicle';
import Enterprise from './pages/Enterprise';
import HotelRoom from './pages/HotelRoom';
import RestaurantTable from './pages/RestaurantTable';
import Chat from './pages/Chat';
import Evaluate from './pages/Evaluate';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'tour', element: < Tour/>},
        { path: 'tour/:idTour', element: < Evaluate/>},
        { path: 'booktour', element: < BookTour/>},
        { path: 'discount', element: < Discount/>},
        { path: 'vehicle', element: < Vehicle/>},
        { path: 'enterprise', element: < Enterprise/>},
        { path: 'room', element: < HotelRoom/>},
        { path: 'table', element: < RestaurantTable/>},
        { path: 'chat', element: < Chat/>},

      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
