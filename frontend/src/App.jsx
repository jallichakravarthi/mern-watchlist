import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import WatchList from './pages/WatchList';
import EditWatchListItem from './pages/EditWatchListItem';
import ForgotResetPassword from './pages/ForgotResetPassword';  // ✅ Import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/edit/:id" element={<EditWatchListItem />} />
        <Route path="/forgot-reset-password" element={<ForgotResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
