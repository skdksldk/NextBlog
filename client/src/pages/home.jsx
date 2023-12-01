import { useEffect, useState } from "react";
import AnimationWrapper from "../common/animation";
import InPageNavigation from "../components/inpagenavigation";
import axios from "axios";
import Loader from "../components/loader";

const HomePage = () => {

    const [ blogs, setBlogs ] = useState(null);
   
    const fetchLatestBlogs = () => {
        // latest blogs
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({ data }) => {
           setBlogs(data.blogs);
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchLatestBlogs();
    }, [])
 
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blogs */}
                <div className="w-full">
                    <InPageNavigation routes={ ["Home", "Trending Blogs"] } defaultHidden={["Trending Blogs"]}>
                       

                        <>
                            {   
                                blogs == null ? <Loader /> : 
                                        blogs.map((blog, i) => {
                                            return <h1 key={i}>{ blog. title }</h1> 
                                        })    
                            }
                          
                        </>
                       <h1>Trending Blogs Here</h1>
                    
                    </InPageNavigation>
                </div>
            </section>
        </AnimationWrapper> 
    )
}

export default HomePage;