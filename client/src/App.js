import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Router>
        <Route path="/" render={(props) => <Home {...props} />} />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
