

import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { employees, paymentMethods, personPaymentMethods, persons } from '$lib/server/db/schema'
import { error } from '@sveltejs/kit';
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { bankSchema } from '$lib/zodschema';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';


type Message = { status: 'error' | 'success' | 'warning'; text: string };


export const load: PageServerLoad = async ({ params, parent }) => {

    const layoutData = await parent();
      const permList: Array<{ name: string }> = layoutData.permList;
      const perm = 'can_view_employees';
    
      const hasPerm = permList.some(p => p.name === perm);
    
         if (!hasPerm) {
         error(403, 'Not Allowed! You do not have permission to see employees. <br /> Talk to an admin to change it.');
      }
  

    const {id} =  params;

   
    try {
       const employee = await db
 .select(
    {firstName: persons.firstName,
     lastName: persons.lastName,
     gender: persons.gender,
     phone: persons.phone,
     joined: employees.hireDate,
     salary: employees.salary,
     birthday: persons.dateOfBirth,
     address: persons.address,
     position: employees.position,
     isActive: employees.isActive,
     image: persons.image,
     personId: persons.id


    }

 )
  .from(employees)
  .innerJoin(persons, eq(employees.personId, persons.id))
  .where(eq(employees.id, id)).then(rows => rows[0]);


  if (!employee) {
			throw error(404, 'Employee not found');
		}
  const bankAccounts = db.select({
      id: employees.id,
      name: paymentMethods.name,
      bankAccount: personPaymentMethods.accountNumber,
      isDefault: personPaymentMethods.isDefault
  })
  .from(personPaymentMethods)
  .innerJoin(paymentMethods, eq(personPaymentMethods.paymentMethodId, paymentMethods.id))
  .innerJoin(persons, eq(personPaymentMethods.personId, persons.id))
  .innerJoin(employees, eq(persons.id, employees.personId))
  .where(eq(employees.id, id));

  const form = await superValidate(zod4(bankSchema));


  const banks = await 
      await db.select({
         value: paymentMethods.id,
         name: paymentMethods.name
      }).from(paymentMethods);
  

        return {
            employee,
            bankAccounts,
            banks,
            form
        };
    } catch (error) {
        console.error('Failed to load employees:', error);

        // Optionally, you can throw an error to show a message in the UI
        // throw error(500, 'Failed to load employees');

        return {
            employee: [],
            error: 'Failed to load employees'
        };
    }
};


export const actions: Actions = {

      addBank: async({request, cookies})=> {

     const formData = await request.formData();
    const form = await superValidate<Infer<typeof bankSchema>, Message>(formData, zod4(bankSchema));
        if (!form.valid){ 
            setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);

            return fail(400, { form }); }

        
        const name = formData.get('name') as string || '';
        const accountNumber = formData.get('accountNumber') as string || '';
        const isdefault = formData.get('isDefault') as string;

        const isDefault = isdefault === 'true' ? true : false;

        const personId = formData.get('personId') as string || '';
        

        try {
            await db.insert(personPaymentMethods).values({
                personId,
                paymentMethodId: name,
                accountNumber,
                isDefault,
            });
             
        
            setFlash({ type: 'success', message: "Bank Account Added Successfully" }, cookies); 
            
        } catch (err) {
            setFlash({ type: 'error', message: "Failed to add bank account" + err }, cookies);
            return fail(500, { form }); 
        }    





     
   }
}
