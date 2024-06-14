import z from 'zod'

const signupInput = z.object({
    username:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
  })
  