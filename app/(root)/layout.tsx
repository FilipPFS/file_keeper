import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { fetchCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: ReactNode }) => {
  const currentUser = await fetchCurrentUser();

  if (!currentUser) redirect("/sign-in");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex flex-col h-screen flex-1">
        <MobileNav {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>

      <Toaster />
    </main>
  );
};

export default Layout;
