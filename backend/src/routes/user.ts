import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import {
  signinInput,
  signupInput,
} from "@_soumyajit.ghosh_/medium-clone-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token,
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up" });
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are incorrect",
    });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    console.log("this")
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ message: "User not found" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    console.log("That")
    c.status(403);
    return c.json({ message: "Error while signing up" });
  }
});

userRouter.get("/personalInfo/:id", async (c) => {
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
    const userId = await verify(id || "", c.env.JWT_SECRET) as {id:string};
    const user = await prisma.user.findUnique({
      where: {
        id: userId.id,
      },
    });  
    if (!user) {
      c.status(403);
      c.json({ user });
    }
    c.status(200);
    return c.json({...user})
  }
  catch (e) {
    c.status(204);
    return c.json({ error: "Couldn't fetch personal info" });
  }
})

userRouter.delete("/delete-users", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const result = await prisma.user.deleteMany({});
    return c.json({ message: 'User deleted successfully', post: result.count }, 200);
  }
  catch (err) {
    return c.json({ message: 'User not found or could not be deleted' }, 404);
  }
})

userRouter.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const result = await prisma.user.findMany();
  return c.json({ result }, 200);
})