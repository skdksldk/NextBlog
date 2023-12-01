import { useContext, useState } from "react";
import { Link, Outlet, useNavigate  } from 'react-router-dom';
import logo from "../imgs/logo.png";
import { UserContext } from "../App";
import UserNavigationPanel from "./usernavigation";

const Navbar = () => {

  const [ searchBoxVisible, setSearchBoxVisible ] = useState(false)
  const [ userNavPanel, setUserNavPanel ] = useState(false)

  const { userAuth, userAuth: { access_token, profile_img, new_notifications_available }, setUserAuth } = useContext(UserContext);

  let navigate = useNavigate();
 
  const handleClick = () => {
    setUserNavPanel(currentVal => !currentVal);
  }

  const handleBlur = () => {
    setTimeout(() => {
        setUserNavPanel(false);  
  }, 200);
}

  const handleSearch = (e) => {
    let query = e.target.value;
    // console.log(e)
    if(e.keyCode == 13 && query.length){ // enter key
        navigate(`/search/${query}`)
    }
}

  const handleImageLoadError = (e) => {
    e.target.src = defaultUserProfileImg;
}

  return (
    <>
    <nav className="navbar">
       <Link to="/" className="flex-none w-10">
         <img src={logo} className="w-full" />
       </Link>

       <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey md:border-0 md:mt-0 py-4 px-[5vw] md:block md:relative md:inset-0 md:p-0 md:w-auto md:opacity-100 md:pointer-events-auto duration-200 " + (searchBoxVisible ? "show" : "hide")}>
            <input
              type="text"
              className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pl-12 md:pr-6 rounded-full placeholder:text-dark-grey"
              placeholder="Search"
              onKeyDown={handleSearch}
            />

            <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
       </div>

       <div className="flex items-center gap-3 md:gap-7 ml-auto">
            <button
              onClick={() => setSearchBoxVisible(currentVal => !currentVal)}
            >
              <i className="fi fi-rr-search md:hidden text-2xl bg-grey w-12 h-12 rounded-full flex items-center justify-center"></i>
            </button>
                    
            <Link
              to="/editor"
              className="hidden md:flex gap-2 link"
            >
                <i className="fi fi-rr-file-edit"></i>
                <p>Write</p>
            </Link>

       
        {
            access_token ? 
            <>
                <Link to="/dashboard/notifications">
                    <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                      <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                      {
                          userAuth ? new_notifications_available ? 
                          <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                          : "" : ""
                                    }
                    </button>
                </Link>

                <div className="relative" tabIndex={0} onClick={handleClick} onBlur={handleBlur}>
                    <button className="w-12 h-12 mt-1">
                        <img src={profile_img} onError={handleImageLoadError} className="w-full h-full object-cover rounded-full" />
                    </button>  
                                
                    { userNavPanel ? <UserNavigationPanel /> : "" }

                </div>
              </> : 
              <>
                  <Link className="btn-dark py-2" to="/signin">Sign In</Link>
                  <Link className="btn-light py-2 hidden md:block" to="/signup">Sign Up</Link>
              </>
        }
       </div>
    </nav>
    <Outlet />
    </>
  )
}

export default Navbar