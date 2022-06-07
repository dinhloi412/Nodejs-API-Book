import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
function App() {
  return (
    <div className="">
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/products" element={<Home />}></Route>
      </Routes>
    </div>
  );
}

export default App;
