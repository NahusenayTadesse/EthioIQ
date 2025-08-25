import { eq, and } from 'drizzle-orm';
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';


import {  persons,  employees, employeePayments, personPaymentMethods, paymentMethods } from '$lib/server/db/schema'


export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_employee_payments';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see employee payments. <br /> Talk to an admin to change it.');
  }

   try {
 const pendingPayments = await db
  .select({
    id: employees.id,
    firstName: persons.firstName,
    lastName: persons.lastName,
    phone: persons.phone,
    amount: employeePayments.amount,
    month: employeePayments.month,
    status: employeePayments.status,
    bankAccount: personPaymentMethods.accountNumber,
    paymentMethod: paymentMethods.name,
  })
  .from(employeePayments)
  .innerJoin(employees, eq(employeePayments.employeeId, employees.id))
  .innerJoin(persons, eq(employees.personId, persons.id))
  .leftJoin(
    personPaymentMethods,
    and(
      eq(personPaymentMethods.personId, persons.id),
    eq(personPaymentMethods.isDefault, true)
    )
  )
  .leftJoin(paymentMethods, eq(personPaymentMethods.paymentMethodId, paymentMethods.id))
  .where(eq(employeePayments.status, "pending"));
  return {
    pendingPayments,
    error: null // Explicitly indicate no error
  };
} catch (error) {
  console.error("Error fetching employee payments:", error);
  return {
    pendingPayments: [], // Changed from tutorSessions to pendingPayments
    error: "Failed to load employee payments." // Updated error message
  };
}

}