import { sql, eq } from 'drizzle-orm';
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  locations, students, persons, schools} from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_students';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see student. <br /> Talk to an admin to change it.');
  }
   
    try {
       const allStudents = await db
.select({
  id: students.id,
  firstName: persons.firstName,
  lastName: persons.lastName,
  gender: persons.gender,
  age: sql<number>`EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${persons.dateOfBirth}))`.as('age'),
  phone: persons.phone,
  grade: students.grade,
  naturalOrSocial: students.naturalOrSocial,
  location: locations.name,
  school: schools.name, 
  fee: students.fee,
  notes: students.notes,
  isActive: students.isActive
})
.from(students)
.innerJoin(persons, eq(students.personId, persons.id))
.innerJoin(schools, eq(students.school, schools.id)) 
.innerJoin(locations, eq(students.location, locations.id))
.orderBy(students.id);




        return {
            allStudents
        };
    } catch (error) {
        console.error('Failed to load students:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            allStudents: [],
            error: 'Failed to load Students'
        };
    }
};