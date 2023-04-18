import "normalize.css";
import "./index.css";
import { createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import guestUserData from "./guestUserData";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Habits from "./components/Habits";
import Habit from "./components/Habit";

export const UserContext = createContext(guestUserData);

function App() {
  return (
    <Router>
      <UserContext.Provider value={guestUserData}>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/habit/:habitId" element={<Habit />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
