import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import {
  deleteDocument,
  updateDocument,
} from "../services/firestoreService";

function BlogCard({ blog }) {
  const { isAdmin } = useAuth();

  const [editing, setEditing] = useState(false);

  const [editBlog, setEditBlog] = useState({
    title: blog.title || "",
    date: blog.date || "",
    image: blog.image || "",
    content: blog.content || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDocument(
        "blogs",
        blog.firestoreId
      );

      alert("Blog deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editBlog.title.trim()) {
      alert("Please enter a blog title.");
      return;
    }

    try {
      await updateDocument(
        "blogs",
        blog.firestoreId,
        {
          title: editBlog.title.trim(),
          date: editBlog.date,
          image: editBlog.image.trim(),
          content: editBlog.content.trim(),
        }
      );

      alert("Blog updated successfully!");

      setEditing(false);

      window.location.reload();
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog.");
    }
  };

  if (editing) {
    return (
      <div className="w-full max-w-md sm:w-80 bg-white border border-gray-400 rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4">
          Edit Blog
        </h3>

        <form
          onSubmit={handleUpdate}
          className="flex flex-col gap-3"
        >
          {/* TITLE */}
          <div>
            <label className="block font-semibold mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={editBlog.title}
              onChange={handleChange}
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
              value={editBlog.date}
              onChange={handleChange}
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
              value={editBlog.image}
              onChange={handleChange}
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
              value={editBlog.content}
              onChange={handleChange}
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
              Save
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border border-gray-400 py-4 px-5 rounded-lg">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-xl font-bold wrap-break-word">
              {blog.title}
            </h1>

            <span>·</span>

            <p className="text-xs text-gray-600">
              {blog.date}
            </p>
          </div>

          <p className="text-sm leading-relaxed wrap-break-word">
            {blog.content || "No content available"}
          </p>

          {blog.image && (
            <div className="w-20 h-20 shrink-0 mt-2">
              <img
                src={blog.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* ADMIN CONTROLS */}
          {isAdmin && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-700 transition"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-gray-400 text-white text-sm rounded hover:bg-gray-300 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogCard;