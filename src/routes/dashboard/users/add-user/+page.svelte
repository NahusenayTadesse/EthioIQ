<script>
	import { enhance } from "$app/forms";
	import { input, label, select, submitButton } from "$lib/global.svelte.js";
    let {data, form} = $props()

</script>
<h1>{form?.message}</h1>
<div class="bg-background text-foreground min-h-screen flex items-center justify-start p-4">
	<div class="w-full max-w-md">
		<div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
			<div class="mb-6">
				<h1 class="text-center">Create User</h1>
			</div>

			<form method="POST" action="?/register" class="space-y-4" use:enhance>
				<!-- Email Input -->
				<div>
					<label for="email" class={label}>Email Address</label>
					<input id="email" name="email" type="email" placeholder="Enter your email" required class={input} />
				</div>

				<!-- Name Input -->
				<div>
					<label for="name" class={label}>Full Name</label>
					<input id="name" name="name" type="text" placeholder="Enter your full name" required class={input} />
				</div>

				<!-- Password Input -->
				<!-- <div>
					<label for="password" class={label}>Password</label>
					<input id="password" name="password" type="password" placeholder="Create a password" required class={input} />
				</div> -->

				<!-- Role Select -->
				<div>
					<label for="role" class={label}>Role</label>
					<select id="role" name="role" required class={select}>
						<option value="" class="text-gray-500">Select your role</option>
						{#each data.allroles as role}
						<option value={role.id} class="text-gray-900 dark:text-white">{role.name}</option>
						{/each}
					</select>
				</div>

				<!-- Submit Button -->
				<button type="submit" class="{submitButton} w-full">Create User</button>
			</form>

			<!-- Additional Info -->
			
		</div>
	</div>
</div>
