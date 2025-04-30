import { useState, useMemo } from "react";
import PostContainer from "./fragments/PostContainer";

export default function Xposts({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  console.log("xPosts data", data);

  // Safely get posts array from the `data` object
  const posts = Array.isArray(data?.[filter]) ? data[filter] : [];

  // Filter by search query only
  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, posts]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* Search and Filter Section */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center px-2 rounded-lg">
        <div className="w-full flex py-4 justify-center">
          <input
            type="text"
            placeholder="Search posts..."
            className="border px-4 py-2 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="select-option py-2 w-full flex justify-center">
          <select
            className="border px-4 py-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option className="text-red-500" value="failed">
              Failed
            </option>
          </select>
        </div>
      </div>

      {/* Posts Display Section */}
      <div className="w-full overflow-y-scroll gap-2 flex flex-col justify-center items-center">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostContainer key={post._id?.$oid || post._id} data={post} />
          ))
        ) : (
          <div>No posts found.</div>
        )}
      </div>
    </div>
  );
}
