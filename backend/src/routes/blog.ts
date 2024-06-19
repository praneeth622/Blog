import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import z from 'zod'
import { signupInput } from '../../../common/src/index'
export const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: JWTPayload[string];
  };
}>();



blogRoute.use("/", async (c, next) => {
  // fetch the header
  const authHeader = c.req.header("autharization") || "";

  //verify the jwt
  const user = await verify(authHeader, c.env.JWT_SECRET);

  if (user) {
    c.set("userId", user.id);
    console.log("authenticated");
    await next();
  } else {
    c.status(411);
    return c.json({
      message: "User not found",
    });
  }
});

blogRoute.post("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const {success,error} = signupInput.safeParse(body);
  if(!success || error){
    c.status(411)
    return c.json({
      message:"Input validation is not matched"
    })
  }
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      //@ts-ignore
      authorId: userId,
    },
  });
  return c.json({
    id: post.id,
  });
});
blogRoute.put("/", async (c) => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const update = prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  console.log(update);

  return c.text("updated post");
});

blogRoute.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany();

  return c.json(posts);
});

blogRoute.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  return c.json(post);
});


