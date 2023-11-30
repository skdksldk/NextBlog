import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blogeditor";
import PublishForm from "../components/publishform";
import { createContext } from "react";

export const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: { } }
}

export const EditorContext = createContext({});

const Editor = () =>{

    const [ blog, setBlog ] = useState(blogStructure);
    const [ editorState, setEditorState ] = useState("editor");
    const [ textEditor, setTextEditor] = useState({ isReady: false});
    
    let { userAuth: { access_token } } = useContext(UserContext);
 
    return (
        <EditorContext.Provider value={{ editorState, setEditorState, blog, setBlog, textEditor, setTextEditor }}>
        {
        access_token === null ? <Navigate to="/signin" /> :
            editorState == "editor" ? <BlogEditor /> : <PublishForm /> 
        }
        </EditorContext.Provider>
    )
}

export default Editor;