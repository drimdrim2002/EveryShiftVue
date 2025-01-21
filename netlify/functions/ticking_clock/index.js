const { schedule } = require('@netlify/functions')

exports.handler = schedule('5 4 * * *', async () => {
  console.log("It's 04:05 AM!")
})