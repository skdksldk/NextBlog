import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import UserAuth from "./pages/userAuth";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor";
import HomePage from "./pages/home";
import SearchPage from "./pages/search";

export const UserContext = createContext([])

const App = () => {

    const [userAuth, setUserAuth] = useState([]);

    useEffect(() => {

      let userInSession = lookInSession("user");

      userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth
      ({ access_token: null })

    }, [])

    return (
      <UserContext.Provider value={{userAuth , setUserAuth}}>
       <Routes>
        <Route path="/editor" element={<Editor />} /> 
        <Route path="/" element={<Navbar />}>
          <Route index  element={<HomePage />} />
          <Route path="signin" element={<UserAuth type="sign_in" />} />
          <Route path="signup" element={<UserAuth type="sign_up" />} />
          <Route path="search/:query" element={<SearchPage />} />
        </Route>
       </Routes>
      </UserContext.Provider>
    )
}

export default App;