import { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogPageContext } from "../pages/blog";
import { UserContext } from "../App";

const BlogInteraction = () => {

    let { blog, blog: { title, _id, blog_id, activity, activity: { total_likes, total_comments }, author : { personal_info: { username: aurthorUsername } } }, setBlog, likedByUser, setLikedByUser, setCommentWrapper } = useContext(BlogPageContext);
    
    let { userAuth: { username, access_token } } = useContext(UserContext);


    return (
        <>
            <hr className="border-grey my-2" />
            <div className="w-full p-1 px-5 flex items-center justify-between">

                <div className="flex gap-6">
                    <div className="flex gap-3 items-center">
                        <button 
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className= "fi fi-rr-heart"></i>
                        </button>
                        <p className="text-xl text-dark-grey">{total_likes}</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" onClick={() => setCommentWrapper(preVal => !preVal)}>
                        <i className="fi fi-rr-comment-dots text-xl mt-2"></i>
                        </button>
                        <p className="text-xl text-dark-grey">{total_comments}</p>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    { username == aurthorUsername ? 
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }

                    <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`} target="_blank" className="pt-2"><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
                </div>

            </div>
            <hr className="border-grey my-2" />
        </>
    )
}

export default BlogInteraction;