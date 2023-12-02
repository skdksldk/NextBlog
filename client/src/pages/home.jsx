import { useEffect, useState } from "react";
import AnimationWrapper from "../common/animation";
import InPageNavigation, { activeTabRef } from "../components/inpagenavigation";
import axios from "axios";
import Loader from "../components/loader";
import BlogPostCard from "../components/blogpostcard";
import MinimalBlogPostCard from "../components/minimalblogpostcard";
import NoDataMessage from "../components/nodata";
import { filterPaginationData } from "../common/filterpagination";
import LoadMoreDataBtn from "../components/loadmore";

const HomePage = () => {

    const [ blogs, setBlogs ] = useState(null);
    const [ trendingBlogs, setTrendingBlog ] = useState(null);
    const [ pageState, setPageState ] = useState("home");

    let categories = ["programming", "hollywood", "film making", "social media", "cooking", "technology", "finances", "travel"];
   
    const fetchLatestBlogs = ({ page = 1 }) => {
        // latest blogs
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
        .then(async ({ data }) => {

            let formatedData = await filterPaginationData({
                arr: blogs, 
                data: data.blogs,
                page,
                countRoute: "/all-latest-blogs-count"
            })

            setBlogs(formatedData)

        })
        .catch(err => {
            console.log(err)
        })
    }

    const fetchBlogByCategory = ({ page = 1 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState, page })
        .then(async ({ data }) => {

            let formatedData = await filterPaginationData({
                arr: blogs, 
                data: data.blogs, 
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { tag: pageState }
            })

            setBlogs(formatedData)

        })
        .catch(err => {
            console.log(err)
        })
    }

    const fetchTrendingBlogs = () => {
        // latest blogs
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
        .then(({ data }) => {
           setTrendingBlog(data.blogs);
        })
        .catch(err => {
            console.log(err)
        })
    }

    const loadBlogbyCategory = (e) => {

        let category = e.target.innerText.toLowerCase();

        setBlogs(null);

        if(pageState === category){
            setPageState('home');
            return;
        }

        setPageState(category)
    }


    useEffect(() => {

        activeTabRef.current.click();

        if(pageState === "home"){
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogByCategory(pageState)
        }

        if(!trendingBlogs){
            fetchTrendingBlogs();
        }
    }, [pageState])


    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blogs */}
                <div className="w-full">
                    <InPageNavigation 
                       routes={ [ pageState, "Trending Blogs"] } 
                       defaultHidden={["Trending Blogs"]}
                    >
                    
                        <>
                            {   
                                blogs == null ? (
                                 <Loader /> 
                                ) : ( 
                                blogs.results.length ?    
                                    blogs.results.map((blog, i) => {
                                        return ( 
                                          <AnimationWrapper 
                                            transition={{ 
                                                duration: 1, delay: i * 0.08 
                                            }}
                                            key={i}  
                                          >
                                            <BlogPostCard 
                                              content={blog} 
                                              author={
                                                blog.author.personal_info
                                              } 
                                            />
                                            </AnimationWrapper>
                                        );
                                })  
                                : <NoDataMessage message="No blogs published" />      
                            )}
                             <LoadMoreDataBtn dataArr={blogs} fetchDataFunc={pageState == 'home' ? fetchLatestBlogs : fetchBlogByCategory} />
                        </>
                          
                    </InPageNavigation>
                </div>

              <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>

                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, i) => {
                                        return <button key={i} onClick={loadBlogbyCategory} className={"tag " + (pageState === category ? "bg-black text-white" : "")} >{category}</button>
                                    })
                                }
                            </div>
                        </div>

                <div>
                    <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>
                    {   
                                trendingBlogs == null ? (
                                 <Loader /> 
                                ) : ( 
                                trendingBlogs.length ?    
                                    trendingBlogs.map((blog, i) => {
                                        return ( 
                                          <AnimationWrapper 
                                            transition={{ 
                                                duration: 1, delay: i * 0.08 
                                            }}
                                            key={i}  
                                          >
                                           <MinimalBlogPostCard 
                                             blog={blog} 
                                             index={i} 
                                            />
                                          </AnimationWrapper>
                                        );
                                })  
                                : <NoDataMessage message="No blogs published" />      
                            )}
                </div>
               </div>
             </div>
            </section>
        </AnimationWrapper> 
    )
}

export default HomePage;