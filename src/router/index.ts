// the import below requires the following line
// to be added to `env.d.ts` to register the global
// typed in the IDE.
// otherwise, there will be an TS error.
//
// <reference types="unplugin-vue-router/client" />
import { RouterPathEnum } from '@/types/RouterPathEnum'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import type { UserRole } from '@/composables/useRoleAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Routes that don't require authentication
const routesSkippingGetSession = [
  RouterPathEnum.Login as string,
  RouterPathEnum.Register as string,
  RouterPathEnum.KeepSupabaseAlive as string,
]

// Routes that require authentication but not approval
const routesForPendingApproval = [
  RouterPathEnum.PendingApproval as string,
  RouterPathEnum.Unauthorized as string,
  RouterPathEnum.Logout as string,
]

// Role-based route access control
interface RouteRequirement {
  path: string
  roles: UserRole[]
  exactMatch?: boolean
}

const roleBasedRoutes: RouteRequirement[] = [
  // Admin routes - Superuser and Manager only
  { path: '/admin', roles: ['superuser', 'manager'] },
  { path: '/admin/', roles: ['superuser', 'manager'] },
  
  // Scheduling routes - Manager only (they create schedules)
  { path: '/scheduling', roles: ['manager', 'superuser'] },
  { path: '/scheduling/', roles: ['manager', 'superuser'] },
  
  // Organization routes - All approved users
  { path: '/organization', roles: ['superuser', 'manager', 'employee'] },
  { path: '/organization/', roles: ['superuser', 'manager', 'employee'] },
  
  // Dashboard routes - All approved users
  { path: '/dashboard', roles: ['superuser', 'manager', 'employee'] },
  { path: '/dashboard/', roles: ['superuser', 'manager', 'employee'] },
  
  // Settings - Manager and above for organization settings
  { path: '/settings', roles: ['superuser', 'manager', 'employee'] },
  { path: '/settings/', roles: ['superuser', 'manager', 'employee'] },
]

/**
 * Check if a route requires specific roles
 * @param path Current route path
 * @returns Route requirement or null if no restriction
 */
const getRouteRequirement = (path: string): RouteRequirement | null => {
  return roleBasedRoutes.find(route => {
    if (route.exactMatch) {
      return route.path === path
    }
    return path.startsWith(route.path)
  }) || null
}

/**
 * Get default redirect path based on user role
 * @param role User role
 * @returns Default redirect path
 */
const getDefaultRedirectByRole = (role: UserRole): string => {
  switch (role) {
    case 'superuser':
      return RouterPathEnum.Admin as string
    case 'manager':
      return RouterPathEnum.Dashboard as string
    case 'employee':
      return RouterPathEnum.Dashboard as string
    default:
      return RouterPathEnum.Home as string
  }
}

router.beforeEach(async (to, _from) => {
  // TODO > disable code below if not using dummy auth
  //const { user, setAuth } = useAuthStore()
  // setAuth({ session: { user } })
  // TODO > Enable code below handle Guest vs Authenticated users
  // Must wait for the session to be available before processing the routing...
  const authStore = useAuthStore()
  await authStore.getSession()

  const { user: authenticatedUser, employee, isPending, isRejected, isApproved } = storeToRefs(authStore)
  const isAuthPage = routesSkippingGetSession.includes(to.path)
  const isPendingRoute = routesForPendingApproval.includes(to.path)

  // 1. Handle unauthenticated users
  if (!authenticatedUser.value && !isAuthPage) {
    return RouterPathEnum.Login as string
  }

  // 2. Redirect authenticated users away from auth pages (unless pending approval)
  if (authenticatedUser.value && isAuthPage && !isPending.value) {
    // If user has employee info, redirect to role-based default
    if (employee.value && isApproved.value) {
      return getDefaultRedirectByRole(employee.value.role)
    }
    return RouterPathEnum.Home as string
  }

  // 3. Handle users without employee info (not EveryShift users)
  if (authenticatedUser.value && !employee.value && !isAuthPage && !isPendingRoute) {
    // Allow access to basic pages for non-EveryShift users
    const allowedPagesForNonEveryShift = [
      RouterPathEnum.Home as string,
      RouterPathEnum.Profile as string,
      RouterPathEnum.StyleGuide as string,
      RouterPathEnum.Entities as string,
      RouterPathEnum.SubEntities as string,
    ]
    
    if (!allowedPagesForNonEveryShift.some(page => to.path.startsWith(page))) {
      return RouterPathEnum.Unauthorized as string
    }
  }

  // 4. Handle pending approval users
  if (authenticatedUser.value && employee.value && isPending.value) {
    if (!isPendingRoute) {
      return RouterPathEnum.PendingApproval as string
    }
    // Allow access to pending approval routes
    return
  }

  // 5. Handle rejected users
  if (authenticatedUser.value && employee.value && isRejected.value) {
    if (!isPendingRoute) {
      return RouterPathEnum.PendingApproval as string
    }
    // Allow access to pending approval routes (will show rejection message)
    return
  }

  // 6. Handle role-based access control for approved users
  if (authenticatedUser.value && employee.value && isApproved.value) {
    const routeRequirement = getRouteRequirement(to.path)
    
    if (routeRequirement) {
      const hasAccess = authStore.checkRole(routeRequirement.roles)
      
      if (!hasAccess) {
        return RouterPathEnum.Unauthorized as string
      }
    }
  }

  // 7. Allow access if no restrictions apply
  return
})

export default router
