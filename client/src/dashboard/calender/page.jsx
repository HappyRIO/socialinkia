import { useState } from "react";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

const initialPosts = [
  {
    id: "1",
    title: "New product launch!",
    date: "2025-01-16",
    time: "09:00",
    platform: "Facebook",
    description: "Our latest product is launching soon!"
  },
  {
    id: "2",
    title: "New blog post",
    date: "2025-01-16",
    time: "11:00",
    platform: "Instagram",
    description: "Check out our latest blog post."
  }
];

export default function CalendarPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newPost, setNewPost] = useState({
    title: "",
    date: "",
    time: "",
    platform: "",
    description: ""
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleAddPost = () => {
    if (!newPost.title || !newPost.date || !newPost.time || !newPost.platform) {
      alert("Please fill in all the fields.");
      return;
    }
    const newId = (posts.length + 1).toString();
    setPosts([...posts, { id: newId, ...newPost }]);
    setNewPost({
      title: "",
      date: "",
      time: "",
      platform: "",
      description: ""
    });
  };

  const filteredPosts = posts.filter(
    (post) => post.date === selectedDate.toISOString().split("T")[0]
  );

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"calendar"} />
      </div>
      <div className="contentzone flex flex-col gap-3 pt-3 px-2 ml-0 sm:ml-64 w-full">
        <h2 className="text-xl font-bold">Post Scheduler</h2>
        <div className="flex gap-4">
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <div className="flex flex-col gap-3 w-full">
            <h3 className="font-bold">
              Scheduled Posts for {selectedDate.toDateString()}
            </h3>
            <div className="w-full flex flex-col gap-3 overflow-y-scroll">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 border rounded bg-gray-100 shadow-sm flex flex-col"
                  >
                    <h4 className="font-semibold">{post.title}</h4>
                    <p>
                      <strong>Time:</strong> {post.time}
                    </p>
                    <p>
                      <strong>Platform:</strong> {post.platform}
                    </p>
                    <p className="line-clamp-1">{post.description}</p>
                  </div>
                ))
              ) : (
                <p>No posts scheduled for this date.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold">Schedule a New Post</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="date"
              value={newPost.date}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="time"
              name="time"
              value={newPost.time}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="platform"
              value={newPost.platform}
              onChange={handleInputChange}
              placeholder="Platform (e.g., Facebook, Instagram)"
              className="border p-2 rounded"
            />
            <textarea
              name="description"
              value={newPost.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="border p-2 rounded"
            />
            <button
              onClick={handleAddPost}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
