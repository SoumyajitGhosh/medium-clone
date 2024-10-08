import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {
  createBlogInput,
  updateBlogInput,
} from "@_soumyajit.ghosh_/medium-clone-common";
import sanitizeHtml from 'sanitize-html';

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: any;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET);
  try {
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "You are not logged in",
      });
    }
  } catch (e) {
    c.status(403);
    return c.json({
      message: "You are not logged in",
    });
  }
});

blogRouter.get("/get/:id", async (c) => {
  // Get 'id' from query parameters
  const id = c.req.param("id");

  // Check if the 'id' is provided in the query params
  if (!id) {
    c.status(400);
    return c.json({
      message: "Missing 'id' query parameter",
    });
  }

  // Initialize Prisma client with acceleration
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    // Fetch the blog post from the database
    const blog = await prisma.post.findFirst({
      where: {
        id: id, // Search by ID
      },
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // Return 404 if the blog post is not found
    if (!blog) {
      c.status(404);
      return c.json({
        message: "Blog post not found",
      });
    }

    // Return the found blog post
    return c.json({
      blog,
    });
  } catch (e) {
    console.error("Error while fetching blog post:", e);
    c.status(500);
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.post.findMany({
    select: {
      content: true,
      title: true,
      id: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  // need to add pagination
  return c.json({
    blogs,
  });
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());


  // Sanitize the content to remove any harmful HTML and prevent XSS attacks
  const sanitizedContent = sanitizeHtml(body.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'u']),
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src'],
    },
  });


  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: sanitizedContent,
      authorId: authorId,
    },
  });
  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Sanitize the content to remove any harmful HTML and prevent XSS attacks
  const sanitizedContent = sanitizeHtml(body.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'u']),
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src'],
    },
  });

  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: sanitizedContent,
    },
  });
  return c.json({
    id: blog.id,
  });
});
