import { redirect } from 'next/navigation';

export default function DemoPage() {
  // Redirect to the demo business
  redirect('/review/johns-cafe');
}
