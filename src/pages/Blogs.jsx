import { useState } from "react";
import BlogCard from "../comp/BlogCard";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { addDocument } from "../services/firestoreService";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

function Blogs() {
  const { data, loading } = useAppData();
  const { isAdmin } = useAuth();

  const [adding, setAdding] = useState(false);

  const [newBlog, setNewBlog] = useState({
    title: "",
    date: "",
    image: "",
    content: "",
  });

  if (loading) {
    return (
      <p className="text-center text-lg mt-10">
        Loading blogs...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-lg mt-10">
        Failed to load blog data.
      </p>
    );
  }

  const blogs = data.blogs || [];

  const handleNewBlogChange = (e) => {
    const { name, value } = e.target;

    setNewBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();

    if (!newBlog.title.trim()) {
      alert("Please enter a blog title.");
      return;
    }

    try {
      await addDocument("blogs", {
        title: newBlog.title.trim(),
        date: newBlog.date,
        image: newBlog.image.trim(),
        content: newBlog.content.trim(),
      });

      alert("Blog added successfully!");

      setNewBlog({
        title: "",
        date: "",
        image: "",
        content: "",
      });

      setAdding(false);

      window.location.reload();
    } catch (error) {
      console.error("Error adding blog:", error);
      alert("Failed to add blog.");
    }
  };

  return (
    <div>
      <div className="pb-10 px-4 md:px-10">
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
          style={fontStyle}
        >
          Blog
        </h2>

        {/* ADD BLOG BUTTON */}
        {isAdmin && !adding && (
          <div className="flex justify-center md:justify-start mb-6">
            <button
              onClick={() => setAdding(true)}
              className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
            >
              + Add Blog
            </button>
          </div>
        )}

        {/* ADD BLOG FORM */}
        {isAdmin && adding && (
          <div className="w-full max-w-xl mx-auto md:mx-0 mb-8 bg-white border border-gray-400 rounded-lg p-4 sm:p-6">
            <h3 className="text-xl font-bold mb-5">
              Add New Blog
            </h3>

            <form
              onSubmit={handleAddBlog}
              className="flex flex-col gap-4"
            >
              {/* TITLE */}
              <div>
                <label className="block font-semibold mb-1">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={newBlog.title}
                  onChange={handleNewBlogChange}
                  placeholder="Blog title"
                  className="w-full border border-gray-400 rounded px-3 py-2"
                  required
                />
              </div>

              {/* DATE */}
              <div>
                <label className="block font-semibold mb-1">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={newBlog.date}
                  onChange={handleNewBlogChange}
                  className="w-full border border-gray-400 rounded px-3 py-2"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="block font-semibold mb-1">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={newBlog.image}
                  onChange={handleNewBlogChange}
                  placeholder="https://..."
                  className="w-full border border-gray-400 rounded px-3 py-2"
                />
              </div>

              {/* CONTENT */}
              <div>
                <label className="block font-semibold mb-1">
                  Content
                </label>

                <textarea
                  name="content"
                  value={newBlog.content}
                  onChange={handleNewBlogChange}
                  placeholder="Write your blog..."
                  rows={6}
                  className="w-full border border-gray-400 rounded px-3 py-2 resize-y"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition"
                >
                  Add Blog
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);

                    setNewBlog({
                      title: "",
                      date: "",
                      image: "",
                      content: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* BLOG LIST */}
        {blogs.length === 0 ? (
          <p className="text-center text-lg mt-10">
            No blogs found.
          </p>
        ) : (
          <div className="flex gap-3 flex-wrap items-center justify-center md:justify-start">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.firestoreId || blog.id}
                blog={blog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Blogs;