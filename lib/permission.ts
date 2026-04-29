type Role = 'staff' | 'user';

const permissions: Record<Role, string[]> = {
  staff: ['view_analytics'],
  user: [],
};

export function hasPermission(role: string, action: string): boolean {
  return permissions[role as Role]?.includes(action) ?? false;
}