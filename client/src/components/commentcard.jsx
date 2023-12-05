/* eslint-disable react/prop-types */
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import CommentField from "./commentfield";
import { BlogPageContext } from "../pages/blog";
import axios from "axios";

const CommentCard = ({ index, commentData, leftVal = 0 }) => {

    let { comment, commented_by: { personal_info: { fullname, username: profile_username , profile_img } }, commentedAt, children, _id } = commentData;

    let { userAuth: { username, access_token } } = useContext(UserContext);

    let { blog, blog: { comments, comments: { results: commentsArr }, activity, activity: { total_parent_comments }, author: { personal_info: { username: blog_author } } }, setBlog, setTotalParentCommentsLoaded} = useContext(BlogPageContext);
    
    const [ isReplying, setReplying ] = useState(false);

    
    const loadReplies = ({ currentIndex = index, skip = 0 }) => {
        if ( commentsArr[currentIndex].children.length ) {
            
            hideReplies();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id: commentsArr[currentIndex]._id, skip })
            .then(( { data: { replies } }) => {

                commentsArr[currentIndex].isRepliesLoaded = true;

                for ( let i = 0; i < replies.length; i++ ){

                    replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel ? commentsArr[currentIndex].childrenLevel + 1 : 1;
                    
                    commentsArr.splice(currentIndex + i + 1 + skip, 0, replies[i])
                    
                }
                setBlog({ ...blog, comments: { ...comments, results : commentsArr } })

            })
            .catch(err => {
                console.log(err)
            })
        }

    }
    
    const handleReplyClick = () => {
        if(!access_token){
            return toast.error("login first to leave a reply")
        }

        setReplying(preVal => !preVal);
    }

    const removeCommentCards = async (startingIndex, isDelete = false) => {

        if ( commentsArr[startingIndex] ) { // for delete

            while( commentsArr[startingIndex].childrenLevel > commentsArr[index].childrenLevel ) {
                commentsArr.splice(startingIndex, 1);

                if(!commentsArr[startingIndex]){
                    break;
                }
            } 

        }

        if(isDelete) {

            let parentIndex = getParentIndex();
            
            if(parentIndex != undefined){
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)
                if(!commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isRepliesLoaded = false;
                }
            }

            commentsArr.splice(index, 1);
        }       

        if(commentData.childrenLevel == 0 && isDelete){
            setTotalParentCommentsLoaded(preVal => preVal - 1)
        }

        setBlog({ ...blog, comments: { results: commentsArr }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0) } })

    }

    const hideReplies = () => {

        commentsArr[index].isRepliesLoaded = false;

        removeCommentCards(index + 1);

    }

    
    return (
        
        <div className="w-full" style={{ paddingLeft : `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{profile_username}</p>
                    <p className=" min-w-fit">{getDay(commentedAt)}</p>
                </div>
                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">

                    {
                        !commentsArr[index].isRepliesLoaded ?

                        <button onClick={loadReplies} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"><i className="fi fi-rr-comment mt-1"></i> {children.length} Reply </button>
                        :
                        <button onClick={hideReplies} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"><i className="fi fi-rr-comment mt-1"></i> Hide Reply </button>
                    }
                    
                    
                   <button className="underline" onClick={handleReplyClick} >Reply</button>
                </div>
                { 
                    isReplying ? 
                    <div className="mt-8">
                        <CommentField action="Reply" index={index} replyingTo={_id} setReplying={setReplying} />
                    </div>
                    : "" 
                }
            </div>
        </div>

    )
}

export default CommentCard;