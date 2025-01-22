import { useState, useEffect } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import PostContainer from "../../components/fragments/post/fragments/PostContainer";
import Loader from "../../components/fragments/Loader";

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [postCounts, setPostCounts] = useState({
    published: 0,
    scheduled: 0,
    failed: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetch("/api/posts/all", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data?.posts || []);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const counts = posts.reduce(
      (acc, post) => {
        if (post.status === "published") acc.published += 1;
        if (post.status === "scheduled") acc.scheduled += 1;
        if (post.status === "failed") acc.failed += 1;
        return acc;
      },
      { published: 0, scheduled: 0, failed: 0 }
    );
    setPostCounts(counts);
  }, [posts]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredPosts = (Array.isArray(posts) ? posts : []).filter((post) => {
    const postDate = new Date(post.uploadDate);
    if (isNaN(postDate.getTime())) {
      console.error(`Invalid date found in post ID: ${post._id}`);
      return false;
    }

    const postDateString = postDate.toLocaleDateString("en-CA");
    const selectedDateString = selectedDate.toLocaleDateString("en-CA");

    return postDateString === selectedDateString;
  });

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"calendar"} />
      </div>
      <div className="contentzone flex flex-col gap-3 pt-3 px-2 ml-0 sm:ml-64 w-full">
        <h2 className="text-xl font-bold">Post Scheduler</h2>
        <div className="w-full flex justify-center items-center sm:flex-row sm:gap-2">
          <div className="w-fit">
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
          <div className="w-full h-full hidden gap-4 sm:flex flex-col justify-center items-center">
            <div className="w-full h-full gap-2 p-2 rounded-md text-center bg-background2 flex flex-col justify-center items-center">
              <div className="w-full text-center">
                <p>Published post</p>
              </div>
              <div className="w-full text-center">
                <p>{postCounts.published}</p>
              </div>
            </div>
            <div className="w-full h-full gap-2 p-2 rounded-md text-center bg-background2 flex flex-col justify-center items-center">
              <div className="w-full text-center">
                <p>Scheduled post</p>
              </div>
              <div className="w-full text-center">
                <p>{postCounts.scheduled}</p>
              </div>
            </div>
            <div className="w-full h-full gap-2 p-2 rounded-md text-center bg-background2 flex flex-col justify-center items-center">
              <div className="w-full text-center">
                <p>Failed post</p>
              </div>
              <div className="w-full text-center">
                <p>{postCounts.failed}</p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-3 bg-background2 w-full p-2">
            <h3 className="font-bold">
              Scheduled Posts for {selectedDate.toDateString()}
            </h3>
            <div className="w-full flex flex-col gap-3 overflow-y-scroll scrollbar-hide">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostContainer key={post.id} data={post} />
                ))
              ) : (
                <p>No posts scheduled for this date.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}