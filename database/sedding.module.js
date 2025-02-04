// to internationlize the faked data, use the XX_ZZ local
// and import fake like the comment below
// import { fakerFR_BE as faker } from '@faker-js/faker'
import { faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const initSupabase = () => {
  console.log('import.meta.env', import.meta.env)
  console.log('process.env', process.env)
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_PROJECT_SERVICE_ROLE
  console.log('supabaseUrl', supabaseUrl)
  console.log('supabaseKey', supabaseKey)
  const supabase = createClient(
    supabaseUrl,
    supabaseKey,
  )
  return supabase;
}

const getTestEmail = () => {
  const testingUserEmail = process.env.VITE_TESTING_USER_EMAIL
  if (!testingUserEmail) {
    console.error('Have you forgot to add VITE_TESTING_USER_EMAIL to your .env file?')
    process.exit()
  }
}

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`,
  )
  process.exit(1)
}

const logStep = (stepMessage) => {
  console.log(stepMessage)
}

const PrimaryTestUserExists = async (supabase) => {
  logStep('Checking if primary test user exists...')
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', 'testaccount1')
    .single()

  if (error) {
    console.log('Primary test user not found. Will create one.')
    return false
  }

  logStep('Primary test user is found.')
  return data?.id
}

const createPrimaryTestUser = async (supabase) => {
  const testingUserEmail = getTestEmail()
  logStep('Creating primary test user...')
  const dummyData = {
    firstName: 'Test',
    lastName: 'Account',
    userName: 'testaccount1',
    email: testingUserEmail,
    userId: null,
  }
  const { data, error } = await supabase.auth.signUp({
    email: dummyData.email,
    password: dummyData.email,
    options: {
      data: {
        first_name: dummyData.firstName,
        last_name: dummyData.lastName,
        full_name: dummyData.firstName + ' ' + dummyData.lastName,
        username: dummyData.userName,
      },
      //uncomment below if you don't get the Supabase confirmation email
      // email_confirmed_at: new Date(Date.now())
    },
  })

  if (error) {
    logErrorAndExit('Users', error)
  }

  if (data) {
    dummyData.userId = data.user.id
    await seedProfiles(supabase, dummyData)
    return data.user.id
  }
}
const seedProfiles = async (supabase, { userId, firstName, lastName, userName }) => {
  await supabase.from('profiles').insert({
    id: userId,
    full_name: firstName + ' ' + lastName,
    username: userName,
    bio: 'The main testing account',
    avatar_url: `https://i.pravatar.cc/150?u=${userId}`,
  })

  logStep(`Primary test user <${userId}> created successfully.`)
}
export const seedDatabase = async (numEntriesPerTable) => {
  let userId

  const supabase = initSupabase();
  const testUserId = await PrimaryTestUserExists(supabase)

  if (!testUserId) {
    const primaryTestUserId = await createPrimaryTestUser(supabase)
    userId = primaryTestUserId
  } else {
    userId = testUserId
  }
  const entitiesIds = (await seedEntities(supabase,numEntriesPerTable, userId)).map((entity) => entity.id)
  await seedSubEntities(supabase,numEntriesPerTable, entitiesIds, userId)
  await seedKeepAlive(supabase)
}

const seedKeepAlive = async (supabase) => {
  const { data, error } = await supabase
    .from('keep_alive')
    .insert({ is_set: true })
    .select('is_set')

  if (error) return logErrorAndExit('keep_alive has an error', error)
  if (!data) return logErrorAndExit('keep_alive has no data', data)

  logStep('Seeded keep_alive!')
}
const seedEntities = async (supabase, numEntries, userId) => {
  logStep('Seeding entities...')
  const entities = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)

    entities.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      description: faker.lorem.paragraphs(2),
      due_date: faker.date.anytime(),
      status: faker.helpers.arrayElement(['todo', 'in-progress', 'completed']),
    })
  }

  const { data, error } = await supabase.from('entities').insert(entities).select('id')

  if (error) return logErrorAndExit('Entities', error)

  logStep('Entities seeded successfully.')

  return data
}

const seedSubEntities = async (supabase, numEntries, entitiesIds, userId) => {
  logStep('Seeding sub entities...')
  const subEntities = []

  for (let i = 0; i < numEntries; i++) {
    subEntities.push({
      name: faker.lorem.words(3),
      status: faker.helpers.arrayElement(['todo', 'in-progress', 'completed']),
      description: faker.lorem.paragraph(),
      due_date: faker.date.future(),
      profile_id: userId,
      entity_id: faker.helpers.arrayElement(entitiesIds),
    })
  }

  const { data, error } = await supabase.from('sub_entities').insert(subEntities).select('id')

  if (error) return logErrorAndExit('Sub Entities', error)

  logStep('Sub Entities seeded successfully.')

  return data
}