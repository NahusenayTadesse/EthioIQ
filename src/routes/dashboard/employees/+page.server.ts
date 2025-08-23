import { asc, eq } from 'drizzle-orm';
import {  error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { employees, persons } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_employees';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see employees. Talk to an admin to change it.');
  }


   
    try {
       const employeeList = await db
 .select({
    id: employees.id,
    firstName: persons.firstName,
    lastName: persons.lastName,
    gender: persons.gender,
    phone: persons.phone,
    position: employees.position,
    isActive: employees.isActive
  })
  .from(employees)
  .innerJoin(persons, eq(employees.personId, persons.id))
  .where(eq(persons.type, 'employee')).orderBy(asc(employees.id));

  const positionList = await db.select({position: employees.position}).from(employees);

   
        return {
            employeeList,
            positionList
        };
    } catch (error) {
        console.error('Failed to load employees:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            employeeList: [],
            error: 'Failed to load employees'
        };
    }
};