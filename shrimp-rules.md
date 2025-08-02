# EveryShift - AI Development Guidelines

## Project Overview

### Core Purpose
- **EveryShift**: Cloud-based shift scheduling system for 24/7 organizations
- **Target Users**: Hospitals, police stations, fire departments, factories
- **Architecture**: Frontend (Vue3) ↔ Backend (Supabase) ↔ AI Solver (Google Cloud Run/Java)
- **Key Challenge**: Solve Employee Rostering Problem with AI optimization (OptaPlanner)

### Business Domain Context
- **Constraint-based scheduling**: Holidays, labor laws, personal preferences, fatigue management
- **Multi-site organizations**: Different departments within same workplace
- **Skill-based matching**: Match specific expertise to shifts (e.g., orthopedics, emergency)
- **Credit system**: Employees spend credits to avoid undesired shifts

### Technology Stack

#### Frontend Stack
- **Vue 3.5.13**: Composition API, `<script setup>` syntax mandatory
- **TailwindCSS 4.1.3**: Use v4 syntax with `@config`, CSS custom properties for colors  
- **TypeScript 5.7.3**: Strict mode enabled, interface definitions required
- **Vite 6.3.5**: Build tool with hot reload
- **Pinia 3.0.1**: State management with cache validation pattern (15min expiration)
- **Vue Router 4.5.1**: File-based routing with `unplugin-vue-router`
- **VeeValidate**: Form validation with custom rules
- **PrimeVue 4.3.7**: Primary UI component library
- **Radix Vue 1.9.9**: Low-level component primitives
- **VueUse 12.7.0**: Composition utilities

#### Backend Stack
- **Supabase 2.53.0**: Primary backend service
- **PostgreSQL**: Database via Supabase
- **Row Level Security (RLS)**: MANDATORY for all tables
- **Supabase Auth**: JWT-based authentication
- **Realtime**: WebSocket connections for live updates

#### AI Solver Stack
- **Google Cloud Run**: Container hosting for AI solver
- **Java**: AI solver implementation language  
- **OptaPlanner**: Constraint solving engine for shift optimization
- **REST API**: JSON communication between frontend and solver

#### Development Tools
- **ESLint**: Code linting with auto-fix
- **Prettier**: Code formatting
- **hCaptcha**: Security integration
- **TypeScript**: Strict type checking
- **Vite DevTools**: Development debugging

#### Version Constraints
> **CRITICAL**: See `CLAUDE_RULES.md` for detailed technical patterns and implementation examples. This document focuses on EveryShift-specific business logic and AI development guidance.

## Database Design Rules

### Schema Extension Strategy
- **NEVER modify existing tables**: `profiles`, `entities`, `sub_entities`, `keep_alive`
- **CREATE new domain tables**: `organizations`, `employees`, `shifts`, `schedules`, `preferences`
- **USE existing `profiles` table**: Link to new employee records via foreign key
- **MAINTAIN backward compatibility**: Keep existing boilerplate functionality

### Required New Tables
```sql
-- Core EveryShift tables to CREATE
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  workplace_type text CHECK (workplace_type IN ('hospital', 'factory', 'police_fire')),
  shift_pattern text NOT NULL, -- '3shifts' or custom JSON
  created_at timestamptz DEFAULT now()
);

CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id),
  organization_id uuid REFERENCES organizations(id),
  role text CHECK (role IN ('superuser', 'manager', 'employee')),
  position text,
  skills text[], -- Array of specializations
  credits integer DEFAULT 0,
  status text DEFAULT 'pending_approval'
);

CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  site_name text NOT NULL,
  date date NOT NULL,
  shift_type text NOT NULL, -- 'day', 'night', 'evening'
  required_skills jsonb, -- {skill: count} pairs
  assigned_employees uuid[]
);
```

### RLS Policy Pattern
```sql
-- ALWAYS enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_members_only" ON organizations 
FOR ALL TO authenticated 
USING (id IN (SELECT organization_id FROM employees WHERE profile_id = auth.uid()));
```

## Authority System Implementation

### Role Hierarchy Rules
- **Superuser**: Access to ALL organizations, approve managers
- **Manager**: Access to OWN organization only, approve employees, manage schedules
- **Employee**: Access to own data only, submit preferences

### Role-Based Access Control
```typescript
// IMPLEMENT in composables/useAuth.ts
export const useAuth = () => {
  const checkRole = (requiredRole: 'superuser' | 'manager' | 'employee') => {
    // Logic to verify user role from employees table
  }
  
  const canAccessOrganization = (orgId: string) => {
    // Role-based organization access logic
  }
}
```

### Route Protection Pattern
```typescript
// APPLY to all protected routes
// src/router/index.ts
{
  path: '/admin/organizations',
  component: () => import('@/pages/admin/organizations.vue'),
  beforeEnter: requireRole(['superuser', 'manager'])
}
```

## Scheduling System Rules

### Data Flow Architecture
1. **Input Collection**: Employee preferences → `preferences` table
2. **Constraint Setup**: Site requirements → `shifts` table  
3. **AI Processing**: Call Google Cloud Run solver
4. **Result Storage**: Generated schedule → `schedules` table
5. **Manual Adjustments**: Override solver results with conflict detection

### AI Solver Integration
```typescript
// CREATE new service: src/services/ai-solver.ts
export const callAISolver = async (scheduleRequest: ScheduleRequest) => {
  const response = await fetch('https://your-cloud-run-url.run.app/solve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheduleRequest)
  })
  return response.json()
}
```

### Preference Management
```typescript
// CREATE new store: src/stores/preferences.ts
export const usePreferencesStore = defineStore('preferences', () => {
  const submitUnavailableDate = async (date: string, isVacation: boolean) => {
    // If not vacation, deduct credit
    if (!isVacation) {
      await deductCredit()
    }
    // Store preference
  }
})
```

