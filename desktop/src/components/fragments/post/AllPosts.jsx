import React, { useState, useMemo } from "react"; // Import React
import PostContainer from "./fragments/PostContainer";

// Wrap the component definition with React.memo
const AllPosts = React.memo(({ data }) => {
  console.log("Rendering AllPosts"); // Add this to see when it renders
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Memoize the filtered posts calculation
  // It will only re-calculate if 'data', 'filter', or 'searchQuery' changes.
  const filteredPosts = useMemo(() => {
    // Early exit if data isn't ready or the specific filter category is invalid
    if (!data || typeof data !== "object" || !Array.isArray(data[filter])) {
      console.log("FilteredPosts: Data invalid or filter category missing");
      return [];
    }

    const query = searchQuery.trim().toLowerCase();
    // Optimization: If search query is empty, return all posts for the current filter directly
    if (!query) {
      console.log(
        `FilteredPosts: No search query, returning all ${data[filter].length} posts for filter '${filter}'`
      );
      return data[filter];
    }

    // Perform the actual filtering
    const result = data[filter].filter((post) =>
      post.text?.toLowerCase().includes(query)
    );
    console.log(
      `FilteredPosts: Filtered by query '${query}', found ${result.length} posts for filter '${filter}'`
    );
    return result;
  }, [data, filter, searchQuery]); // Dependencies for useMemo

  // Loading state - render this before trying to access data[filter]
  if (!data || typeof data !== "object") {
    console.log("AllPosts: Rendering Loading state");
    return <div className="text-muted-foreground py-6">Loading...</div>;
  }

  // Handlers (using useCallback is often overkill here unless passed to deeply memoized children)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // JSX UI
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* Search and Filter Section */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center px-2 rounded-lg">
        <div className="w-full flex py-4 justify-center">
          <input
            type="text"
            placeholder="Search posts..."
            className="border px-4 py-2 rounded-md w-full sm:w-auto"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="select-option py-2 w-full flex justify-center">
          <select
            className="border px-4 py-2 rounded-md w-full sm:w-auto"
            value={filter}
            onChange={handleFilterChange}
          >
            {/* Check if data keys exist before rendering options */}
            {data.all && <option value="all">All</option>}
            {data.scheduled && <option value="scheduled">Scheduled</option>}
            {data.published && <option value="published">Published</option>}
            {data.failed && (
              <option className="text-red-500" value="failed">
                Failed
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Posts Display Section */}
      <div className="w-full min-h-fit overflow-y-scroll gap-2 flex flex-col justify-center items-center max-h-[60vh]">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            // Ensure key is unique and stable
            <PostContainer
              key={post._id?.$oid || post._id || `post-${Math.random()}`}
              data={post}
            />
          ))
        ) : (
          <div className="text-muted-foreground py-6">No posts found.</div>
        )}
      </div>
    </div>
  );
}); // Close React.memo

// Set a display name for easier debugging in React DevTools
AllPosts.displayName = "AllPosts";

export default AllPosts; // Export the memoized component
