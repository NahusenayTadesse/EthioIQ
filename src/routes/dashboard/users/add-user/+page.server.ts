import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import {permissions, roles, user} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';



export const load: PageServerLoad = async ({locals}) => {
	if (!locals.user) {
		return redirect(303, '/login');
	}


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

  return {
     allroles,
     allPermissions
  }
};




export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const role = formData.get('role') as string;
    const username = extractUsername(email);

		const password = generatePassword();

		if(!isValidEmail(email)){
			return fail(400, {message: 'Invalid email'})
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(user).values({ id: userId, email, name,  username, passwordHash, roleId: role });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch(err) {
			console.error('Action failed:', err);

			return fail(500, { message: 'An error has occurred' });
		}

    sendWelcomeEmail({ email, username, name, password })
            .catch((err) => console.error('Background mail send failed:', err));
		return {
       message: "Successfully Added User"
    };
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
function isValidEmail(email: string): boolean {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function extractUsername(email) {
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
