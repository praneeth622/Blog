import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/user/signup', (c) => {
  return c.text('This is user sign up page')
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('This is user sign in page')
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
