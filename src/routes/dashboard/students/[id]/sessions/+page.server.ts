import { eq } from 'drizzle-orm';
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';

import {  persons, tutors, students, subjects, tutoringSessions } from '$lib/server/db/schema'



export const load: PageServerLoad = async ({params}) => {
      
    const {id} =  params; 

    try { 

        const tutorSessionsRaw = await db.select(
            {
            id: tutors.id,
            firstName: persons.firstName,
            lastName: persons.lastName,
            phone: persons.phone,
            subject: subjects.name,
            scheduledStart: tutoringSessions.scheduledStart,
            scheduledEnd: tutoringSessions.scheduledEnd,
            actualStart: tutoringSessions.actualStart,
            actualEnd: tutoringSessions.actualEnd,
            status: tutoringSessions.status,
            notes: tutoringSessions.notes
            }
        ).from(tutoringSessions)
        .innerJoin(tutors, eq(tutoringSessions.tutorId, tutors.id))
        .innerJoin(students, eq(tutoringSessions.studentId, students.id))
        .innerJoin(subjects, eq(tutoringSessions.subjectId, subjects.id))
        .innerJoin(persons, eq(tutors.personId, persons.id))
        .where(eq(tutoringSessions.studentId, id));

        // Helper to format date to 12-hour time
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

        const tutorSessions = tutorSessionsRaw.map(session => ({
            ...session,
            scheduledStart: to12Hour(session.scheduledStart),
            scheduledEnd: to12Hour(session.scheduledEnd),
            actualStart: to12Hour(session.actualStart),
            actualEnd: to12Hour(session.actualEnd)
        }));

        return {
            tutorSessions
        };
    } catch (error) {
        console.error("Error fetching tutor sessions:", error);
        return {
            tutorSessions: [],
            error: "Failed to load tutor sessions."
        };
    }

}