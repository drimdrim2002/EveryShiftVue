const { schedule } = require('@netlify/functions')

exports.handler = schedule('0 * * * *', async () => {
  console.log(new Date(Date.now()))
})