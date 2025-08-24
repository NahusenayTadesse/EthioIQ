

import { eq } from 'drizzle-orm';
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { employees, paymentMethods, personPaymentMethods, persons } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ params}) => {
  

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
     isActive: employees.isActive


    }

 )
  .from(employees)
  .innerJoin(persons, eq(employees.personId, persons.id))
  .where(eq(employees.id, id)).then(rows => rows[0]);

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
  

        return {
            employee,
            bankAccounts
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