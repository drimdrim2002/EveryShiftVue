/**
 * Import the schedule function to use cron expression
 * for recurring functions.
 */
import { schedule } from '@netlify/functions'
// import { log } from "console";
// import { seedDatabase } from "../../../database/sedding.module";
console.log('RECCURING_SUPABASE_SEEDING>Starting registering recurring-publish function...')
/**
 *
 * @param {Object} event The event sent by Netlify CD
 * @returns
 */
const job = async (event) => {
  console.log('RECCURING_SUPABASE_SEEDING>Starting function')
  console.log('RECCURING_SUPABASE_SEEDING>event', event)
  /**
   * Environment variables are retrieved via process.env
   * but not the global object `Netlify.env` as some docs
   * suggests. Or it requires a certain package. The said-
   * docs don't mention it.
   *
   * @see https://docs.netlify.com/functions/get-started/?fn-language=ts#environment-variables
   *
   * For setting Environment Variable, your app deploy settings and the
   * "Environment Variables" blade.
   *
   * @see https://docs.netlify.com/configure-builds/environment-variables/
   */
  let RECURRING_BUILD_HOOK = process.env.RECURRING_BUILD_HOOK
  console.log(
    'RECCURING_SUPABASE_SEEDING>Got RECURRING_BUILD_HOOK variable =>',
    RECURRING_BUILD_HOOK,
  )
  console.log('RECCURING_SUPABASE_SEEDING>Fetching as POST the RECURRING_BUILD_HOOK...')
  /**
   * Note: because functions use the standard Fetch API,
   * which was only added natively to Node.js in version
   * 18.0.0, no need for other libraries...
   *
   * As of March 25th 2024, it should be fine.
   * @see https://docs.netlify.com/functions/get-started/?fn-language=ts#runtime
   */
  try {
    await seedDatabase(15)
    await fetch(RECURRING_BUILD_HOOK, { method: 'POST' })
    console.log('RECCURING_SUPABASE_SEEDING>Build hook fetch success!')
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Build ran successfully.` }),
    }
  } catch (error) {
    console.log('RECCURING_SUPABASE_SEEDING>Build hook fetch error!')
    return { statusCode: 500, body: error.toString() }
  }
}

let RECCURING_SUPABASE_SEEDING_CRON = process.env.RECCURING_SUPABASE_SEEDING_CRON
/**
 * This was my attempt to use an environment variable to configure the cron.
 * But Netlify build agent tells me it is not possible...
 * Though the logs show the variable is read.
 */
console.log(
  'RECCURING_SUPABASE_SEEDING>Got RECCURING_SUPABASE_SEEDING_CRON variable =>',
  RECCURING_SUPABASE_SEEDING_CRON,
)
//module.exports.handler = schedule(RECCURING_SUPABASE_SEEDING_CRON, handler);
//module.exports.handler = schedule("*/5 * * * *", handler);//every 5 min
module.exports.handler = schedule('0 9 10 * *', job) //every day at 9am GMT
// export const handler = schedule("*/1 * * * *", job); //every 2 minutes
console.log('RECCURING_SUPABASE_SEEDING>Done registering')
