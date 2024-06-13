import { Hono } from "hono";
import {  Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export const blogRoute = new Hono<{
    Bindings:{
        DATABASE_URL :string
        JWT_SECRET:string
    },
    Variables:{
      userId:JWTPayload[string]
    }
}>();

blogRoute.use("/*", async (c, next) => {
  // fetch the header
  const authHeader = c.req.header("autharization") || "";

  //verify the jwt
  const user = await verify(authHeader, c.env.JWT_SECRET);

  if(user){
    c.set('userId', user.id)
    await next()
  }
  else{
    c.status(411)
    return c.json({
      message:"User not found"
    })
  }
});

blogRoute.post("/", async(c) => {
    const body = await c.req.json()
    const userId = await c.get('userId');
    //initializing prisma
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    // Inserting the data
    const post = await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId: String(userId)
        }
    })
  return c.json({
    id:post.id
  })
});

blogRoute.put("/", async(c) => {
    //we will update the blog post
    const body = await c.req.json()
    // const userId = await c.get('userId');
    //initializing prisma
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    // update the data
    const post = await prisma.post.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content,
            authorId: '1'
        }
    })
  return c.json({
    id:post.id
  })
});

blogRoute.get("/", async(c) => {
    //get the all the blogs
    const body =await c.req.json()
    //initialize prisma
    //initializing prisma
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    //get the data
    try{
        const post = await prisma.post.findFirst({
            where:{
                id:body.id
            }
        })
    }
    catch(err){
        c.status(411)
        return c.json({
            message:"Error in frecthing data"
          })
    }
    
    
})

blogRoute.get("/:id", (c) => {
    //we need to get the blog of param
  const params = c.req.param("id");
  return c.text(`This is blog dynamic routing ${params}`);
});

blogRoute.get("/bulk", async(c) => {
    const body = c.req.json()
    //initalise prisma
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    //fetching data
    const post = await prisma.post.findMany()

  return c.json({
    post
  })
});
