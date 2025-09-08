import { error, fail } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { createRoleSchema, createSubjectSchema } from '$lib/server/zodschema';
import { db } from '$lib/server/db';
import { roles, rolePermissions, permissions, locations, subjects} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({parent}) => {
  const layoutData = await parent();
    const permList = layoutData.permList;
    const perm = 'can_create_users';
  
    if (!permList || !permList.some(p => p.name === perm)) {
        error(403, 'Not Allowed! You do not have permission to create users. <br /> Talk to an admin to change it.');
    }

  try {
    const allRoles = await db.select( {
         id: roles.id,
         name: roles.name,
         description: roles.description 
    }).from(roles).orderBy(roles.id);


      const allSubjects = await db.select( {
         id: subjects.id,
         name: subjects.name,
         description: subjects.description 
    }).from(subjects).orderBy(subjects.id);

   const allLocations = await db.select( {
         id:locations.id,
         name: locations.name,
         description: locations.branches 
    }).from(locations).orderBy(locations.id);


    const allPermissions = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description
      })
      .from(permissions)
      .orderBy(permissions.id);

    const roleForm = await superValidate(zod4(createRoleSchema))
    const subjectForm = await superValidate(zod4(createSubjectSchema))

    return {
      allPermissions,
      allRoles,
      allSubjects,
      allLocations,
      roleForm,
      subjectForm
    };
  } catch (error) {
    console.error('Database error:', error);
    return fail(500, { message: 'Failed to fetch data from the database.' });
  }
}

import { setFlash} from 'sveltekit-flash-message/server';


export const actions: Actions = {
  addRole: async ({ request, cookies }) => {
    
      const formData = await request.formData();
      const form = await superValidate(formData, zod4(createRoleSchema));

      if (!form.valid) {
      setFlash({ type: 'error', message: "Error! Please check the form for errors" }, cookies);
      return fail(400, { form });
    }

      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const permissionIds = formData
        .getAll("permissions")
        .map((v) => Number(v));


    

     try {
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

      setFlash({ type: 'success', message: `Role created successfully!` }, cookies);
    } catch (error) {
      console.error("Error creating role:", error);
        const errMsg =  error?.toString?.() || "";

      if(errMsg.includes("roles_name_unique")){

         setFlash({ type: 'error', message: `Error! ${name} already exists` }, cookies);
      return fail(400, { form });
      }
       
    

      setFlash({ type: 'error', message: "Error! " + error }, cookies);
      return fail(400, { form });
    }
  },

  addSubject: async ({ request, cookies }) => {

      const formData = await request.formData();
       const form = await superValidate(formData, zod4(createSubjectSchema));

      if (!form.valid) {
      setFlash({ type: 'error', message: "Error! Please check the form for errors" }, cookies);
      return fail(400, { form });
    }


      const name = formData.get("name") as string;
      const description = formData.get("description") as string;

      //     if (!name || !description) {
      //   return fail(400, {
      //     success: false,
      //     message: "Name and description are required.",
      //     values: { name, description}
      //   });
      // }

    try{
   await db
        .insert(subjects)
        .values({ name, description });


    setFlash({ type: 'success', message: `Subject created successfully!` }, cookies);

    } catch (error) {
      console.error("Error creating subject:", error);
        const errMsg =  error?.toString?.() || "";

      if(errMsg.includes("subjects_name_unique")){

         setFlash({ type: 'error', message: `Error! ${name} already exists` }, cookies);
      return fail(400, { form });
      }
       
    

      setFlash({ type: 'error', message: "Error! " + error }, cookies);
      return fail(400, { form });
    }
  },
  
  
  }
