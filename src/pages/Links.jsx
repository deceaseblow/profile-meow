import { useState } from "react";

import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";

import {
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/firestoreService";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif",
};

function Links() {
  const { getLinks, loading } = useAppData();
  const { isAdmin } = useAuth();

  const [adding, setAdding] = useState(false);

  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [editLink, setEditLink] = useState({
    name: "",
    url: "",
    description: "",
  });

  if (loading) {
    return (
      <div>
        <div className="pb-10 px-4 md:px-10">
          <h2
            className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
            style={fontStyle}
          >
            Links
          </h2>

          <p className="text-center mt-4 text-gray-500">
            Loading the links...
          </p>
        </div>
      </div>
    );
  }

  const links = getLinks();

  // -----------------------------
  // ADD LINK
  // -----------------------------

  const handleNewLinkChange = (e) => {
    const { name, value } = e.target;

    setNewLink((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLink = async (e) => {
    e.preventDefault();

    if (!newLink.name.trim()) {
      alert("Please enter a link name.");
      return;
    }

    if (!newLink.url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    try {
      await addDocument("links", {
        name: newLink.name.trim(),
        url: newLink.url.trim(),
        description: newLink.description.trim(),
      });

      alert("Link added successfully!");

      setNewLink({
        name: "",
        url: "",
        description: "",
      });

      setAdding(false);

      window.location.reload();
    } catch (error) {
      console.error("Error adding link:", error);
      alert("Failed to add link.");
    }
  };

  // -----------------------------
  // EDIT LINK
  // -----------------------------

  const startEditing = (link) => {
    setEditingId(link.firestoreId);

    setEditLink({
      name: link.name || "",
      url: link.url || "",
      description: link.description || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditLink((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();

    if (!editLink.name.trim()) {
      alert("Please enter a link name.");
      return;
    }

    if (!editLink.url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    try {
      await updateDocument(
        "links",
        editingId,
        {
          name: editLink.name.trim(),
          url: editLink.url.trim(),
          description: editLink.description.trim(),
        }
      );

      alert("Link updated successfully!");

      setEditingId(null);

      window.location.reload();
    } catch (error) {
      console.error("Error updating link:", error);
      alert("Failed to update link.");
    }
  };

  // -----------------------------
  // DELETE LINK
  // -----------------------------

  const handleDeleteLink = async (link) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${link.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteDocument(
        "links",
        link.firestoreId
      );

      alert("Link deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error deleting link:", error);
      alert("Failed to delete link.");
    }
  };

  return (
    <div className="pb-10 px-4 md:px-10">
      <h2
        className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
        style={fontStyle}
      >
        Links
      </h2>

      {/* ADD BUTTON */}
      {isAdmin && !adding && (
        <div className="flex justify-center md:justify-start mb-6">
          <button
            onClick={() => setAdding(true)}
            className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition"
          >
            + Add Link
          </button>
        </div>
      )}

      {/* ADD FORM */}
      {isAdmin && adding && (
        <div className="w-full max-w-xl mb-8 bg-white border border-gray-400 rounded-lg p-4 sm:p-6">
          <h3 className="text-xl font-bold mb-5">
            Add New Link
          </h3>

          <form
            onSubmit={handleAddLink}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block font-semibold mb-1">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={newLink.name}
                onChange={handleNewLinkChange}
                placeholder="Link name"
                className="w-full border border-gray-400 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                URL
              </label>

              <input
                type="url"
                name="url"
                value={newLink.url}
                onChange={handleNewLinkChange}
                placeholder="https://..."
                className="w-full border border-gray-400 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Description
              </label>

              <textarea
                name="description"
                value={newLink.description}
                onChange={handleNewLinkChange}
                placeholder="Description"
                rows={3}
                className="w-full border border-gray-400 rounded px-3 py-2 resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 transition"
              >
                Add Link
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdding(false);

                  setNewLink({
                    name: "",
                    url: "",
                    description: "",
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

      <div className="px-2 pb-10 md:px-0">
        {links.length === 0 ? (
          <p className="text-center text-gray-400">
            No links found.
          </p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                    #
                  </th>

                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                    Name
                  </th>

                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                    Description
                  </th>

                  {isAdmin && (
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {links.map((link, index) => {
                  const linkUrl = link.url;
                  const isEditing =
                    editingId === link.firestoreId;

                  // -----------------------------
                  // EDITING ROW
                  // -----------------------------

                  if (isEditing) {
                    return (
                      <tr
                        key={link.firestoreId}
                        className="border-b bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          {index + 1}
                        </td>

                        <td className="py-3 px-4">
                          <input
                            type="text"
                            name="name"
                            value={editLink.name}
                            onChange={handleEditChange}
                            className="w-full min-w-[150px] border border-gray-400 rounded px-2 py-1"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-2">
                            <input
                              type="url"
                              name="url"
                              value={editLink.url}
                              onChange={handleEditChange}
                              className="w-full min-w-[200px] border border-gray-400 rounded px-2 py-1"
                            />

                            <textarea
                              name="description"
                              value={editLink.description}
                              onChange={handleEditChange}
                              rows={2}
                              className="w-full min-w-[200px] border border-gray-400 rounded px-2 py-1 resize-y"
                            />
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={handleUpdateLink}
                              className="px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-700 transition"
                            >
                              Save
                            </button>

                            <button
                              onClick={() =>
                                setEditingId(null)
                              }
                              className="px-3 py-1.5 bg-gray-300 text-black text-sm rounded hover:bg-gray-400 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // -----------------------------
                  // NORMAL ROW
                  // -----------------------------

                  return (
                    <tr
                      key={
                        link.firestoreId ||
                        linkUrl ||
                        index
                      }
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold hover:underline"
                        >
                          {link.name}
                        </a>
                      </td>

                      <td className="py-3 px-4">
                        {link.description || "—"}
                      </td>

                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                startEditing(link)
                              }
                              className="px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-700 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteLink(link)
                              }
                              className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-400 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Links;