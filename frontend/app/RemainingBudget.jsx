"use client";

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useAuth } from "./context/auth";

export default function RemainingBudget() {
  //今月の予算残高と、予算状態メッセージを受け取る
  const [remainingBudget, setRemainingBudget] = useState(null);
  const [displayMessage, setDisplayMessage] = useState("");
  const { isAuthenticated, getAccessToken } = useAuth();

  useEffect(() => {
    async function fetchGetRemainingInfo() {
      const accessToken = await getAccessToken();
      const res = await fetch("http://localhost:3000/budgets/remaining", {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      console.log("retrieved data from GET /budgets/remaining", data);
      setRemainingBudget(data.remaining_budget);
      setDisplayMessage(data.display_message);
    }
    if (isAuthenticated) {
      fetchGetRemainingInfo();
    }
  }, [isAuthenticated]);

  function budgetStatusMessage() {
    if (displayMessage == 'over budget') {
      return (
        <p className="bg-red-200 p-2 rounded mb-2 font-light ">
          予算超過しています！！！
        </p>
      )
    } else if (displayMessage == 'warning') {
      return (
        <p className="bg-yellow-200 p-2 rounded mb-2 font-light ">
          もうすぐ予算超過します！！！
        </p>
      )
    } else {
      return (<p></p>)
    }
  }

  return (
    <div className="flex flex-col items-end">
      {budgetStatusMessage()}
      <div className="flex flex-row justify-end w-full">
        <h2 className="text-2xl m-5 font-light">予算残額</h2>
        <p className="text-2xl m-5 font-bold"> € {remainingBudget} </p>
        {/* <Link href={"/budgets"}>
          <button className="p-2 m-5 rounded bg-slate-300 hover:bg-sky-300">
            Edit Budget
          </button>
        </Link> */}
      </div>
    </div>
  );
}


