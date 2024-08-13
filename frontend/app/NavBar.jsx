import Link from "next/link";
import LoginForm from "./LoginForm";

export default function NavBar() {
  const navBarItems = [
    { name: "Home", link: "/" },
    { name: "予算管理", link: "/budgets" },
    { name: "仕入品マスタ", link: "/purchases" },
    { name: "仕入先マスタ", link: "/suppliers" },
    { name: "発注管理", link: "/orders" },
    { name: "ユーザ管理", link: "/users" },
  ];

  return (
    <ul className="w-full">
      {navBarItems.map((item) => (
        <li key={item.name} className="mb-2">
          <Link href={item.link} className="block p-2 rounded bg-slate-300 hover:bg-sky-300 w-full text-center">
            {item.name}
          </Link>
        </li>
      ))}
      <hr className="my-4" />
      <li className="mb-2">
        <LoginForm />
      </li>
    </ul>
  );
}
