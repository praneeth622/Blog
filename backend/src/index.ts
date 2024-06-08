import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify} from 'hono/jwt'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:String
  }
}>()

app.use('/api/v1/blog/*',async(c,next)=>{

  //fetch the header
  const header = c.req.header('autharization') || ""

  //verify the jwt
  //@ts-ignore
  const response =await verify(header,c.env.JWT_SECRET)

  if(!response.id){
    c.status(403)
    return c.json({
      "message":"User unauthoiraize"
    })
  }else{
    next()
  }

})

app.post('/api/v1/user/signup', async(c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const body = await c.req.json()
  console.log("User data is ", body)
  
  const user = await prisma.user.create({
    data:{
      email:body.email,
      password:body.password
    }
  })

  //user Verification
  if(!user){
    return Response.json({
      message :"Failed to sign up "
    })
  }

  //jwt token
  //@ts-ignore
  const token = await sign({id:user.id},c.env.JWT_SECRET)
  
  return c.json({
    "jwt":token
  })
})

app.post('/api/v1/user/signin', async(c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()

  const user = await prisma.user.findUnique({
    where:{
      email:body.email,
      password:body.password
    }
  })

  //User Not present 
  if(!user){
    return c.json({
      "Message":"User Not Present"
    })
  }

  //@ts-ignore
  const token = await sign({id:user.id},c.env.JWT_SECRET)

  return c.json({
    "jwt":token
  })
})

app.post('/api/v1/blog', (c) => {
  return c.text('This is Blog page post')
})

app.put('/api/v1/blog', (c) => {
  return c.text('This is Blog Put page')
})

app.get('/api/v1/blog/:id', (c) => {
  const params = c.req.param('id')
  return c.text(`This is blog dynamic routing ${params}`)
})

app.get('/api/v1/blog/bulk',(c)=>{
  return c.text("This Blog Bulk route")
})

export default app
