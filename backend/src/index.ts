import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify} from 'hono/jwt'
import { userRoute } from './routes/user'
import { blogRoute } from './routes/blog'

const app = new Hono<{
  Bindings:{
      DATABASE_URL :string
      JWT_SECRET:string
  }
}>()

app.route('/api/v1/blog',blogRoute)
app.route('/api/v1/user',userRoute)

app.use('/message/*', async (c, next) => {
  await next()
})
 


export default app
