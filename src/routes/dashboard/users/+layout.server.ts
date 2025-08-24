import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { user, roles} from '$lib/server/db/schema'
import { error } from '@sveltejs/kit';



export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_users';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see users.<br /> Talk to an admin to change it.');
  }

   
    try {
  const users = db.select({
  id: user.id,
  userName: user.name,
  email: user.email,
  role: roles.name,
  isActive: user.isActive,
})
.from(user)
.leftJoin(roles, eq(user.roleId, roles.id))
.orderBy(desc(user.createdAt));


  



        return {
            users
        };
    } catch (error) {
        console.error('Failed to load users:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            users: [],
            allPermissions: [],
            error: 'Failed to load users'
        };
    }
};

