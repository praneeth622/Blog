import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

export const userRoute = new Hono<{
  Bindings:{
      DATABASE_URL :string
      JWT_SECRET:string
  }
}>();

userRoute.post("/api/v1/user/signup", async (c) => {
  try{

  }
  catch(err){
    console.log(err)
  }
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  console.log("User data is ", body);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  //user Verification
  if (!user) {
    return Response.json({
      message: "Failed to sign up ",
    });
  }

  //jwt token
  //@ts-ignore
  const token = await sign({ id: user.id }, c.env.JWT_SECRET);

  return c.json({
    jwt: token,
  });
});

userRoute.post("/api/v1/user/signin", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  console.log("Hit");
  try {
    const body = await c.req.json();
    console.log(body);

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    //User Not present
    if (!user) {
      return c.json({
        Message: "User Not Present",
      });
    }

    //@ts-ignore
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
    });
  } catch (err) {
    return c.json({
      Message: err,
    });
  }
});
