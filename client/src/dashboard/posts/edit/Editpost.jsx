import { useState, useEffect } from "react";
import "../../../components/css/socialswich.css";
import { useNavigate, useParams } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/fragments/Loader";

export default function Editpost() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [platform, setplatform] = useState({
    all: true,
    xcom: true,
    insta: true,
    fbook: true,
  });
  const [uploadDate, setUploaddata] = useState({
    date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts/${postId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.post) {
          const { text, platform, uploadDate, images, videos } = data.post;
          setPostText(text);
          setplatform(platform);
          setUploaddata({ date: uploadDate });
          const previews = [
            ...(images || []).map((url) => ({ preview: url, type: "image" })),
            ...(videos || []).map((url) => ({ preview: url, type: "video" })),
          ];
          setFilePreviews(previews);
          setLoading(false);
        } else {
          alert("faild to load post details");
        }
      })
      .catch((error) => {
        console.error("Error fetching post details:", error);
      });
  }, [postId]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const isChecked = event.target.checked;

    setplatform((prevState) => {
      const updatedState = { ...prevState };

      // Update the corresponding platform state based on whether the checkbox is checked or unchecked
      if (selectedValue === "fbook") {
        updatedState.fbook = isChecked;
      } else if (selectedValue === "insta") {
        updatedState.insta = isChecked;
      } else if (selectedValue === "xcom") {
        updatedState.xcom = isChecked;
      }

      // Update "all" to be true if any platform is selected, false if none are selected
      updatedState.all =
        updatedState.fbook || updatedState.insta || updatedState.xcom;

      return updatedState;
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleDateChange = (e) => {
    setUploaddata({ ...uploadDate, date: e.target.value });
  };

  const handleImageRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("text", postText);
    formData.append("platform", JSON.stringify(platform));
    formData.append("uploadDate", uploadDate.date);

    filePreviews.forEach(({ preview, type }) => {
      if (type === "image") {
        formData.append("images", preview);
      } else {
        formData.append("videos", preview);
      }
    });

    selectedFiles.forEach((file) => {
      formData.append(
        file.type.startsWith("video") ? "videos" : "images",
        file
      );
    });

    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Post updated successfully") {
          navigate("/dashboard/posts");
          setLoading(false);
        } else {
          setLoading(false);
          alert("post update error, kindly check your internet connection");
        }
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };

  function handledeletepost() {
    setLoading(true);
    fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Post deleted successfully") {
          navigate("/dashboard/posts");
        } else {
          setLoading(false);
          alert("post update error, kindly check your internet connection");
        }
      });
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      {loading ? (
        <Loader />
      ) : (
        <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
          <div className="mininav w-full">
            <button
              onClick={handleBackClick}
              className="px-2 py-2 w-full bg-accent rounded-lg"
            >
              Back
            </button>
          </div>
          <div className="editorpage p-2 bg-background2 rounded-lg w-full flex flex-col gap-2 justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-full flex flex-col gap-1 justify-center items-center">
                <h1>select platform</h1>
              </div>
              <div className="w-full flex flex-row gap-10 justify-center items-center">
                <div className="fbook gap-2 relative flex flex-col justify-center items-center">
                  <Facebook />
                  <label className="social-switch" htmlFor="facebook">
                    <input
                      className="social-input"
                      onChange={handleChange}
                      type="checkbox"
                      name="platform"
                      value="fbook"
                      id="facebook"
                      checked={platform.fbook}
                    />
                    <span className="social-slider round"></span>
                  </label>
                </div>
                <div className="insta gap-2 relative flex flex-col justify-center items-center">
                  <Instagram />
                  <label className="social-switch" htmlFor="instagram">
                    <input
                      className="social-input"
                      onChange={handleChange}
                      type="checkbox"
                      name="platform"
                      value="insta"
                      id="instagram"
                      checked={platform.insta}
                    />
                    <span className="social-slider round"></span>
                  </label>
                </div>
                <div className="xcom gap-2 relative flex flex-col justify-center items-center">
                  <BsTwitterX />
                  <label className="social-switch" htmlFor="xcom">
                    <input
                      className="social-input"
                      onChange={handleChange}
                      type="checkbox"
                      name="platform"
                      value="xcom"
                      id="xcom"
                      checked={platform.xcom}
                    />
                    <span className="social-slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="postText border border-text w-full flex flex-col gap-2">
              <textarea
                className="w-full rounded-lg focus:border-accent p-2"
                name="postText"
                id="postText"
                placeholder="Write your post..."
                rows="7"
                value={postText}
                onChange={handleTextChange}
              />
            </div>
            <div className="postImages columns-2 gap-2 sm:gap-4">
              {filePreviews.map(({ preview, type }, index) => (
                <div key={index} className="relative w-full mb-2 sm:mb-4">
                  {type === "image" ? (
                    <img
                      className="w-full object-cover rounded-lg"
                      src={preview}
                      alt="Image Preview"
                    />
                  ) : (
                    <video
                      className="w-full object-cover rounded-lg"
                      src={preview}
                      controls
                    />
                  )}
                  <button
                    className="absolute top-1 right-1 text-red-500 hover:text-white font-bold"
                    onClick={() => handleImageRemove(index)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full">
              <div className="rounded-md w-full border border-accent p-4 shadow-md">
                <label
                  htmlFor="upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 fill-white stroke-accent"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-center text-accent">Upload files</span>
                  <input
                    type="file"
                    name="files"
                    id="upload"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
              </div>
            </div>
            <div className="w-full py-10 flex flex-col md:flex-row gap-2 justify-center items-center">
              <div className="w-full flex flex-col gap-1 justify-center items-center cursor-pointer">
                <label htmlFor="schedule-date-input">Schedule Date</label>
                <input
                  id="schedule-date-input"
                  name="schedule-date-input"
                  type="datetime-local"
                  value={uploadDate.date}
                  onChange={handleDateChange}
                  className="bg-white text-black p-2 rounded-lg w-full cursor-pointer max-w-xs"
                />
              </div>
            </div>
            <div className="button-space w-full flex flex-col sm:flex-row gap-10 justify-center items-center">
              <button
                onClick={handleSubmit}
                className="bg-accent text-white hover:bg-background hover:text-text px-6 py-2 rounded-md w-full sm:w-1/3 mt-4"
              >
                Save Post
              </button>
              <button
                onClick={handledeletepost}
                className="animate-pulse flex flex-row justify-center items-center text-center hover:bg-background hover:text-text bg-red-800 text-white px-6 py-2 rounded-md w-fit mt-4"
              >
                <MdDelete />
                <span>delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
