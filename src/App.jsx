import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import VenueDetail from './components/VenueDetail';
import EventDetail from './components/EventDetail';
import Account from './components/Account';
import AccountInfo from './components/AccountInfo';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue/:venueId" element={<VenueDetail />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/info" element={<AccountInfo />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
};
 
export default App;