import { useEffect, useState } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import PostContainer from "../../components/fragments/post/fragments/PostContainer";
import Loader from "../../components/fragments/Loader";

export default function CalendarPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [postCounts, setPostCounts] = useState({
    published: 0,
    scheduled: 0,
    failed: 0,
  });

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch("/api/posts/all", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((data) => setPosts(data?.posts || []))
      .catch((error) => console.error("Error fetching posts:", error))
      .finally(() => setLoading(false));
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  console.log(
    "Rendering CalendarPage with currentDate:",
    currentDate.toString()
  ); 
  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getPostsForDay = (day) => {
    return posts.filter((post) => {
      const postDate = new Date(post.uploadDate);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === month &&
        postDate.getFullYear() === year &&
        (statusFilter === "all" || post.status === statusFilter)
      );
    });
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(year, month, day));
  };

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.uploadDate);
    return (
      isSameDate(postDate, selectedDate) &&
      (statusFilter === "all" || post.status === statusFilter)
    );
  });


  return (
    <div className="w-full flex flex-row justify-center items-start">
      {/* <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"dashboard"} />
      </div> */}
      <div className="contentzone flex flex-col gap-3 pt-3 px-2 ml-0 sm:ml-64 w-full">
        <h2 className="text-xl font-bold">Post Scheduler</h2>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-2">
          {["all", "published", "scheduled", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full border text-sm transition-all ${
                statusFilter === status
                  ? "bg-accent text-white"
                  : "bg-background2"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-background2 p-4 rounded-xl shadow-md w-full max-w-5xl overflow-x-auto">
          <div className="flex justify-between items-center mb-4 min-w-[300px]">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1
                  )
                )
              }
              className="text-primary hover:text-accent text-lg font-bold"
            >
              &lt;
            </button>
            <h2 className="text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1
                  )
                )
              }
              className="text-primary hover:text-accent text-lg font-bold"
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 text-center mb-2 text-sm font-semibold text-primary">
            {dayNames.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm min-w-[560px]">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const cellDate = new Date(year, month, day);
              const dailyPosts = getPostsForDay(day).slice(0, 3);
              const isWeekend =
                cellDate.getDay() === 0 || cellDate.getDay() === 6;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`rounded-lg p-2 h-24 cursor-pointer overflow-hidden 
                    flex flex-col items-start justify-start border transition-all
                    ${
                      isSameDate(selectedDate, cellDate)
                        ? "border-2 border-accent"
                        : "border border-transparent"
                    }
                    ${
                      isSameDate(today, cellDate)
                        ? "bg-accent text-white"
                        : isWeekend
                        ? "bg-background hover:bg-accent hover:text-background"
                        : "hover:bg-secondary hover:text-white"
                    }`}
                >
                  <div className="font-bold">{day}</div>
                  <div className="flex flex-col gap-0.5 mt-1 w-full">
                    {dailyPosts.map((post) => {
                      let bgClass = "bg-transparent text-[var(--text)]";
                      if (post.status === "published")
                        bgClass = "bg-primary text-white";
                      else if (post.status === "scheduled")
                        bgClass = "bg-secondary text-white";
                      else if (post.status === "failed")
                        bgClass = "bg-red-600 text-white";

                      return (
                        <div
                          key={post._id}
                          className={`text-xs truncate w-full px-1 py-0.5 rounded ${bgClass}`}
                          title={post.text}
                        >
                          • {post.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
          {["published", "scheduled", "failed"].map((status) => (
            <div
              key={status}
              className="w-full sm:w-1/3 bg-background2 p-3 rounded-md text-center"
            >
              <p className="text-sm capitalize">{status} posts</p>
              <p className="text-lg font-bold">{postCounts[status]}</p>
            </div>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-3 bg-background2 w-full p-2 mt-3">
            <h3 className="font-bold">
              Posts for {selectedDate.toDateString()}{" "}
              {statusFilter !== "all" && `(${statusFilter})`}
            </h3>
            <div className="w-full flex flex-col gap-3 overflow-y-scroll scrollbar-hide">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostContainer key={post._id} data={post} />
                ))
              ) : (
                <p>No posts for this date.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
