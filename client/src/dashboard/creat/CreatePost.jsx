// CreateTemplate
import { useState } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { Facebook, Instagram, X } from "lucide-react";
import Loader from "../../components/fragments/Loader";

export default function PostCreation() {
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  // const [aitext, setAitext] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [generate, setgenerate] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]);
  const [platform, setPlatform] = useState({
    all: false,
    xcom: true,
    insta: true,
    fbook: true
  });

  const [uploaddata, setUploaddata] = useState({
    date: ""
  });

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const isChecked = event.target.checked;

    setPlatform((prevState) => {
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

  const handleTextChange = (e) => setPostText(e.target.value);
  // const handleAiTextChange = (e) => setAitext(e.target.value);
  const handleDateChange = (e) => setUploaddata({ date: e.target.value });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image"
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleImageRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("text", postText);
    formData.append("platform", JSON.stringify(platform));
    formData.append("uploadDate", uploaddata.date);

    selectedFiles.forEach((file) => {
      formData.append(
        file.type.startsWith("video") ? "videos" : "images",
        file
      );
    });
    fetch(`/api/posts/create`, {
      method: "POST",
      body: formData,
      credentials: "include"
    })
      .then(async (response) => {
        // Parse JSON and handle non-OK status codes
        const data = await response.json();

        if (!response.ok) {
          // Handle different HTTP error statuses
          const errorMessage =
            data.error || `Error ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        // Check if the message confirms success
        if (data.message === "Post created and scheduled") {
          // alert("posted");
          window.location.href = "/dashboard/posts";
          // toast.success("Post created successfully!", { theme: "dark" });
          setPostText("");
          setSelectedFiles([]);
          setFilePreviews([]);
          setUploaddata({ date: "" });
        } else {
          throw new Error(data.error || "Unexpected response from server.");
        }
      })
      .catch((error) => {
        // Show error message in toast and log for debugging
        console.error("Error creating post:", error);
      });
  };

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navzone w-fit">
        <ResponsiveSidebar pagename={"Create Post"} />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
          <div className="editorpage p-2 bg-background2 rounded-lg w-full flex flex-col gap-2">
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-full flex flex-col gap-1 justify-center items-center">
                <h1>select platform</h1>
              </div>
              <div className="w-full flex flex-row gap-3 justify-center items-center">
                <div className="fbook flex flex-col justify-center items-center">
                  <label htmlFor="facebook">
                    <Facebook />
                  </label>
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    name="platform"
                    value="fbook" // Set the value to "fbook"
                    id="facebook"
                    checked={platform.fbook} // Check if fbook is true
                  />
                </div>
                <div className="insta flex flex-col justify-center items-center">
                  <label htmlFor="instagram">
                    <Instagram />
                  </label>
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    name="platform"
                    value="insta" // Set the value to "insta"
                    id="instagram"
                    checked={platform.insta} // Check if insta is true
                  />
                </div>
                <div className="googl flex flex-col justify-center items-center">
                  <label htmlFor="google">
                    <X />
                  </label>
                  <input
                    onChange={handleChange}
                    type="checkbox"
                    name="platform"
                    value="xcom" // Set the value to "xcom"
                    id="google"
                    checked={platform.xcom} // Check if xcom is true
                  />
                </div>
              </div>
            </div>
            <div className="postText w-full flex flex-col gap-2">
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
            <div className="postImages columns-2 lg:columns-3 gap-2 sm:gap-4">
              {filePreviews.map(({ preview, type }, index) => (
                <div key={index} className="relative py-2">
                  {type === "image" ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="w-full object-cover rounded-lg"
                    />
                  )}
                  <button
                    className="absolute top-1 right-1 text-red-500 font-bold"
                    onClick={() => handleImageRemove(index)}
                  >
                    ✕
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
                  <span className="text-text font-medium">Upload files</span>
                </label>
                <input
                  id="upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            </div>
            <div className="w-full py-10 flex flex-col md:flex-row gap-2 justify-center items-center">
              <div className="w-full flex flex-col gap-1 justify-center items-center">
                <label>schedule date</label>
                <input
                  type="datetime-local"
                  value={uploaddata.date}
                  onChange={handleDateChange}
                  className="bg-background p-2 rounded-lg w-full"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Submit Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
