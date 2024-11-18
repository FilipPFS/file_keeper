import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { fetchCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React, { ReactElement, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/UserContext";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: ReactNode }) => {
  const currentUser = await fetchCurrentUser(); // Fetch the current user here

  if (!currentUser) redirect("/sign-in");

  return (
    <UserProvider currentUser={currentUser}>
      <main className="flex h-screen">
        <Sidebar {...currentUser} />
        <section className="flex flex-col h-screen flex-1">
          <MobileNav {...currentUser} />
          <Header userId={currentUser.$id} accountId={currentUser.accountId} />
          <div className="main-content">{children}</div>
        </section>
        <Toaster />
      </main>
    </UserProvider>
  );
};

export default Layout;
