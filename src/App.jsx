import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import VenueDetail from './components/VenueDetail';
import EventDetail from './components/EventDetail';
import CreateAccount from './components/CreateAccount';
import SignIn from './components/SignIn';
import AccountInfo from './components/AccountInfo';
import ChangePassword from './components/ChangePassword';
import AdminHome from './components/UserList';
import AdminEvent from './components/AdminEvent';
import UserList from './components/UserList';
import AdminUser from './components/AdminUser';
import CreateEvent from './components/CreateEvent';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue/:venueId" element={<VenueDetail />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/info" element={<AccountInfo />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/event/:eventId" element={<AdminEvent />} />
        <Route path="/admin/users/" element={<UserList />} />
        <Route path="/admin/user/" element={<AdminUser />} />
        <Route path="/admin/createevent" element={<CreateEvent />} />
      </Routes>
    </>
  );
};
 
export default App;