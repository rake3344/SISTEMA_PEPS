import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
