import { eq, asc } from 'drizzle-orm';
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  user, permissions, specialPermissions, rolePermissions, roles, session} from '$lib/server/db/schema'


export const load: PageServerLoad = async ({params, locals}) => {
       if (!locals.user) {
        return redirect(302, '/login');
    }

    const {id} =  params;


   
    try {
const singleUser = await db
  .select({
    name: user.name,
    email: user.email,
    role: roles.name,
    isActive: user.isActive,
    created: user.createdAt,
    sessionExpiry: session.expiresAt
  })
  .from(user)
  .leftJoin(roles, eq(user.roleId, roles.id))
  .leftJoin(session, eq(session.userId, user.id))
  .where(eq(user.id, id))
  .orderBy(asc(session.expiresAt)) // pick the earliest expiry
  .limit(1) // just one row
  .then(rows => {
    if (!rows[0]) return null;

    return {
      ...rows[0],
      created: new Date(rows[0].created).toLocaleString(),
      sessionExpiry: rows[0].sessionExpiry
        ? new Date(rows[0].sessionExpiry).toLocaleString()
        : null
    };
  });

  const userRolePermissions = await db
  .select({
    id: rolePermissions.id,
    name: permissions.name,
    description: permissions.description
  })
  .from(rolePermissions)
  .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
  .leftJoin(roles, eq(rolePermissions.roleId, roles.id))
  .leftJoin(user, eq(user.roleId, roles.id)) // join user to filter by their role
  .where(eq(user.id, id));

   const userSpecialPermissions = await db
  .select({
    id: specialPermissions.id,
    name: permissions.name,
    description: permissions.description
  })
  .from(specialPermissions)
  .leftJoin(permissions, eq(specialPermissions.permissionId, permissions.id))
  .leftJoin(user, eq(user.id, specialPermissions.userId)) // join user to filter by their role
  .where(eq(user.id, id));






    





        return {
            singleUser,
            userRolePermissions,
            userSpecialPermissions
        };
    } catch (error) {
        console.error('Failed to load User:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            singleUser: [],
            error: 'Failed to load User'
        };
    }
};




   