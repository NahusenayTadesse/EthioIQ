import { desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { user, roles} from '$lib/server/db/schema'
import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';


export const load: PageServerLoad = async ({locals}) => {
       if (!locals.user) {
        return redirect(302, '/login');
    }

   
    try {
  const users = db.select({
  id: user.id,
  name: user.name,
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

export const actions: Actions = {
    logout: async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(event.locals.session.id);
        auth.deleteSessionTokenCookie(event);

        return redirect(302, '/login');
    }
};