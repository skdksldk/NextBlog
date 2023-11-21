import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import UserAuth from "./pages/userAuth";

const App = () => {

    return (
       <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuth type="Sign in page" />} />
          <Route path="signup" element={<UserAuth type="Sign up page" />} />
        </Route>
       </Routes>
    )
}

export default App;