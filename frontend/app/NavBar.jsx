import Link from "next/link";
import LoginForm from "./LoginForm";

export default function NavBar() {
  const navBarItems = [
    { name: "Home", link: "/" },
    { name: "Budgets", link: "/budgets" },
    { name: "Purchases", link: "/purchases" },
    { name: "Suppliers", link: "/suppliers" },
    { name: "Orders", link: "/orders" },
    { name: "Users", link: "/users" },
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
