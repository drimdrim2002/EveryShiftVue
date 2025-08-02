export enum RouterPathEnum {
  Home = '/',
  Entities = '/entities',
  SubEntities = '/sub-entities',
  Settings = '/settings',
  Profile = '/profile',
  Login = '/login',
  Logout = '/logout',
  Register = '/register',
  // Only used to keep the Supabase project alive.
  KeepSupabaseAlive = '/keep-supabase-alive',
  // To showcase the style guide
  StyleGuide = '/style-guide',
  
  // EveryShift specific routes
  PendingApproval = '/pending-approval',
  Unauthorized = '/unauthorized',
  Admin = '/admin',
  Organization = '/organization',
  Scheduling = '/scheduling',
  Dashboard = '/dashboard',
}
