# EveryShift - Essential Development Rules

## 🔧 CRITICAL VERSIONS
- **Vue**: 3.5.13 (Composition API)
- **TailwindCSS**: 4.1.3 (NOT v3 - uses new @config syntax)
- **TypeScript**: 5.7.3
- **Vite**: 6.3.5
- **Supabase**: 2.53.0

## 🏗️ ARCHITECTURE PATTERNS

### Component Structure
```vue
<script setup lang="ts">
// 1. Imports & types
import type { EntityRecord } from '@/types/EntityRecord'

// 2. Props with defaults
interface Props {
  entity: EntityRecord
  isLoading?: boolean
}
const props = withDefaults(defineProps<Props>(), { isLoading: false })

// 3. Stores
const store = useEntityStore()
const { entities } = storeToRefs(store)

// 4. Local state & logic
const isSubmitting = ref(false)
const handleSubmit = async () => { /* ... */ }
</script>
```

### Store Pattern (Cache-First)
```typescript
export const useEntityStore = defineStore('entity-store', () => {
  const entities = ref<EntityRecord[]>()
  const _lastFetchTime = ref<Record<string, number>>({})
  
  const validateCache = async (key: string, query: Function, forceRefresh = false) => {
    const isExpired = !_lastFetchTime.value[key] || 
      (Date.now() - _lastFetchTime.value[key]) > 900000 // 15min
    
    if (!entities.value || isExpired || forceRefresh) {
      const { data, error } = await query()
      if (data) {
        entities.value = data
        _lastFetchTime.value[key] = Date.now()
      }
    }
  }
  
  return { entities: readonly(entities), validateCache }
})
```

## 🎨 TAILWIND CSS v4 PATTERNS

### Config Structure (tailwind.config.js)
```javascript
import { scopedPreflightStyles, isolateInsideOfContainer } from '@tailwindcss/vite'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer('.tw-preflight')
    })
  ]
}
```

### CSS Custom Properties
```css
@import "tailwindcss";

:root {
  --brand: #15803d;
  --background: #f5f5f4;
  --foreground: #292524;
}

.dark {
  --background: #292524;
  --foreground: #f5f5f4;
}
```

## 🔒 SUPABASE SECURITY (RLS MANDATORY)

### Query Pattern
```typescript
// ✅ CORRECT: Always handle errors
export const entityQuery = async (): Promise<QueryResult<EntityRecord[]>> => {
  const { data, error } = await supabase
    .from('entities')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// ❌ NEVER: Service role in frontend
// ❌ NEVER: Bypass RLS
```

### RLS Policies Required
```sql
ALTER TABLE "entities" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read" ON "entities" 
FOR SELECT TO authenticated USING (true);
```

## 🚦 CODE QUALITY RULES

### MUST DO
- ALL async functions handle errors properly
- ALL database tables use RLS policies
- ALL components define TypeScript interfaces
- ALL colors use CSS custom properties (no hardcoded values)
- ALL forms use VeeValidate validation

### NEVER DO
- Never use TailwindCSS v3 syntax (use v4 @config)
- Never bypass Supabase RLS policies
- Never use `any` type without justification
- Never hardcode colors (#15803d → use var(--brand))
- Never ignore error states in async operations

## 📁 PROJECT STRUCTURE
```
src/
├── components/ui/     # Base components (Button, Input)
├── components/        # App components (AppHeading, AppForm)
├── pages/            # File-based routing
├── stores/           # Pinia stores with cache validation
├── services/         # Supabase queries
├── types/            # TypeScript definitions
└── lib/              # Utilities (supabaseClient)
```

## 🎯 QUICK CHECKLIST
- [ ] Using TailwindCSS v4.1.3 syntax?
- [ ] RLS enabled on all tables?
- [ ] TypeScript interfaces defined?
- [ ] Error handling implemented?
- [ ] Cache validation in stores?
- [ ] CSS custom properties for colors?