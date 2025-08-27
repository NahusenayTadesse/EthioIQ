

import { eq, sql } from 'drizzle-orm';
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  persons, tutors, students, locations, tutorStudentMatches, subjectTutors, subjects, fieldOfStudy, personPaymentMethods, paymentMethods } from '$lib/server/db/schema'


export const load: PageServerLoad = async ({params, locals}) => {
       if (!locals.user) {
        return redirect(302, '/login');
    }

    const {id} =  params;

   
    try {
       const tutor = await db
 .select({
    id: tutors.id,
    firstName: persons.firstName,
    lastName: persons.lastName,
    gender: persons.gender,
    age: sql<number>`EXTRACT(YEAR FROM AGE(CURRENT_DATE, ${persons.dateOfBirth}))`.as('age'),
    phone: persons.phone,
    naturalOrSocial: tutors.naturalOrSocial,
    qualification: tutors.qualifications,
    location: locations.name,
    specificLocation: tutors.specificLocation,
    hourlyRate: tutors.hourlyRate,
    experience: tutors.experience,
    gradePreference: tutors.gradePreference,
    hireDate: tutors.hireDate,
    notes: tutors.notes,
    isActive: tutors.isActive,
    image: persons.image
 })
 .from(tutors)
 .innerJoin(persons, eq(tutors.personId, persons.id))
 .innerJoin(locations, eq(tutors.location, locations.id))
 .orderBy(tutors.id)
 .where(eq(tutors.id, id)).then(rows => rows[0]); 

 if (!tutor) {
            throw error(404, 'Tutor not found');
        }

 const subjectforTutor = await db.select(
    {
        id: subjectTutors.id,
        name: subjects.name,
        experience: subjectTutors.experience,
        profeciencyLevel: subjectTutors.proficiencyLevel,
        gradePreference: subjectTutors.gradePreference,
        isActive: subjectTutors.isActive
    }


 ).from(subjectTutors)
  .innerJoin(subjects, eq(subjectTutors.subjectId, subjects.id))
.where(eq(subjectTutors.tutorId, id));

  const matches = await db.select({
      id: students.id,
      firstName: persons.firstName,
      lastName: persons.lastName,
      phone: persons.phone,
      gender: persons.gender,
      subject: subjects.name,
      matchDate: tutorStudentMatches.matchDate,
      notes: students.notes,
      isActive: students.isActive
       
    })
    .from(tutorStudentMatches)
    .innerJoin(students, eq(tutorStudentMatches.studentId, students.id))
    .innerJoin(subjects, eq(subjects.id, tutorStudentMatches.subjectId))
    .innerJoin(persons, eq(students.personId, persons.id))
    .where(eq(tutorStudentMatches.tutorId, id));

    const fields = await db.select({

        id: fieldOfStudy.id,
        name: fieldOfStudy.name,
        gpa: fieldOfStudy.gpa,
        methodOfStudy: fieldOfStudy.methodOfStudy,
        graduationYear: fieldOfStudy.graduationYear,
        degreeType: fieldOfStudy.degreeType,
        university: fieldOfStudy.university
    }).from(fieldOfStudy)
    .where(eq(fieldOfStudy.tutorId, id));

  const bankAccounts = db.select({
    id: tutors.id,
    name: paymentMethods.name,
    bankAccount: personPaymentMethods.accountNumber,
    isDefault: personPaymentMethods.isDefault
})
.from(personPaymentMethods)
.innerJoin(paymentMethods, eq(personPaymentMethods.paymentMethodId, paymentMethods.id))
.innerJoin(persons, eq(personPaymentMethods.personId, persons.id))
.innerJoin(tutors, eq(persons.id, tutors.personId))
.where(eq(tutors.id, id));



    

        return {
         tutor,
         matches,
         subjectforTutor,
         fields,
         bankAccounts
        };
    } catch (error) {
        console.error('Failed to load Tutor:', error);

        return {
            tutor: [],
            matches: [],
            subjectforTutor: [],
            fields: [],
            bankAccounts: [],
            error: 'Failed to load Tutor'
            
        };
    }
};