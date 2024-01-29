import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loginpage from "./pages/Loginpage";
import Searchpage from "./pages/Searchpage";
import Faq from "./pages/Faq";
import History from "./pages/History";
import ManageUsers from "./pages/ManageUsers";

function App() {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Loginpage />}  />
              <Route path="/login" element={<Loginpage />}  />
              <Route path="/search" element={<Searchpage />}  />
              <Route path = "/faq" element = {<Faq />}/>
              <Route path = "/history" element = {<History />}/>
              <Route path = "/manage" element = {<ManageUsers />}/>
          </Routes>
      </Router>
  );
}

export default App;
