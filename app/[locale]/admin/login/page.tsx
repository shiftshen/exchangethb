import { redirect } from 'next/navigation';

export default async function LocalizedAdminLoginRedirect() {
  redirect('/admin/login');
}
