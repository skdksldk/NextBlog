import AnimationWrapper from "../common/animation";
import InputBox from "../components/input"
import google from "../imgs/google.png";
import { Link } from "react-router-dom";

const userAuth = ({ type }) => {
  return (
    <AnimationWrapper>
     <section className="h-cover flex items-center justify-center">
         <form className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
              {type == "Sign in page" ? "Welcome Back" : "Join Us Today"}
            </h1>

            {
                type != "Sign in page" ?
                <InputBox
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  icon="fi fi-sr-user"
                />
                :""
            }
                <InputBox
                  name="email"
                  type="email"
                  placeholder="Email"
                  icon="fi fi-sr-envelope"
                />

                <InputBox
                    name="password"
                    type="password"
                    placeholder="Password"
                    icon="fi fi-sr-key"
                />

                <button
                    className="btn-dark center mt-14"
                    type="submit"
                >
                    {type.replace("_", " ")}
                </button>

                <div className="relative w-full flex items-center gap-2  my-10 opacity-10 uppercase text-black font-blod">
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                    <hr className="w-1/2 border-black" />
                </div>

                <button
                    className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
                >
                    <img src={google} className="w-5" />
                    Continue with google
                </button>
                {
                    type == "Sign in page" ? 
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don’t have an account ? 
                        <Link
                            className="underline text-black text-xl ml-1"
                            to="/signup"
                        >
                            Join us today 
                        </Link>
                    </p> : 
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a member ?  
                        <Link
                            className="underline text-black text-xl ml-1"
                            to="/signin"
                        >
                            Sign in here
                        </Link>
                    </p>       
                }  
        </form>
     </section>
    </AnimationWrapper> 
  )
}

export default userAuth