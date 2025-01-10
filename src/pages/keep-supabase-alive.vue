<template>
  <section class="flex flex-col items-center">
    <p class="mb-10">
      Check Supabase project: keep_alive table must have a row where 'is_set' = TRUE
    </p>
    <RouterLink class="bg-black p-4 rounded-lg text-white" to="/login">Back login page</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { loginWithSupabase } from '@/services/supabase-auth'
import { readKeepAliveQuery } from '@/services/supabase-queries'
import type { LoginData } from '@/types/LoginData'
const router = useRouter()

const formData = ref<LoginData>({
  email: import.meta.env.VITE_TESTING_USER_EMAIL,
  password: import.meta.env.VITE_TESTING_USER_EMAIL,
})

const { data: keep_alive } = await readKeepAliveQuery()
console.log(keep_alive)
if (keep_alive![0].is_set) {
  const { error } = await loginWithSupabase({ formData: formData.value })
  if (!error) router.push('/')
} else {
  console.warn("Check Supabase project: keep_alive table must have a row where 'is_set' = TRUE")
}
</script>
