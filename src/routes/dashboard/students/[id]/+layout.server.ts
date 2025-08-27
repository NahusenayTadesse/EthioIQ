

import { eq, sql } from 'drizzle-orm';
import type { LayoutDataServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  persons, parents, studentParentRelations, tutors, students, subjects, locations, schools, tutorStudentMatches, subjectStudents, assessmentResults } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit';


export const load: LayoutDataServerLoad = async ({params}) => {
    
    const {id} =  params;

   
    try {
       const student = await db
 .select({
   id: students.id,
   firstName: persons.firstName,
   lastName: persons.lastName,
   gender: persons.gender,
   phone: persons.phone,
   age: sql<number>`EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${persons.dateOfBirth}))`.as('age'),
   grade: students.grade,
   naturalOrSocial: students.naturalOrSocial,
   location: locations.name,
   school: schools.name, 
   fee: students.fee,
   specificLocation: students.specificLocation,
   notes: students.notes,
   isActive: students.isActive,
   image: persons.image
 })
 .from(students)
 .innerJoin(persons, eq(students.personId, persons.id))
 .innerJoin(schools, eq(students.school, schools.id)) 
 .innerJoin(locations, eq(students.location, locations.id))
 .orderBy(students.id)
.where(eq(students.id, id)).then(rows => rows[0]); 

if (!student) {
			error(404, 'Student not found');
		}

  const parent = await db.select({
      id: parents.id,
      firstName: persons.firstName,
      lastName: persons.lastName,
      phone: persons.phone,
      gender: persons.gender,
      notes: parents.notes,
      isPrimary: studentParentRelations.isPrimary,
      isActive: parents.isActive
       
    })
    .from(studentParentRelations)
    .innerJoin(parents, eq(studentParentRelations.parentId, parents.id))
    .innerJoin(persons, eq(parents.personId, persons.id))
    .where(eq(studentParentRelations.studentId, id));

     const matches = await db.select({
          id: tutors.id,
          firstName: persons.firstName,
          lastName: persons.lastName,
          phone: persons.phone,
          gender: persons.gender,
          subject: subjects.name,
          qualifications: tutors.qualifications,
          hourlyRate: tutors.hourlyRate,
          experience: tutors.experience,
          matchDate: tutorStudentMatches.matchDate,
          notes: tutors.notes,
          isActive: tutors.isActive
           
        })
        .from(tutorStudentMatches)
        .innerJoin(tutors, eq(tutorStudentMatches.tutorId, tutors.id))
        .innerJoin(subjects, eq(subjects.id, tutorStudentMatches.subjectId))
        .innerJoin(persons, eq(tutors.personId, persons.id))
        .where(eq(tutorStudentMatches.studentId, id));

        const subjectforStudentRaw = await db.select({
            id: subjectStudents.id,
            name: subjects.name,
            proficiencyLevel: subjectStudents.proficiencyLevel,
            startedAt: subjectStudents.startedAt,
            assessmentResult: assessmentResults.score,
            stoppedAt: subjectStudents.stoppedAt,
            cancelReason: subjectStudents.cancelReason,
            notes: subjectStudents.notes,
            isActive: subjectStudents.isActive
        })
        .from(subjectStudents)
        .innerJoin(subjects, eq(subjectStudents.subjectId, subjects.id))
        .leftJoin(assessmentResults, eq(subjectStudents.assessmentResultsId, assessmentResults.id))
        .where(eq(subjectStudents.studentId, id));


        


        // Format dates to day/month/year
        const formatDate = (date: Date | null) => {
            if (!date) return null;
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const subjectforStudent = subjectforStudentRaw.map(s => ({
            ...s,
            startedAt: formatDate(s.startedAt),
            stoppedAt: formatDate(s.stoppedAt)
        }));

        const locationBranches = await db.select({
            id: locations.id,
            name: locations.name,
            branches: locations.branches,
        }).from(locations);

        return {
            
            student,
            parent,
            matches,
            subjectforStudent
        };
    } catch (error) {
        console.error('Failed to load Student:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            parent: [],
            student: [],
            matches: [],
            subjectforStudent: [],
            error: 'Failed to load student'
            
        };
    }
};