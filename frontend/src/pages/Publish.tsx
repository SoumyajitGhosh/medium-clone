import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Appbar } from "../components/Appbar";
import DOMPurify from "dompurify";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content: DOMPurify.sanitize(description),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Failed to publish the post:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          {/* Controlled input for title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full text-2xl font-bold border-b border-gray-300 outline-none pb-[10px] mb-[20px]"
            placeholder="Title"
          />

          {/* Pass setDescription to the TextEditor */}
          <TextEditor onChange={setDescription} />

          <button
            onClick={handlePublish}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish post
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated TextEditor component
function TextEditor({
  onChange,
}: {
  onChange: (value: string) => void; // Accepts a string
}) {
  return (
    <div className="mt-2">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between border">
          <div className="my-2 bg-white rounded-b-lg w-full">
            <label className="sr-only">Publish post</label>
            <ReactQuill
              theme="snow"
              onChange={(content, delta, source, editor) => onChange(content)} // Adjusted for ReactQuill's signature
              className="focus:outline-none block w-full text-sm text-gray-800 bg-white border-0 pl-2"
              placeholder="Write an article..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
