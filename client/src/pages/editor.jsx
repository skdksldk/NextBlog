import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blogeditor";
import PublishForm from "../components/publishform";

const Editor = () =>{

    const [ editorState, setEditorState ] = useState("editor");
    
    let { userAuth: { access_token } } = useContext(UserContext);
 
    return (
        access_token === null ? <Navigate to="/signin" /> :
            editorState == "editor" ? <BlogEditor/> : <PublishForm/> 
    )
}

export default Editor;