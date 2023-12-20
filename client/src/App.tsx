import "./global.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./lib/pages/Home";
import Login from "./lib/pages/Login";
import Signup from "./lib/pages/Signup";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./lib/redux/store";
import { useEffect } from "react";
import { updateUser } from "./lib/redux/authslice";
import { jwtDecode } from "jwt-decode";
import { ProtectedRoute } from "./components/ui/AuthRouter";

const App = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
