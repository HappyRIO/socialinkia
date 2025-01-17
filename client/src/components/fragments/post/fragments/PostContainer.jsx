import {
  Facebook,
  Image,
  Instagram,
  ReplaceAll,
  Settings,
  X,
  Video,
  CassetteTape,
  CircleOff
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function PostContainer({ data }) {
  const { fbook, insta, gmb } = data?.platform || {};
  const [postContent, setPostContent] = useState(data?.text || "");

  const textColor =
    data?.status === "failed"
      ? setPostContent(
          "Please kindly reconnect your social media account. If this continues, report to us."
        )
      : data?.status === "published"
      ? "text-green-500"
      : "text-black";

  const platformCount = [fbook, insta, gmb].filter(Boolean).length;
  const isButtonEnabled =
    data?.status === "scheduled" ||
    data?.status === "failed" ||
    data?.status === "draft";

  return (
    <>
      {data?.status === "published" ? (
        <Link className="w-full" to={`/dashboard/analize/${data._id}`}>
          <div className="post-lister  w-full gap-1 flex text-sm flex-col md:flex-row justify-center bg-background p-2 rounded-lg">
            <div className="small-content gap-1 flex flex-row">
              {/* Platform Icon */}
              <div className="content-platform bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
                {platformCount > 1 ? (
                  <ReplaceAll />
                ) : (
                  <>
                    {fbook && <Facebook />}
                    {insta && <Instagram />}
                    {gmb && <Store />}
                  </>
                )}
              </div>

              {/* Image Icon */}
              <div className="content-type bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
                {data.images.length > 0 && data.videos.length > 0 ? (
                  <CassetteTape />
                ) : data.images.length > 0 ? (
                  <Image />
                ) : data.videos.length > 0 ? (
                  <Video />
                ) : (
                  <CircleOff />
                )}
              </div>

              {/* Image Preview */}
              <div className="content-preview bg-background2 aspect-square w-[50px] overflow-hidden rounded-lg">
                {data.videos.length > data.images.length ? (
                  <video
                    className="object-cover object-center w-full h-full rounded-lg"
                    controls
                  >
                    <source src={data.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="object-cover object-center w-full h-full rounded-lg"
                    src={
                      data.images.length > 0
                        ? data.images[0]
                        : "https://placehold.co/600x400?text=No+Media"
                    }
                    alt={
                      data.images.length > 0
                        ? "Post image"
                        : "No image available"
                    }
                  />
                )}
              </div>

              {/* Release Date */}
              <div className="content-release-date text-center flex flex-col justify-center items-center px-1 bg-background2 rounded-lg">
                <p>{new Date(data.uploadDate).toLocaleDateString()}</p>
                <p>{new Date(data.uploadDate).toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Post Text with Conditional Color */}
            <div
              className={`content-title w-full px-1 bg-background2 rounded-lg`}
            >
              <p className={`line-clamp-2 ${textColor}`}>{postContent}</p>
            </div>

            {/* Settings Icon */}
            <div className="pending-post-settings p-1 cursor-pointer flex justify-center items-center rounded-lg bg-background2">
              <Link
                className="w-full h-full cursor-pointer flex justify-center items-center"
                to={`/dashboard/posts/edit/${data._id}`}
              >
                <button
                  className="w-full cursor-pointer h-full flex justify-center items-center"
                  disabled={!isButtonEnabled}
                >
                  <Settings />
                </button>
              </Link>
            </div>
          </div>
        </Link>
      ) : (
        <Link className="w-full" to={`/dashboard/posts/edit/${data._id}`}>
          <div className="post-lister  w-full gap-1 flex text-sm flex-col md:flex-row justify-center bg-background p-2 rounded-lg">
            <div className="small-content gap-1 flex flex-row">
              {/* Platform Icon */}
              <div className="content-platform bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
                {platformCount > 1 ? (
                  <ReplaceAll />
                ) : (
                  <>
                    {fbook && <Facebook />}
                    {insta && <Instagram />}
                    {gmb && <X />}
                  </>
                )}
              </div>

              {/* Image Icon */}
              <div className="content-type bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
                {data.images.length > 0 && data.videos.length > 0 ? (
                  <CassetteTape />
                ) : data.images.length > 0 ? (
                  <Image />
                ) : data.videos.length > 0 ? (
                  <Video />
                ) : (
                  <CircleOff />
                )}
              </div>

              {/* Image Preview */}
              <div className="content-preview bg-background2 aspect-square w-[50px] overflow-hidden rounded-lg">
                {data.videos.length > data.images.length ? (
                  <video
                    className="object-cover object-center w-full h-full rounded-lg"
                    controls
                  >
                    <source src={data.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="object-cover object-center w-full h-full rounded-lg"
                    src={
                      data.images.length > 0
                        ? data.images[0]
                        : "https://placehold.co/600x400?text=No+Media"
                    }
                    alt={
                      data.images.length > 0
                        ? "Post image"
                        : "No image available"
                    }
                  />
                )}
              </div>

              {/* Release Date */}
              <div className="content-release-date text-center flex flex-col justify-center items-center px-1 bg-background2 rounded-lg">
                <p>{new Date(data.uploadDate).toLocaleDateString()}</p>
                <p>{new Date(data.uploadDate).toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Post Text with Conditional Color */}
            <div
              className={`content-title w-full px-1 bg-background2 rounded-lg`}
            >
              <p className={`line-clamp-2 ${textColor}`}>{postContent}</p>
            </div>

            {/* Settings Icon */}
            <div className="pending-post-settings p-1 cursor-pointer flex justify-center items-center rounded-lg bg-background2">
              <Link
                className="w-full h-full cursor-pointer flex justify-center items-center"
                to={`/dashboard/posts/edit/${data._id}`}
              >
                <button
                  className="w-full cursor-pointer h-full flex justify-center items-center"
                  disabled={!isButtonEnabled}
                >
                  <Settings />
                </button>
              </Link>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
