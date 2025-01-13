import { useState } from "react";
import ResponsiveSidebar from "../../../components/navigation/ResponsiveSidebar";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../components/fragments/Loader";

export default function PostAnalysis() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"post analysis"} />
      </div>
      <div className="contentzone flex flex-col gap-3 pt-3 px-2 ml-0 sm:ml-64 w-full">
        <div className="mininav w-full">
          <button
            onClick={handleBackClick}
            className="px-2 py-2 w-full bg-accent rounded-lg"
          >
            Back
          </button>
        </div>
        <div className="w-full">
          <p>analysis for this post {postId}</p>
        </div>
      </div>
    </div>
  );
}
