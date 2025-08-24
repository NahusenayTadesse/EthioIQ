import { eq, and, sql } from 'drizzle-orm'
import { fail, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  user, persons,  rolePermissions, specialPermissions, roles, permissions } from '$lib/server/db/schema'

export const load: LayoutServerLoad = async ({ locals }) => {
	try {
		// auth check
		if (!locals.user) {
			throw redirect(302, '/login');
		}


		const roleList = await db
  .select({ name: permissions.name })
  .from(user)
  .innerJoin(roles, eq(user.roleId, roles.id))
  .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
  .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
  .where(eq(user.id, locals.user.id));

    const specialList = await db
  .select({ name: permissions.name })
  .from(specialPermissions)
  .innerJoin(permissions, eq(specialPermissions.permissionId, permissions.id))
  .where(eq(specialPermissions.userId, locals.user.id));

// decide which list to use
let permList: Array<{ name: string }>;
if (specialList.length) {
  permList = specialList;
} else {
  permList = roleList;
}
			  

		// user details
		const dbUser = await db
			.select({
				id: user.id,
				roleId: user.roleId,
				name: user.name
			})
			.from(user)
			.where(eq(user.id, locals.user.id))
			.then((rows) => rows[0]);

		
		// role details
		const roleDetails = await db
			.select({
				id: user.id,
				name: user.name,
				roleId: user.roleId
			})
			.from(user)
			.where(eq(user.id, dbUser.id))
			.then((rows) => rows[0]);

		// birthday check
		const today = new Date();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		const birthdayPerson = await db
			.select({
				gender: persons.gender,
				firstName: persons.firstName,
				lastName: persons.lastName,
				birthday: persons.dateOfBirth,
				phone: persons.phone,
				type: persons.type,
				age: sql`EXTRACT(YEAR FROM AGE(${persons.dateOfBirth}))`
			})
			.from(persons)
			.where(
				and(
					sql`EXTRACT(MONTH FROM ${persons.dateOfBirth}) = ${month}`,
					sql`EXTRACT(DAY FROM ${persons.dateOfBirth}) = ${day}`
				)
			);

		return {
			permList,
			role: dbUser,
			roleDetails,
			birthdayPerson
		};
	} catch (err) {
		console.error('Error in load function:', err);

		// redirect errors should just bubble up
		if (err instanceof Response) throw err;

		return fail(500, {
			message: 'Something went wrong while loading data',
			error: (err as Error).message
		});
	}
};
