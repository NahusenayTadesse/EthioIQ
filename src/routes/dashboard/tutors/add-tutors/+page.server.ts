import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';

const FILES_DIR: string = env.FILES_DIR ?? '.temp-files';

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

import {  fail, error } from "@sveltejs/kit";
import { redirect, setFlash } from 'sveltekit-flash-message/server';



import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  grades, leads, locations, persons,tutors, tutorHourlyRate, contacts } from '$lib/server/db/schema'
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { tutorSchema } from "$lib/zodschema";
import type {  Actions } from "./$types";
import { withFiles } from 'sveltekit-superforms';

type Message = { status: 'error' | 'success' | 'warning'; text: string };



export const load: PageServerLoad = async ({ parent }) => {
   const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_create_students';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to create students. <br /> Talk to an admin to change it.');
  }
  const form = await superValidate(zod4(tutorSchema));


     const lead =  await db.select({
         value: leads.id,
         name: leads.name
      }).from(leads);

      const locationer = await db.select({
         value: locations.id,
         name: locations.name
      }).from(locations);

    

      const hourly = await db.select(
        {
            value: tutorHourlyRate.id,
            name: tutorHourlyRate.fee
        }
      ).from(tutorHourlyRate);

      const grader = await db.select({
         value: grades.id,
         name: grades.grade
      }).from(grades);
  return {
     form,
     lead,
     location: locationer,
     hourly,
     grade: grader
  }

 
 };


export const actions: Actions = {
  addTutor: async ({request, cookies}) => {

     const formData = await request.formData();
      const form = await superValidate<Infer<typeof tutorSchema>, Message>(formData, zod4(tutorSchema));
  
        if (!form.valid) {
          
          setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);
 
        return fail(400, ({ form }));
       
        }
    const image = formData.get('image') as File;

    const file_path: string = path.normalize(path.join(FILES_DIR, image.name));
    		// const file_path = fs.statSync(path.normalize(path.join(FILES_DIR, image.name)));


    // if (fs.existsSync(file_path)) {
    //     setFlash({ type: 'error', message: "The problem is here" }, cookies);
 
    //     return fail(400, withFiles({ form }));    
    //   }

    const nodejs_wstream = fs.createWriteStream(file_path);
    const web_rstream = image.stream();
    const nodejs_rstream = Readable.fromWeb(web_rstream);
    await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
      return fail(500);
    });

const firstName = formData.get('firstName') as string;
const lastName = formData.get('lastName') as string;
const grandFatherName = formData.get('grandFatherName') as string | null;

const gender = formData.get('gender') as string;
const gradePreference = formData.get('gradePreference') as string;

const telegram = formData.get('telegram') as string;

const hourlyRate = formData.get('hourly') as string;
const location = formData.get('location') as string;
const specificLocation = formData.get('specificLocation') as string;

const phone = formData.get('phone') as string | null;
const experience = formData.get('experience') as string | null;

const dateOfBirth = formData.get('dateOfBirth') as string;

const lead = formData.get('lead') as string;

const notes = formData.get('notes') as string;

const naturalOrSocial = formData.get('naturalOrSocial') as string || null;

    
    const type = 'tutor';
const [tutor] = await db.insert(persons).values({
      firstName,
      lastName,
      grandFatherName,
      gender,
      image: image.name,
      phone,
      type,
      dateOfBirth
    }).returning();

     const [tutorDetail] =await db.insert(tutors).values({ personId: tutor.id, gradeId: gradePreference, location, naturalOrSocial, experience, hourlyRate, lead, specificLocation, notes }).returning({id: tutors.id});
      await db.insert(contacts).values({personId: tutor.id, type: "Telegram",value: telegram} )


      if(tutor && tutorDetail)
      redirect(`/dashboard/tutors/${tutorDetail.id}`, { type: 'success', message: "Tutor Successfully Created" }, cookies);
      else {
      
      setFlash({ type: 'error', message: "Unexpected Error Occurred" }, cookies);
    

      return fail(400, { form });
   
    }

 

},

  delete: async (event) => {
    const data = await event.request.formData();
    const file_name = data.get('file_name') as string;

    if (!file_name) {
      return fail(400);
    }

    const file_path: string = path.normalize(path.join(FILES_DIR, file_name));

    if (!fs.existsSync(file_path)) {
      return fail(400);
    }

    fs.unlinkSync(file_path);
  }
};
