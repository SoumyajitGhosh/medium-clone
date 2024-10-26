import { useEffect, useState } from "react";
import { BACKEND_URL, callApi, errorResponse } from "../config";
import { errorNotify } from "../components/ToastAlert";

export interface Blog {
    "content": string;
    "title": string,
    "id": string,
    "author": {
        "name": string
    }
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await callApi<any>(
        `${BACKEND_URL}/api/v1/blog/get/${id}`,
        "GET",
        undefined,
        {
          Authorization: `${localStorage?.getItem("token")}`,
        }
      );
      setBlog(response.data.blog);
      setLoading(false);
    } catch (err) {
      errorNotify(errorResponse(err));
    }
  }
  useEffect(() => {
    fetchBlog();
  }, []);

  return {
    loading,
    blog,
  };
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await callApi<any>(
        `${BACKEND_URL}/api/v1/blog/bulk`,
        "GET",
        undefined,
        {
          Authorization: `${localStorage.getItem("token")}`,
        }
      );
      setBlogs(response.data.blogs);
      setLoading(false);
    } catch (err) {
      errorNotify(errorResponse(err));
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    loading,
    blogs,
  };
};