## UI/UX Implementation Rules

### Navigation Structure
```
- Landing Page (public)
- Auth Pages (login/register with role selection)
- Dashboard (role-based)
  - Superuser: All organizations view
  - Manager: Organization management + scheduling
  - Employee: Personal schedule + preferences
```

### Calendar Component Requirements
- **Dual View Mode**: Toggle between "By Employee" and "By Site"
- **Color Coding**: Preferences (green/red), assignments (blue), conflicts (orange)
- **Interactive**: Click to edit assignments, drag-drop for swaps
- **Real-time Updates**: WebSocket or polling for schedule changes

### Form Patterns
```vue
<!-- Manager Registration Form -->
<script setup lang="ts">
interface ManagerRegistrationData {
  nickname: string
  organizationName: string // IMMUTABLE after creation
  workplaceType: 'hospital' | 'factory' | 'police_fire' // IMMUTABLE
  shiftPattern: string
  sites: string[]
  skillCategories: string[]
}
</script>
```

## File Interaction Rules

### Multi-file Coordination
- **Database Changes**: Update migration file + types/DatabaseTypes.ts + services/supabase-queries.ts
- **New Features**: Component + Store + Service + Route + Type definitions
- **Auth Changes**: Modify auth.ts store + router guards + layout components

### Component Creation Pattern
```
New Feature Implementation:
1. CREATE types/[FeatureName].ts - Interface definitions
2. CREATE services/[feature]-queries.ts - Database operations  
3. CREATE stores/[feature].ts - State management with cache validation
4. CREATE components/[Feature]*.vue - UI components
5. CREATE pages/[feature]/ - Route pages
6. UPDATE router/index.ts - Add routes with guards
```

### Store Dependencies
- **Authentication Required**: All stores MUST check auth status
- **Cache Validation**: Use 15-minute cache pattern from existing stores
- **Error Handling**: Follow error.ts store pattern for consistent UX

## Google Cloud Run Integration

### API Communication Pattern
```typescript
// src/services/cloud-run-api.ts
const CLOUD_RUN_BASE_URL = import.meta.env.VITE_CLOUD_RUN_URL

export const scheduleAPI = {
  solve: async (input: SchedulingInput) => {
    // Transform Vue/Supabase data to Java format
    const javaRequest = transformToJavaFormat(input)
    const response = await fetch(`${CLOUD_RUN_BASE_URL}/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify(javaRequest)
    })
    return transformFromJavaFormat(await response.json())
  }
}
```

### Data Transformation Rules
- **Frontend → AI Solver**: Convert Vue/TypeScript objects to Java-compatible JSON
- **AI Solver → Frontend**: Parse Java response back to TypeScript interfaces
- **Error Handling**: Map Java exceptions to user-friendly messages
- **Timeout Management**: 60-second timeout for solver calls

## Critical Business Logic Rules

### Credit System
- **Credit Deduction**: Only for non-vacation unavailable dates
- **Credit Limits**: Enforce per-role credit limits set by manager
- **Credit Tracking**: Log all credit transactions for audit

### Conflict Detection
```typescript
// IMPLEMENT conflict checking
const detectScheduleConflicts = (schedule: Schedule) => {
  return {
    understaffed: checkUnderstaffedShifts(schedule),
    skillMismatch: checkSkillRequirements(schedule),
    consecutiveShifts: checkConsecutiveWorkDays(schedule),
    doubleBooking: checkDoubleBookings(schedule)
  }
}
```

### Approval Workflows
- **Manager Registration**: Requires superuser approval
- **Employee Registration**: Requires manager/superuser approval  
- **Schedule Changes**: Auto-save drafts, publish requires manager approval

## Development Constraints

### What You MUST Do
- **Extend existing architecture**: Build on profiles/entities pattern
- **Maintain role separation**: Strict RBAC implementation
- **Validate all scheduling constraints**: Before calling AI solver
- **Implement proper error boundaries**: For AI solver failures
- **Cache scheduling results**: Expensive AI operations need caching
- **Log scheduling decisions**: For audit and debugging

### What You MUST NOT Do
- **NEVER bypass role checks**: All operations must verify permissions
- **NEVER modify core boilerplate**: Keep existing functionality intact
- **NEVER hardcode organization data**: Everything must be configurable
- **NEVER skip conflict validation**: Manual changes must be validated
- **NEVER expose solver implementation**: Keep AI logic abstracted
- **NEVER ignore credit limits**: Credit system is core business rule

### Integration Testing Requirements
- **Auth Flow**: Test all three role registration/approval flows
- **Scheduling Pipeline**: Input → AI Solver → Result → Storage → Display
- **Conflict Resolution**: Manual override + automatic conflict detection
- **Multi-organization**: Ensure data isolation between organizations

## Quick Decision Tree

### When Adding New Feature
1. **Is it schedule-related?** → Add to scheduling pipeline
2. **Is it role-specific?** → Add role checks + route guards  
3. **Is it organization-specific?** → Add organization scoping
4. **Does it need AI?** → Integrate with Cloud Run API
5. **Is it real-time?** → Consider WebSocket implementation

### When Database Changes Needed
1. **New entity?** → Create table + RLS + types + queries + store
2. **Relationship change?** → Update foreign keys + migration + types
3. **Permission change?** → Update RLS policies + role checks

## Related Documentation

- **`CLAUDE_RULES.md`**: Technical implementation patterns, code structure, and framework-specific guidelines
- **`SECURITY_RULES.md`**: Security policies, authentication flows, and data protection requirements
- **`docs/first.prd`**: Product requirements document with detailed business specifications

This document provides AI-specific guidance for developing EveryShift features while maintaining consistency with the existing Vue/Supabase boilerplate architecture.