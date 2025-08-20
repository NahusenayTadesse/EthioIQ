

import { eq } from 'drizzle-orm';
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  persons, parents, studentParentRelations, students } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ locals, params}) => {
       if (!locals.user) {
        return redirect(302, '/login');
    }

    const {id} =  params;

   
    try {
       const parent = await db
 .select(
    {
     firstName: persons.firstName,
     lastName: persons.lastName,
     gender: persons.gender,
     phone: persons.phone,
     notes: parents.notes,
     birthday: persons.dateOfBirth,
     address: persons.address,
     isActive: parents.isActive
    })
  .from(parents)
  .innerJoin(persons, eq(parents.personId, persons.id))
  .where(eq(parents.id, id)).then(rows => rows[0]); 

  const children = await db.select({
      id: students.id,
      firstName: persons.firstName,
      lastName: persons.lastName,
      dateOfBirth: persons.dateOfBirth,
      gender: persons.gender,
      grade: students.grade,
      naturalOrSocial: students.naturalOrSocial,
      school: students.school,
      notes: students.notes,
      isActive: students.isActive
       
    })
    .from(studentParentRelations)
    .innerJoin(students, eq(studentParentRelations.studentId, students.id))
    .innerJoin(persons, eq(students.personId, persons.id))
    .where(eq(studentParentRelations.parentId, id));

        return {
            parent,
            children
        };
    } catch (error) {
        console.error('Failed to load parent:', error);


        return {
            parent: [],
            children: [],
            error: 'Failed to load parent'
            
        };
    }
};