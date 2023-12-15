import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import VenueDetail from './components/VenueDetail';
import EventDetail from './components/EventDetail';
import CreateAccount from './components/CreateAccount';
import SignIn from './components/SignIn';
import AccountInfo from './components/AccountInfo';
import ChangePassword from './components/ChangePassword';

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
      </Routes>
    </>
  );
};
 
export default App;