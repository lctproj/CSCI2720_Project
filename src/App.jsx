import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import VenueDetail from './components/VenueDetail';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venue/:venueId" element={<VenueDetail />} />
      </Routes>
    </>
  );
};
 
export default App;