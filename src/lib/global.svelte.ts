
export let submitButton = `bg-dark hover:shadow-lg text-white font-semibold py-2 rounded-md 
shadow transition-all ease-in-out hover:scale-110 duration-400 
dark:bg-gray-200 dark:text-dark flex flex-row justify-center items-center`;
export let menubtn = `${submitButton} bg-white dark:!bg-dark !border-1 !text-dark dark:!text-white !border-dark dark:!border-white`;
export let label = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
export let input = `w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 dark:focus:ring-white focus:ring-dark transition`;
export let formContainer = `min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black transition-colors`;
export let formContainerInner = `mx-auto w-full max-w-md border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 bg-white dark:bg-gray-950 transition-colors`;
export let select = `appearance-none w-full px-4 py-2.5 pr-10 bg-white dark:bg-dark 
           border border-gray-300 dark:border-gray-700 
           rounded-lg shadow-sm text-sm font-medium 
           text-gray-800 dark:text-gray-100 
           placeholder-gray-400 dark:placeholder-gray-500
           focus:outline-none focus:ring-1 focus:ring-dark focus:border-dark
           hover:border-gray-400 dark:hover:border-gray-600
           transition-colors duration-200 ease-in-out` 
export const searchableFields = ['id', 'firstName', 'lastName', 
  'gender', 'position',   'phone', 'grade', 
  'location', 'fee','naturalOrSocial', 'notes',
  'age', 'bankAccount', 'hourlyRates', 'payment', 
  'parentPhone', 'studentPhone', 'studentFirstName', 'studentLastName',
   'parentFirstName', 'parentLastName', 'description', 'subject', 'name', 'roleName', 
   'permissionName', 'userName', 'role', 'email','name', 'description'];

  export const toastmsg = `fixed right-4 bottom-20 lg:bottom-4 z-50
             flex items-center gap-3
             bg-green-600 text-white font-medium 
             px-5 py-3 rounded-xl shadow-lg
             animate-slide-in`
  export const errormsg = `${toastmsg} !bg-red-600`;
  export const createForm = `rounded-lg lg:w-4/5 w-full bg-white dark:bg-black grid lg:grid-cols-2 grid-cols-1 gap-4 p-6`;

  export const createbtn= `${submitButton} w-[180px]  fixed top-30 right-4 flex flex-row gap-2`

