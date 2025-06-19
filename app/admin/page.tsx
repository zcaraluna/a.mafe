import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import AdminPanel from "./AdminPanel";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <AdminPanel />;
} 