import { fail, redirect } from '@sveltejs/kit';
// import * as auth from '$lib/server/auth';
// import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { roles, rolePermissions, permissions} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';



export const load: PageServerLoad = async ({locals}) => {
    if (!locals.user) {
        return redirect(303, '/login');
    }

  try {
    const allRoles = await db.select( {
         id: roles.id,
         name: roles.name,
         description: roles.description 
    }).from(roles).orderBy(roles.id);


    const allPermissions = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description
      })
      .from(permissions)
      .orderBy(permissions.id);

    return {
      allPermissions,
      allRoles
    };
  } catch (error) {
    console.error('Database error:', error);
    return fail(500, { message: 'Failed to fetch permissions' });
  }
}

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      const formData = await request.formData();

      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const permissionIds = formData
        .getAll("permissions[]")
        .map((v) => Number(v));


          if (!name || !description) {
        return fail(400, {
          success: false,
          message: "Name and description are required.",
          values: { name, description, permissionIds }
        });
      }

      if (permissionIds.length === 0) {
        return fail(400, {
          success: false,
          message: "At least one permission must be selected.",
          values: { name, description, permissionIds }
        });
      }

      const [role] = await db
        .insert(roles)
        .values({ name, description })
        .returning();

      await db.insert(rolePermissions).values(
        permissionIds.map((permId) => ({
          roleId: role.id,
          permissionId: permId,
        }))
      );

      // ✅ Return success message
      return {
        success: true,
        message: "Role created successfully!",
        role,
      };
    } catch (error) {
      console.error("Error creating role:", error);

      // ❌ Return error message
      return {
        success: false,
        message: "Failed to create role. Please try again.",
        error: String(error),
      };
    }
  },
};
