import { Facebook, GalleryHorizontal, Instagram } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import AllPosts from "../../components/fragments/post/AllPosts";
import FacebookPosts from "../../components/fragments/post/FacebookPosts";
import Xposts from "../../components/fragments/post/XPost";
import InstagramPosts from "../../components/fragments/post/InstagramPosts";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useEffect, useState } from "react";

export default function Pending() {
  const [allPostsData, setAllPostsData] = useState(null);
  const [facebookPostsData, setFacebookPostsData] = useState(null);
  const [instagramPostsData, setInstagramPostsData] = useState(null);
  const [xPostsData, setXPostsData] = useState(null);

  const [currentTab, setCurrentTab] = useState("all"); // "all", "fbook", "insta", "xcom"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, scheduledRes, publishedRes, failedRes] =
          await Promise.all([
            fetch(`/api/posts/all`, { method: "GET", credentials: "include" }),
            fetch(`/api/posts/scheduled`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`/api/posts/published`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(`/api/posts/failed`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

        const allData = await allRes.json();
        const scheduledData = await scheduledRes.json();
        const publishedData = await publishedRes.json();
        const failedData = await failedRes.json();

        const filterPosts = (posts, platform) =>
          Array.isArray(posts)
            ? posts.filter((post) => post.platform[platform])
            : [];

        setAllPostsData({
          all: allData?.posts || [],
          scheduled: scheduledData.posts || [],
          published: publishedData.posts || [],
          failed: failedData.posts || [],
        });

        setFacebookPostsData({
          all: filterPosts(allData?.posts, "fbook"),
          scheduled: filterPosts(scheduledData.posts, "fbook"),
          published: filterPosts(publishedData.posts, "fbook"),
          failed: filterPosts(failedData.posts, "fbook"),
        });

        setInstagramPostsData({
          all: filterPosts(allData?.posts, "insta"),
          scheduled: filterPosts(scheduledData.posts, "insta"),
          published: filterPosts(publishedData.posts, "insta"),
          failed: filterPosts(failedData.posts, "insta"),
        });

        setXPostsData({
          all: filterPosts(allData?.posts, "xcom"),
          scheduled: filterPosts(scheduledData.posts, "xcom"),
          published: filterPosts(publishedData.posts, "xcom"),
          failed: filterPosts(failedData.posts, "xcom"),
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("An error occurred while fetching posts.");
      }
    };

    fetchData();
  }, []);

  console.log(currentTab);

  const tabStyles = (tab) =>
    `hover:bg-accent flex gap-2 flex-row justify-center items-center cursor-pointer text-center w-full ${
      currentTab === tab
        ? "border-[2px] border-accent border-b-[2px] border-b-background2"
        : "border-b-[2px] border-b-accent"
    }`;

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"post list"} />
      </div>
      <div className="contentzone flex flex-col gap-3 pt-3 px-2 ml-0 sm:ml-64 w-full">
        <div className="postsellectors bg-background2 p-2 rounded-lg gap-3 flex flex-col justify-center items-center text-sm w-full">
          <div className="media-selecto flex flex-row w-full justify-evenly pt-5">
            <div
              onClick={() => setCurrentTab("all")}
              className={tabStyles("all")}
            >
              <GalleryHorizontal /> <span className="hidden sm:block">all</span>
            </div>
            <div
              onClick={() => setCurrentTab("fbook")}
              className={tabStyles("fbook")}
            >
              <Facebook /> <span className="hidden sm:block">facebook</span>
            </div>
            <div
              onClick={() => setCurrentTab("insta")}
              className={tabStyles("insta")}
            >
              <Instagram /> <span className="hidden sm:block">instagram</span>
            </div>
            <div
              onClick={() => setCurrentTab("xcom")}
              className={tabStyles("xcom")}
            >
              <BsTwitterX />
              <span className="hidden sm:block">x.com</span>
            </div>
          </div>

          <div className="postzone bg-background2 w-full">
            {currentTab === "all" && allPostsData && (
              <AllPosts data={allPostsData} />
            )}
            {currentTab === "fbook" && facebookPostsData && (
              <FacebookPosts data={facebookPostsData} />
            )}
            {currentTab === "insta" && instagramPostsData && (
              <InstagramPosts data={instagramPostsData} />
            )}
            {currentTab === "xcom" && xPostsData && (
              <Xposts data={xPostsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
