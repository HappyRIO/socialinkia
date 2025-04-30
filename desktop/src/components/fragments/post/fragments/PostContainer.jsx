import React, { useMemo } from "react"; // Import React and useMemo
import {
  Facebook,
  Image,
  Instagram,
  ReplaceAll,
  Settings,
  // X, // Not used in the icon logic, using xcom.svg instead
  Video,
  CassetteTape,
  CircleOff,
} from "lucide-react";
import { Link } from "react-router-dom";

// Wrap the component definition with React.memo
const PostContainer = React.memo(({ data }) => {
  console.log(
    `Rendering PostContainer for ID: ${data?._id?.$oid || data?._id}`
  ); // Debug log

  // --- Early exit or placeholder for invalid data ---
  // Improves robustness if data structure is sometimes incomplete
  if (
    !data ||
    typeof data !== "object" ||
    !data._id ||
    !data.platform 
  ) {
    console.warn("PostContainer received incomplete data:", data);
    return (
      <div className="w-full p-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
        Error: Incomplete post data provided.
      </div>
    );
  }

  // --- Derived Values (using useMemo for clarity and potential optimization) ---

  const { fbook, insta, xcom } = useMemo(
    () => data.platform || {},
    [data.platform]
  );

  const platformCount = useMemo(() => {
    return [fbook, insta, xcom].filter(Boolean).length;
  }, [fbook, insta, xcom]);

  // Determine the text to display based on status and data.text
  const displayText = useMemo(() => {
    if (data.status === "failed") {
      return "Connection issue or post failed. Please check account connection or edit the post."; // More concise message
    }
    return data.text || " "; // Return text or a space to prevent layout collapse if empty
  }, [data.status, data.text]);

  // Determine text color based on status
  const textColor = useMemo(() => {
    switch (data.status) {
      case "failed":
        return "text-red-500";
      case "published":
        return "text-green-600"; // Slightly darker green for better contrast
      case "scheduled":
        return "text-blue-600"; // Example: color for scheduled
      default:
        return "text-gray-800"; // Default text color
    }
  }, [data.status]);

  // Determine if the settings/edit button should be enabled
  const isButtonEnabled = useMemo(() => {
    // Typically you can always edit, unless maybe it's currently processing? Adjust as needed.
    return (
      data.status === "scheduled" ||
      data.status === "failed" ||
      data.status === "draft" ||
      data.status === "published"
    );
  }, [data.status]);

  // Determine the correct link destination based on status
  const linkDestination = useMemo(
    () =>
      data.status === "published"
        ? `/dashboard/analize/${data._id?.$oid || data._id}`
        : `/dashboard/posts/edit/${data._id?.$oid || data._id}`,
    [data.status, data._id]
  );

  // Memoize formatted date/time to avoid recalculating new Date() on every render
  const { formattedDate, formattedTime } = useMemo(() => {
    try {
      const dateObj = new Date(data.uploadDate);
      // Check if the date is valid
      // if (isNaN(dateObj.getTime())) {
      //   throw new Error("Invalid date value");
      // }
      return {
        formattedDate: dateObj.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }), // Example format
        formattedTime: dateObj.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }), // Example format
      };
    } catch (e) {
      console.error("Error formatting date:", data.uploadDate, e);
      return { formattedDate: "Invalid Date", formattedTime: "" };
    }
  }, [data.uploadDate]);

  const postId = useMemo(() => data._id, [data._id]);

  // --- Render Logic (Single Structure) ---
  return (
    // Use the determined link destination. Clicks on the button inside will also trigger this Link.
    <Link
      className="w-full block" // Use block for proper Link behavior
      to={linkDestination}
      aria-label={`View details for post scheduled on ${formattedDate}`} // Accessibility
    >
      <div className="post-lister w-full gap-2 flex text-sm flex-col md:flex-row justify-start items-stretch bg-background p-2 rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-150">
        {" "}
        {/* Added border, hover */}
        {/* --- Left Section (Icons & Date) --- */}
        <div className="small-content gap-2 flex flex-row items-center">
          {" "}
          {/* Increased gap */}
          {/* Platform Icon */}
          <div className="content-platform bg-background2 p-2 aspect-square w-[50px] h-[50px] flex justify-center items-center overflow-hidden rounded-lg shrink-0">
            {" "}
            {/* Ensure fixed size */}
            {platformCount > 1 ? (
              <ReplaceAll size={24} aria-label="Multiple platforms" />
            ) : fbook ? (
              <Facebook size={24} aria-label="Facebook" />
            ) : insta ? (
              <Instagram size={24} aria-label="Instagram" />
            ) : xcom ? (
              <img className="w-6 h-6" src="/icons/xcom.svg" alt="X Platform" />
            ) : (
              <CircleOff size={24} aria-label="No platform" /> // Fallback
            )}
          </div>
          {/* Media Type Icon */}
          <div className="content-type bg-background2 p-2 aspect-square w-[50px] h-[50px] flex justify-center items-center overflow-hidden rounded-lg shrink-0">
            {data.images?.length > 0 && data.videos?.length > 0 ? (
              <CassetteTape size={24} aria-label="Image and Video" />
            ) : data.images?.length > 0 ? (
              <Image size={24} aria-label="Image" />
            ) : data.videos?.length > 0 ? (
              <Video size={24} aria-label="Video" />
            ) : (
              <CircleOff size={24} aria-label="No media" />
            )}
          </div>
          {/* Media Preview */}
          <div className="content-preview bg-gray-200 aspect-square w-[50px] h-[50px] overflow-hidden rounded-lg shrink-0 flex justify-center items-center">
            {" "}
            {/* Added bg */}
            {data.videos?.[0] ? (
              <video
                className="object-cover object-center w-full h-full"
                muted
                playsInline
                preload="metadata" // Common preview attributes
                key={data.videos[0]} // Add key if src can change
              >
                <source src={data.videos[0]} type="video/mp4" />
              </video>
            ) : data.images?.[0] ? (
              <img
                className="object-cover object-center w-full h-full"
                src={data.images[0]}
                alt="" // Decorative alt
                loading="lazy"
                key={data.images[0]} // Add key if src can change
              />
            ) : (
              <span className="text-xs text-gray-500">N/A</span> // Text placeholder
            )}
          </div>
          {/* Release Date */}
          <div className="content-release-date text-center flex flex-col justify-center items-center px-2 py-1 bg-background2 rounded-lg text-xs min-w-[90px] shrink-0">
            {" "}
            {/* Ensure minimum width */}
            <p className="font-medium">{formattedDate}</p>
            <p className="text-gray-600">{formattedTime}</p>
          </div>
        </div>{" "}
        {/* End small-content */}
        {/* --- Center Section (Post Text) --- */}
        <div className="content-title w-full px-2 py-1 bg-background2 rounded-lg flex items-center min-w-0 grow">
          {" "}
          {/* Added grow */}
          <p className={`line-clamp-3 ${textColor} text-sm break-words w-full`}>
            {" "}
            {/* Allow clamping */}
            {displayText}
          </p>
        </div>
        {/* --- Right Section (Settings Button) --- */}
        {/* This button click will navigate via the parent Link. We stop propagation if disabled */}
        <div className="pending-post-settings p-1 flex justify-center items-center rounded-lg bg-background2 shrink-0">
          <button
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              !isButtonEnabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={!isButtonEnabled}
            onClick={(e) => {
              // Prevent the Link navigation ONLY if the button is truly disabled
              if (!isButtonEnabled) {
                e.preventDefault(); // Stop the Link navigation
                e.stopPropagation(); // Stop event bubbling further
              }
              // Button's primary action is handled by the parent Link navigation
              // If you needed other actions *specific* to the button click, add them here.
            }}
            aria-label={
              data.status === "published" ? "View Analytics" : "Edit Post"
            } // Dynamic Aria Label
          >
            <Settings size={20} />
          </button>
        </div>
      </div>{" "}
      {/* End post-lister */}
    </Link>
  );
}); // End React.memo

// Set display name for DevTools
PostContainer.displayName = "PostContainer";

export default PostContainer;
