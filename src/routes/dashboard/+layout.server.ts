import { eq, and, sql } from 'drizzle-orm'
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  user, persons } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({locals}) => {
	   if (!locals.user) {
        return redirect(302, '/login');
    }

	const dbUser = await db
  .select({
	id: user.id,
    roleId: user.roleId,
	name: user.name
  })
  .from(user)
  .where(eq(user.id, locals.user.id))
  .then(rows => rows[0]);


	const roleDetails =  await db.select(
		{id: user.id, 
		 name: user.name,
		 roleId: user.roleId
	})
		.from(user)
		.where(eq(user.id, dbUser.id)).then(rows => rows[0]);
	

  const today = new Date();
const month = today.getMonth() + 1; 
const day = today.getDate();

    const birthdayPerson = await db.select(
		 {
		 gender: persons.gender,
		 firstName: persons.firstName, 
		 lastName: persons.lastName,
		 birthday: persons.dateOfBirth,
		 phone: persons.phone,
		 type: persons.type,
		 age: sql`EXTRACT(YEAR FROM AGE(${persons.dateOfBirth}))`,
		}
	)
	.from(persons)
	.where(
  and(
    sql`EXTRACT(MONTH FROM ${persons.dateOfBirth}) = ${month}`,
    sql`EXTRACT(DAY FROM ${persons.dateOfBirth}) = ${day}`
  )
);
	

	return {
		
		role: dbUser,
		roleDetails,
		birthdayPerson
	};
};

