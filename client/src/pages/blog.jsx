// import Blog from "../components/blog.component";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import AnimationWrapper from "../common/animation";
import Loader from "../components/loader";
import PageNotFound from "./NotFound";
import { blogStructure } from "./editor";
import { getDay } from "../common/date";
import BlogInteraction from "../components/bloginteraction";
import BlogPostCard from "../components/blogpostcard";

export const BlogPageContext = createContext({});

const BlogPage = () => {
    let { blog_id } = useParams(); 

    const [ blog, setBlog ] = useState(blogStructure);
    const [ loading, setLoading ] = useState(true); 
    const [ similarBlogs, setSimilarBlogs ] = useState(null);

    let { title, content, banner, author: { personal_info: { username: author_username, fullname, profile_img } }, publishedAt } = blog;

    useEffect(() => {

        resetPage();

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
        .then( async ({ data: { blog } }) => {

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: blog.tags[0], limit: 6, eliminate_blog: blog_id })
            .then(({ data }) => {
                setSimilarBlogs(data.blogs);
            })

            setBlog(blog);
            setLoading(false);

        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });

    }, [blog_id]);

    const  resetPage = () => {
        setBlog(blogStructure);
        setLoading(true);
        setSimilarBlogs(null);
    }

    return (
        <AnimationWrapper> 
            {
                loading ? 
                <Loader />
                : title.length ? 
                
                <BlogPageContext.Provider value={{ blog, setBlog }}>

                  

                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">

                        <img src={banner} className="aspect-video" />


                        <div className="mt-12">
                            <h2>{title}</h2>

                            <div className="flex max-sm:flex-col justify-between my-8">
                                <div className="flex gap-5 items-start">
                                    <img src={profile_img} className="w-12 h-12 rounded-full" />
                                    <p className="capitalize">
                                        {fullname}
                                        <br />
                                        @
                                        <Link to={`/user/${author_username}`} className="underline">
                                            {author_username}
                                        </Link>
                                    </p>
                                </div>
                                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
                            </div>
                        </div>

                        <BlogInteraction />

                        {
                            similarBlogs != null && similarBlogs.length ? 
                                <>
                                    <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                                    {
                                        similarBlogs.map((blog, i) => {

                                            let { author: { personal_info: { username: profile_username, fullname, profile_img } } } = blog;

                                            return <AnimationWrapper key={i} transition={{ delay: i * 0.08 }} >
                                                        <BlogPostCard content={blog} author={{ profile_username, fullname, profile_img }} />
                                                    </AnimationWrapper>
                                        })
                                    }
                                </>
                            : ""
                        }

                    </div>
                </BlogPageContext.Provider>

                : <PageNotFound />
            }
        </AnimationWrapper>
    );
};

export default BlogPage;