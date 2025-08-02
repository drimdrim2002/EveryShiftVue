-- 최근 생성된 사용자 확인
SELECT 
  u.id, 
  u.email, 
  u.created_at as user_created,
  p.username,
  p.full_name,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC 
LIMIT 5;