import { redirect } from 'next/navigation';

export default function SignInPage() {
  // IMMEDIATELY redirect to home page - no sign-in allowed
  redirect('/');
}
