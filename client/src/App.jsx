import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import UserAuth from "./pages/userAuth";

const App = () => {

    return (
       <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuth type="sign_in" />} />
          <Route path="signup" element={<UserAuth type="sign_up" />} />
        </Route>
       </Routes>
    )
}

export default App;