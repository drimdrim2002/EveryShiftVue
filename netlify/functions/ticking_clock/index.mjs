import { schedule } from '@netlify/functions'

export const handler = schedule('55 14 * * *', async () => {
  console.log("It's 14:55!")
})