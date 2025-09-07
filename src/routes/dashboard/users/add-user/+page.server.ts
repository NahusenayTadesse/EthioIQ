import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { error, fail } from '@sveltejs/kit';
// import * as auth from '$lib/server/auth';
// import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import {permissions, rolePermissions, roles, specialPermissions, user} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

import { zod4 } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { createUserSchema } from '$lib/server/zodschema';

export const load: PageServerLoad = async ({parent}) => {
  const layoutData = await parent();
    const permList = layoutData.permList;
    const perm = 'can_create_users';
  
    if (!permList || !permList.some(p => p.name === perm)) {
        error(403, 'Not Allowed! You do not have permission to create users. <br /> Talk to an admin to change it.');
    }
  
    const form = await superValidate(zod4(createUserSchema));
  
    const allroles = await db.select({
        id: roles.id,
        name: roles.name
    }).from(roles).orderBy(roles.id);

    const allPermissions = await db.select(
        {
            id: permissions.id,
            name: permissions.name, 
            description: permissions.description  
        }
    ).from(permissions).orderBy(permissions.id);

    const allRolePermissions = await db
        .select({
            id: rolePermissions.id,
            roleName: rolePermissions.roleId,
            permissionName: rolePermissions.permissionId,
        })
        .from(rolePermissions);

    return {
        allroles,
        allPermissions,
        allRolePermissions, 
        form
    };
};



import { setFlash, redirect} from 'sveltekit-flash-message/server';
type Message = { status: 'error' | 'success' | 'warning'; text: string };


export const actions: Actions = {
  register: async ({ request, cookies }) => {
    const formData = await request.formData();
    const form = await superValidate<Infer<typeof createUserSchema>, Message>(formData, zod4(createUserSchema));

    if (!form.valid) {
      setFlash({ type: 'error', message: "Please check the form for Errors" }, cookies);
      return fail(400, { form });
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const roleId = formData.get('role') as string;
    const customPrem = formData.get('customPrem') as string;
    const permissionIds = formData.getAll("permissions[]").map(v => Number(v));
    const username = extractUsername(email);
    const password = generatePassword();

  
    const userId = generateUserId();
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });

      const [newUser] = await db.insert(user).values({
        id: userId,
        email,
        name,
        username,
        passwordHash,
        roleId
      }).returning({ id: user.id });

      if (customPrem === 'true') {
        await db.insert(specialPermissions).values(
          permissionIds.map((permId) => ({
            userId: newUser.id,
            permissionId: permId,
          }))
        );
      }

      const emailResult = await sendWelcomeEmail({ email, username, name, password });
      if (!emailResult.success) {
        setFlash({ type: 'error', message: "Error when sending an email: " + emailResult.error }, cookies);
        return fail(500, { form });
      }
      if(newUser)
      redirect(`/dashboard/users/${newUser.id}`, {type: 'success', message: "User Successfully Created and Email with credentials sent to New User" }, cookies);
    
       
      //  setFlash({ type: 'success', message: "User Successfully Created and Email with credentials sent to New User" }, cookies);

      else {
      setFlash({ type: 'error', message: "An unexpected error occurred: "}, cookies);
      return fail(400, { form });
    } 
  }
    
};


function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

// function validateUsername(username: unknown): username is string {
// 	return (
// 		typeof username === 'string' &&
// 		username.length >= 3 &&
// 		username.length <= 31 &&
// 		/^[a-z0-9_-]+$/.test(username)
// 	);
// }

// function validatePassword(password: unknown): password is string {
// 	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
// }
function isValidEmail(email: string): boolean {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function extractUsername(email: string) {
  if (typeof email !== "string") {
    throw new Error("Input must be a string");
  }

  // Find the part before the '@'
  const atIndex = email.indexOf("@");
  
  if (atIndex === -1) {
    throw new Error("Invalid email address: missing '@'");
  }

  return email.substring(0, atIndex);
}

function generatePassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
  
  const allChars = upper + lower + numbers + symbols;
  const length = 16; // fixed length

  let password = "";
  
  // Ensure at least one of each type
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest up to fixed length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle characters so the first four aren’t predictable
  password = password.split("").sort(() => Math.random() - 0.5).join("");

  return password;
}

// Example usage
import nodemailer from 'nodemailer';
import { HOST, USER, PASSWORD } from '$env/static/private';


const transporter = nodemailer.createTransport({
    host: HOST,
    port: 587, // change if your SMTP uses a different port
    secure: false, // true if 465
    auth: {
        user: USER,
        pass: PASSWORD
    }
});

async function sendWelcomeEmail({
    email,
    username,
    name,
    password
}: {
    email: string;
    username: string;
    name: string;
    password: string;
}) {
    const htmlContent = 
    `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e6e6e6; border-radius:10px; background-color:#ffffff;">
    <div style="text-align:center; margin-bottom:20px;">
        <img src="https://ethioiq.com/wp-content/uploads/2025/01/Horizontal-Lockup-primary1.png" alt="Ethio IQ Logo" style="max-width:200px; height:auto;" />
    </div>
    <h2 style="color:#FF6600; text-align:center; margin-bottom:30px;">Welcome to Ethio IQ Office Management System</h2>
    <p style="font-size:16px;">Dear <strong>${name}</strong>,</p>
    <p style="font-size:16px;">Your account has been successfully created. Below are your login details:</p>
    <ul style="font-size:16px; list-style:none; padding:0; margin:20px 0;">
        <li style="margin-bottom:10px;"><strong>Username:</strong> <span style="color:#FF6600;">${username}</span></li>
        <li style="margin-bottom:10px;"><strong>Password:</strong> <span style="color:#FF6600;">${password}</span></li>
    </ul>
    <p style="font-size:16px;">You can now log in and start using the system.</p>
    <div style="text-align:center; margin-top:30px;">
        <a href="https://office.ethiq.com" style="display:inline-block; padding:12px 25px; font-size:16px; color:#ffffff; background-color:#FF6600; border-radius:5px; text-decoration:none;">Login Now</a>
    </div>
    <p style="margin-top:30px; font-size:14px; color:#777;">Best regards,<br><strong>Ethio IQ Office Management System</strong></p>
</div>
    `;

    try {
        await transporter.sendMail({
            from: `"Ethio IQ OMS" <${USER}>`,
            to: email,
            subject: 'Your Ethio IQ OMS Account',
            html: htmlContent
        });
        return { success: true };
    } catch (err) {
        console.error('Email sending failed:', err);
        return { success: false, error: 'Failed to send email' };
    }
}
