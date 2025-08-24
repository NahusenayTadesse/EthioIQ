import { eq, count } from 'drizzle-orm';
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import {  parents, persons, studentParentRelations } from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_view_parents';

  const hasPerm = permList?.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to see parents. <br /> Talk to an admin to change it.');
  }

   
    try {
       const allParents = await db
 .select({
    id: parents.id,
    firstName: persons.firstName,
    lastName: persons.lastName,
    gender: persons.gender,
    phone: persons.phone,
    studentCount: count(studentParentRelations.studentId).as('studentCount'),
    isActive: parents.isActive
  })
  .from(parents)
  .innerJoin(persons, eq(parents.personId, persons.id)) 
  .leftJoin(studentParentRelations, eq(parents.id, studentParentRelations.parentId))
  .groupBy(
  parents.id,
  persons.firstName,
  persons.lastName,
  persons.phone,
  persons.gender,
  parents.isActive
)
  .orderBy(parents.id);



        return {
            allParents
        };
    } catch (error) {
        console.error('Failed to load Parents:', error);

      

        return {
            allParents: [],
            error: 'Failed to load Parents'
        };
    }
};