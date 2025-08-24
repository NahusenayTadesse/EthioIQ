import { sql, eq, count } from 'drizzle-orm';
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  locations, persons, tutors, tutorStudentMatches} from '$lib/server/db/schema'


export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_tutors';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see student tutors. <br /> Talk to an admin to change it.');
  }


   
    try {
       const alltutors = await db
  .select({
    id: tutors.id,
    firstName: persons.firstName,
    lastName: persons.lastName,
    gender: persons.gender,
    age: sql<number>`EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${persons.dateOfBirth}))`.as('age'),
    naturalOrSocial: tutors.naturalOrSocial,
    qualification: tutors.qualifications,
    location: locations.name,
    hourlyRate: tutors.hourlyRate,
    studentCount: count(tutorStudentMatches.studentId).as('studentCount'),
    experience: tutors.experience,
    gradePreference: tutors.gradePreference,
    notes: tutors.notes,
    isActive: tutors.isActive
  })
  .from(tutors)
  .innerJoin(persons, eq(tutors.personId, persons.id))
  .innerJoin(locations, eq(tutors.location, locations.id))
  .leftJoin(tutorStudentMatches, eq(tutors.id, tutorStudentMatches.tutorId)) 
  .groupBy(
    tutors.id,
    persons.firstName,
    persons.lastName,
    persons.gender,
    persons.dateOfBirth,
    tutors.naturalOrSocial,
    tutors.qualifications,
    locations.name,
    tutors.hourlyRate,
    tutors.experience,
    tutors.notes,
    tutors.isActive
  )
  .orderBy(tutors.id);





        return {
            alltutors
        };
    } catch (error) {
        console.error('Failed to load students:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            alltutors: [],
            error: 'Failed to load Students'
        };
    }
};