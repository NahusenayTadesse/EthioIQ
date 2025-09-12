import {  fail, error } from "@sveltejs/kit";
import { redirect, setFlash } from 'sveltekit-flash-message/server';



import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { contacts, fees, grades, leads, locations, persons, schools, students } from '$lib/server/db/schema'
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { studentSchema } from "$lib/server/zodschema";
import type {  Actions } from "./$types";
type Message = { status: 'error' | 'success' | 'warning'; text: string };



export const load: PageServerLoad = async ({ parent }) => {
   const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_create_students';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to create students. <br /> Talk to an admin to change it.');
  }
  const form = await superValidate(zod4(studentSchema));


     const lead =  await db.select({
         value: leads.id,
         name: leads.name
      }).from(leads);


      const locationer = await db.select({
         value: locations.id,
         name: locations.name
      }).from(locations);

     const schooler = await db.select({
         value: schools.id,
         name: schools.name
     }).from(schools);

      const feer = await db.select(
        {
            value: fees.id,
            name: fees.fee
        }
      ).from(fees);

      const grader = await db.select({
         value: grades.id,
         name: grades.grade
      }).from(grades)
  return {
     form,
     lead,
     location: locationer,
     school: schooler,
     fee: feer,
     grade: grader
  }

 
 };



export const actions: Actions = {
  createStudent: async ({request, cookies}) => {


    const formData = await request.formData();
    const form = await superValidate<Infer<typeof studentSchema>, Message>(formData, zod4(studentSchema));

    



    if (!form.valid) {
      
      setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);
    

      return fail(400, { form });
   
    }


const firstName = formData.get('firstName') as string;
const lastName = formData.get('lastName') as string;
const grandFatherName = formData.get('grandFatherName') as string | null;

const gender = formData.get('gender') as string;
const grade = formData.get('grade') as string;
const school = formData.get('school') as string;

const telegram = formData.get('telegram') as string;

const fee = formData.get('fee') as string;
const location = formData.get('location') as string;
const specificLocation = formData.get('specificLocation') as string;

const phone = formData.get('phone') as string | null;

const dateOfBirth = formData.get('dateOfBirth') as string;

const lead = formData.get('lead') as string;

const notes = formData.get('notes') as string;

const naturalOrSocial = formData.get('naturalOrSocial') as string || null;

    
    const type = 'student';
 
  
    
    
    const [student] = await db.insert(persons).values({
      firstName,
      lastName,
      grandFatherName,
      gender,
      phone,
      type,
      dateOfBirth
    }).returning();

    
      


     const [studentDetail] =await db.insert(students).values({ personId: student.id, gradeId: grade, location, naturalOrSocial, school, fee, lead, specificLocation, notes }).returning({id:students.id});
      await db.insert(contacts).values({personId: student.id, type: "Telegram",value: telegram} )
      

    // return message(form, { message:'Employee Created Successfully!', success: true});
      
      if(student && studentDetail)
      redirect(`/dashboard/students/${studentDetail.id}/#parents`, { type: 'success', message: "Student Successfully Created" }, cookies);
      else {
      
      setFlash({ type: 'error', message: "Unexpected Error Occurred" }, cookies);
    

      return fail(400, { form });
   
    }

      
  }
};

  
