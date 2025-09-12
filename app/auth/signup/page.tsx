import { redirect } from 'next/navigation';

export default function SignUpPage() {
  // IMMEDIATELY redirect to home page - no sign-up allowed
  redirect('/');
}
