import { schedule } from '@netlify/functions'

export const handler = schedule('*/1 * * * *', async () => {
  console.log(new Date(Date.now()))
})