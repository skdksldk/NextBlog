import { useState } from "react";

const inputBox = ({ name, type, id, value, placeholder, icon }) => {
    
    const [ passwordVisible, setPasswordVisibility ] = useState(false);
    
    return (
      <div className="relative w-[100%] mb-4">
        <input
           name={name}
           type={type == "password" ? passwordVisible ? "text" : "password" : type}
           placeholder={placeholder}
           defaultValue={value}
           id={id}
           className="input-box"
        />

        <i className={"fi " + icon + " input-icon"}></i>

        {
            type == "password" ?
            <i className={`fi fi-sr-eye${ !passwordVisible ? "-crossed" : "" } input-icon left-[auto] right-4 cursor-pointer`} 
            onClick={() => setPasswordVisibility(currentVal => !currentVal)}>
            </i>
            : ""
        }
      </div>
    )
  }
  
  export default inputBox