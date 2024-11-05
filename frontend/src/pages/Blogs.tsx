import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import AppLogo from "../assets/appLogo.png";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return (
      <div>
        <Appbar />
        <div>
          <div className="flex flex-col justify-center">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      {blogs.length > 0 ? (
        <div className="flex justify-center">
          <div className="max-w-xl">
            {blogs.map((blog, idx) => (
              <BlogCard
                key={idx}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate="2nd Feb 2024"
                id={blog.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[70vh] justify-center flex flex-col items-center">
          <img src={AppLogo} className="w-52 h-56 opacity-[0.05] pb-5" />
          <span className="text-base font-thin">No Blog Found</span>
        </div>
      )}
    </div>
  );
};
