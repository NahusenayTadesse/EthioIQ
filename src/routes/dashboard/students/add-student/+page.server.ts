import {  fail, error } from "@sveltejs/kit";
import { redirect, setFlash } from 'sveltekit-flash-message/server';



import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { employees, fees, leads, locations, persons, schools } from '$lib/server/db/schema'
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { employeeSchema } from "$lib/server/zodschema";
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
  const form = await superValidate(zod4(employeeSchema));


     const lead = await 
      await db.select({
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
      )
  return {
     form,
     lead,
     location: locationer,
     school: schooler,
     fee: feer
  }

 
 };



export const actions: Actions = {
  createEmployee: async ({request, cookies}) => {


    const formData = await request.formData();
    // const form = await superValidate(formData, zod4(employeeSchema));
    const form = await superValidate<Infer<typeof employeeSchema>, Message>(formData, zod4(employeeSchema));


    if (!form.valid) {
      
      setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);

      return fail(400, { form });
    
    }



    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const grandFatherName = formData.get('grandFatherName') as string;
    const email = formData.get('email') as string;
    const gender = formData.get('gender') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const position = formData.get('position') as string;
    const salary = formData.get('salary') as string;
    const hireDate = formData.get('hireDate') as string;
    const notes = formData.get('notes') as string;
    
    const type = 'employee';
    


     if (!form.valid) {
            setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);

      return fail(400, { form });
    }

    

    const [employee] = await db.insert(persons).values({
      firstName,
      lastName,
      grandFatherName,
      email,
      gender,
      address,
      phone,
      type,
      dateOfBirth
    }).returning();
      


     const [employeeDetail] =await db.insert(employees).values({ personId: employee.id, position, salary: Number(salary), hireDate, notes }).returning({id:employees.id});

    // return message(form, { message:'Employee Created Successfully!', success: true});
        redirect(`/dashboard/employees/${employeeDetail.id}/#bank`, { type: 'success', message: "Employee Successfully Created" }, cookies);

  }

  
};