import { count, eq, sql, and } from 'drizzle-orm';
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { alias } from 'drizzle-orm/pg-core'; 


import {  persons,  students,  tutoringSessions,  studentParentRelations, parents } from '$lib/server/db/schema'


export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_payments';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see student payments. <br /> Talk to an admin to change it.');
  }

    try { 

        // Get number of sessions per tutor
        // const tutorSessionCounts = await db
        //     .select({
        //     tutorId: tutors.id,
        //     sessionCount: sql`COUNT(${tutoringSessions.id})`
        //     })
        //     .from(tutoringSessions)
        //     .innerJoin(tutors, eq(tutoringSessions.tutorId, tutors.id))
        //     .where(eq(tutoringSessions.status, 'completed'))
        //     .groupBy(tutors.id);

// import your tables from schema:

const parentPersons = alias(persons, 'parentPersons'); // make an alias of persons

const studentsFees = await db.select({
  id: students.id,
  studentFirstName: persons.firstName,
  studentLastName: persons.lastName,
  studentPhone: persons.phone,

  parentFirstName: parentPersons.firstName,
  parentLastName: parentPersons.lastName,
  parentPhone: parentPersons.phone,

  fee: students.fee,
  totalRecurredFees: sql`SUM(COALESCE(${tutoringSessions.payableHours}, 0))`.as('totalRecurredFees'),
  payment: sql`ROUND(SUM(${students.fee} * COALESCE(${tutoringSessions.payableHours}, 0)), 2)`.as('payment'),
  numberOfSessions: count(tutoringSessions.id).as('numberOfSessions'),
})
.from(tutoringSessions)
.innerJoin(students, eq(tutoringSessions.studentId, students.id))
.innerJoin(persons, eq(students.personId, persons.id)) // student’s person record
.innerJoin(
  studentParentRelations,
  and(
    eq(studentParentRelations.studentId, students.id),
    eq(studentParentRelations.isPrimary, true),   // ✅ only primary parent
  )
)
.innerJoin(parents, eq(studentParentRelations.parentId, parents.id))
.innerJoin(parentPersons, eq(parents.personId, parentPersons.id)) // parent’s person record
.where(and(
  eq(tutoringSessions.paidStatus, 'false'),
  eq(tutoringSessions.status, 'completed'),
))
.groupBy(
  students.id,
  persons.firstName,
  persons.lastName,
  persons.phone,
  students.fee,
  parentPersons.firstName,
  parentPersons.lastName,
  parentPersons.phone,
);
        function to12Hour(dateStr: string | null) {
            if (!dateStr) return null;
            const date = new Date(dateStr);
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
            const mins = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${mins} ${ampm}`;
        }

       

        return {
            studentsFees
        };
    } catch (error) {
        console.error("Error fetching tutor sessions:", error);
        return {
            tutorSessions: [],
            error: "Failed to load tutor sessions."
        };
    }

}