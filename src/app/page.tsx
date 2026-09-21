import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { HomeContent } from "@/components/partials/Home";
import { authOptions } from "@/lib/auth/options";

// Logged-in home (TASK-006 step 6). Not in proxy.ts's matcher because /admin redirects
// here for non-admins; the session check lives in the page instead.
export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return <HomeContent sessionDisplayName={session.user.displayName} />;
}
