import Link from "next/link";

export default function RemainingBudget() {
  return (
    <div className="flex flex-col items-end">
      <p className="bg-yellow-200 p-2 rounded mb-2 font-light ">
        もうすぐ超過します!!
      </p>
      <div className="flex flex-row justify-end w-full">
        <h2 className="text-2xl m-5 font-light">Remaining Budget</h2>
        <p className="text-2xl m-5 font-bold">$1,000.00</p>
        <Link href={"/budgets"}>
          <button className="p-2 m-5 rounded bg-slate-300 hover:bg-sky-300">
            Edit Budget
          </button>
        </Link>
      </div>
    </div>
  );
}
