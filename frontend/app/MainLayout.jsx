'use client';

import { useAuth } from "./context/auth";
import { usePathname } from 'next/navigation';

import NavBar from "./NavBar";
import RemainingBudget from "./RemainingBudget";
import LoginForm from "./LoginForm";

export default function MainLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isCallbackRoute = pathname === '/auth/callback';

  return (
    <>
      { isCallbackRoute || isAuthenticated ? (
        <>
          <div className="basis-3/4 p-8 flex flex-col">
            <header className="justify-between items-center bg-">
              <div>
                <h1 className="text-4xl font-extralight">Wa'Mmande</h1>
              </div>
              <div>{<RemainingBudget />}</div>
              <hr className="my-4" />
            </header>
            <main className="">{children}</main>
          </div>
          <aside className="basis-1/4 p-8 bg-slate-50">{<NavBar />}</aside>
        </>
      ) : (
        <div className="flex flex-row h-screen">
          <div className="m-auto">
              <LoginForm />
          </div>
        </div>
      )}
    </>
  )
}