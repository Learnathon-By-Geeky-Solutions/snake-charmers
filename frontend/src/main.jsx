import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root/Root';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Home from './components/Home/Home';
import OverallSignup from './components/OverallSignup/OverallSignup';
import UserLogin from './components/UserLogin/UserLogin';
import RideRequest from './components/RideRequest/RideRequest';
import DriverSearch from './components/DriverSearch/DriverSearch';
import AvailableRide from './components/AvailableRide/AvailableRide';
import RiderReview from './components/RiderReview/RiderReview';
import TripConfirmed from './components/TripConfirmed/TripConfirmed';
import OngoingTrip from './components/OngoingTrip/OngoingTrip';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root> </Root>,
    errorElement: <ErrorPage />, 
    children: [
      {
         path: "/",
         element: <Home></Home>
      },
      {
        path: "/signup",
        element: <OverallSignup></OverallSignup>
      }, 
      {
        path: "/login",
        element: <UserLogin></UserLogin>
      },
      {
        path: '/ride_request',
        element: <RideRequest></RideRequest>
      },
      {
        path: '/driver_search',
        element: <DriverSearch></DriverSearch>
      }, 
      {
        path: '/available_ride',
        element: <AvailableRide></AvailableRide>
      }, 
      {
        path: '/rider_review',
        element: <RiderReview></RiderReview>
      }, 
      {
        path: '/ongoing_trip',
        element:<OngoingTrip></OngoingTrip>
      },
    ]

  },
]);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
