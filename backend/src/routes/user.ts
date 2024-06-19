import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { signupInput } from '../../../common/src/index'

export const userRoute = new Hono<{
  Bindings:{
      DATABASE_URL :string
      JWT_SECRET:string
  }
}>();

userRoute.post('/signup', async (c) => {
  console.log('Received request on /api/v1/user/signup');
  try {
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    console.log('User data is ', body);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    // User Verification
    if (!user) {
      return c.json(
        {
          message: 'Failed to sign up',
        },
        404
      );
    }

    // JWT token
    //@ts-ignore
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
    });
  } catch (err) {
    console.log('Error:', err);
    return c.json(
      {
        message: 'Internal Server Error',
      },
      500
    );
  }
});

userRoute.post("/signin", async (c) => {
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
