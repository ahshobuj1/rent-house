import {createBrowserRouter} from 'react-router-dom';
import Main from '../layouts/Main';
import Home from '../pages/Home/Home';
import ErrorPage from '../pages/ErrorPage';
import Login from '../pages/Login/Login';
import SignUp from '../pages/SignUp/SignUp';
import RoomDetails from '../pages/RoomDetails/RoomDetails';
import Dashboard from '../layouts/Dashboard';

import MyListings from '../pages/Dashboard/Host/MyListings';
import Statistics from '../pages/Dashboard/Common/Statistics';
import AddRoom from '../pages/Dashboard/Host/AddRoom';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import Profile from '../pages/Dashboard/Common/Profile';
import ManageBookings from '../pages/Dashboard/Host/ManageBookings';
import MyBookings from '../pages/Dashboard/Guest/MyBookings';
import AdminRoute from './AdminRoute';
import HostRoute from './HostRoute';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: <RoomDetails />,
      },
    ],
  },
  {path: '/login', element: <Login />},
  {path: '/signup', element: <SignUp />},

  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Statistics />,
      },
      {
        path: 'add-room',
        element: (
          <HostRoute>
            <AddRoom />
          </HostRoute>
        ),
      },
      {
        path: 'my-listings',
        element: (
          <HostRoute>
            <MyListings />
          </HostRoute>
        ),
      },
      {
        path: 'manage-users',
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'manage-bookings',
        element: (
          <HostRoute>
            <ManageBookings />
          </HostRoute>
        ),
      },
      {
        path: 'my-bookings',
        element: <MyBookings />,
      },
    ],
  },
]);
