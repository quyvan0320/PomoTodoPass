import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { ToastProvider } from "./components/toast";

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
