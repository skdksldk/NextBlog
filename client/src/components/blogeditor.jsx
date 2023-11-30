import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/animation";
import defaultBanner from "../imgs/blog banner.png";
import { useRef } from "react";
import { uploadImage } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";

const BlogEditor = () => {

    let blogBannerRef = useRef();

    const handleBannerUpload = (e) => {
      let img = e.target.files[0];

      if(img){

        let loadingToast = toast.loading("Uploading...")

        uploadImage(img).then((url) => {
            if(url){
                
                toast.dismiss(loadingToast)
                toast.success("Uploaded");
                blogBannerRef.current.src = url
            }
        })
        .catch(err => {
            toast.dismiss(loadingToast);
            return toast.error(err);
        })
      }
    };

    const handleTitleKeyStroke = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = null;
        input.style.height = input.scrollHeight + "px";
    };


    return (
        <>
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    "New Blog" 
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" 
                    >
                        Publish
                    </button>

                    <button className="btn-light py-2"
                    >
                        Save Draft
                    </button>
                        
                </div>
            </nav>

            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">

                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label
                                htmlFor="uploadBanner"
                            >
                                <img
                                    className="z-20"
                                    ref={blogBannerRef}
                                    src={defaultBanner}
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            placeholder="Blog Title"
                            onKeyDown={handleTitleKeyStroke}
                            className="text-4xl font-medium placeholder:opacity-40 w-full h-20 outline-none resize-none mt-10 leading-tight"
                            onChange={handleTitleChange}
                        ></textarea>


                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
}

export default BlogEditor;