import { schedule } from '@netlify/functions'

export const handler = schedule('56 15 * * *', async () => {
  console.log("It's 14:55!")
})