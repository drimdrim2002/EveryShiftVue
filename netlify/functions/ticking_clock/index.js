const { schedule } = require('@netlify/functions')

exports.handler = schedule('* */1 * * *', async () => {
  console.log(new Date(Date.now()))
})