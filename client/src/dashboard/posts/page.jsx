import { Facebook, GalleryHorizontal, Instagram, Store } from "lucide-react";
import AllPosts from "../../components/fragments/post/AllPosts";
import FacebookPosts from "../../components/fragments/post/FacebookPosts";
import GoogleMyBusinessPost from "../../components/fragments/post/GoogleMyBusinessPost";
import InstagramPost from "../../components/fragments/post/InstagramPost";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useState } from "react";

export default function Pending() {
  const [showall, setShowall] = useState(true);
  const [showfbook, setShowfbook] = useState(false);
  const [showinsta, setShowinsta] = useState(false);
  const [showxcom, setshowxcom] = useState(false);

  function handleshowall() {
    setShowall(true);
    setShowfbook(false);
    setShowinsta(false);
    setshowxcom(false);
  }
  function handleshowinsta() {
    setShowall(false);
    setShowfbook(false);
    setShowinsta(true);
    setshowxcom(false);
  }
  function handleshowfbook() {
    setShowall(false);
    setShowfbook(true);
    setShowinsta(false);
    setshowxcom(false);
  }
  function handleshowxcom() {
    setShowall(false);
    setShowfbook(false);
    setShowinsta(false);
    setshowxcom(true);
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Pending post"} />
      </div>
      <div className="contentzone flex flex-col gap-3 pt-3 px-2 ml-0 sm:ml-64 w-full">
        <div className="postsellectors bg-background2 p-2 rounded-lg gap-3 flex flex-col justify-center items-center text-sm w-full">
          <div className="media-selecto flex flex-row w-full justify-evenly pt-5">
            <div
              onClick={handleshowall}
              className={`all-selector hover:bg-accent flex gap-2 flex-row justify-center items-center cursor-pointer text-center w-full ${
                showall
                  ? "border-[2px] border-accent border-b-[2px] border-b-background2"
                  : "border-b-[2px] border-b-accent"
              }`}
            >
              <GalleryHorizontal /> <span className="hidden sm:block">all</span>
            </div>
            <div
              onClick={handleshowfbook}
              className={`fbook-selector hover:bg-accent flex gap-2 flex-row justify-center items-center cursor-pointer text-center w-full ${
                showfbook
                  ? "border-[2px] border-accent border-b-[2px] border-b-background2"
                  : "border-b-[2px] border-b-accent"
              }`}
            >
              <Facebook /> <span className="hidden sm:block">facebbok</span>
            </div>
            <div
              onClick={handleshowinsta}
              className={`insta-selector hover:bg-accent flex gap-2 flex-row justify-center items-center cursor-pointer text-center w-full ${
                showinsta
                  ? "border-[2px] border-accent border-b-[2px] border-b-background2"
                  : "border-b-[2px] border-b-accent"
              }`}
            >
              <Instagram /> <span className="hidden sm:block">instagram</span>
            </div>
            <div
              onClick={handleshowxcom}
              className={`gmb-selector hover:bg-accent flex gap-2 flex-row justify-center items-center cursor-pointer text-center w-full ${
                showxcom
                  ? "border-[2px] border-accent border-b-[2px] border-b-background2"
                  : "border-b-[2px] border-b-accent"
              }`}
            >
              <Store /> <span className="hidden sm:block">google</span>
            </div>
          </div>
          <div className="postzone bg-background2 w-full">
            {showall && <AllPosts />}
            {showfbook && <FacebookPosts />}
            {showinsta && <InstagramPost />}
            {/* google my business servers as xcom */}
            {showxcom && <GoogleMyBusinessPost />}
          </div>
        </div>
      </div>
    </div>
  );
}
