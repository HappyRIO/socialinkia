import { useState, useEffect } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import PostContainer from "../../components/fragments/post/fragments/PostContainer";
import Loader from "../../components/fragments/Loader";

const initialPosts = [
  {
    id: "1",
    title: "New product launch!",
    uploadDate: "2025-01-16T09:00",
    platform: "Facebook",
    description: "Our latest product is launching soon!"
  },
  {
    id: "2",
    title: "New blog post",
    uploadDate: "2025-01-16T11:00",
    platform: "Instagram",
    description: "Check out our latest blog post."
  }
];

export default function CalendarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setLoading(true); // Optional: To ensure loading state is updated before fetching
    fetch("/api/posts/all", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json()) // Call res.json() to parse the response
      .then((data) => {
        setPosts(data?.posts); // Update the posts state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      })
      .finally(() => {
        setLoading(false); // Ensure loading state is updated when the fetch is complete
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const filteredPosts = (Array.isArray(posts) ? posts : []).filter((post) => {
    const postDate = new Date(post.uploadDate);
    if (isNaN(postDate.getTime())) {
      console.error(`Invalid date found in post ID: ${post._id}`);
      return false;
    }

    // Convert both dates to local date strings (YYYY-MM-DD)
    const postDateString = postDate.toLocaleDateString("en-CA"); // "en-CA" ensures ISO-like format
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
        <div className="w-full flex gap-4">
          <Calendar onChange={handleDateChange} value={selectedDate} />
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
