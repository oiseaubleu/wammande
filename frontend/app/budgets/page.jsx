"use client";

import { useState, useEffect } from "react";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    year: "",
    month: "",
    remainingAmount: "",
    budgetAmount: "",
    alertAmount: "",
    usageRate: "",
    comment: "",
  });
  const [editingBudget, setEditingBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBudgetData() {
      const res = await fetch("http://localhost:3000/budgets", {
        mode: "cors",
      });
      const data = await res.json();
      console.log(data);
      setBudgets(data);
      setIsLoading(false);
    }
    fetchBudgetData();
  }, []);

  const handleInputChange = (e, field, isNew = true) => {
    const value = e.target.value;
    if (isNew) {
      setNewBudget({
        ...newBudget,
        [field]: value,
      });
    } else {
      setEditingBudget({
        ...editingBudget,
        [field]: value,
      });
    }
  };

  const handleAddNew = () => {
    setBudgets([...budgets, { id: budgets.length + 1, ...newBudget }]);
    setNewBudget({
      year: "",
      month: "",
      remainingAmount: "",
      budgetAmount: "",
      alertAmount: "",
      usageRate: "",
      comment: "",
    });
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  const handleUpdate = () => {
    setBudgets(
      budgets.map((budget) =>
        budget.id === editingBudget.id ? editingBudget : budget
      )
    );
    setEditingBudget(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">予算状況一覧</h1>
        <div className="text-xl">
          現在の予算残額: <span className="font-bold">€3000</span>
        </div>
      </div>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={() =>
          setEditingBudget({
            id: null,
            year: "",
            month: "",
            remainingAmount: "",
            budgetAmount: "",
            alertAmount: "",
            usageRate: "",
            comment: "",
          })
        }
      >
        新規追加
      </button>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">年</th>
            <th className="py-2 px-4 border-b">月</th>
            <th className="py-2 px-4 border-b">残額</th>
            <th className="py-2 px-4 border-b">予算額</th>
            <th className="py-2 px-4 border-b">アラート設定</th>
            <th className="py-2 px-4 border-b">使用率</th>
            <th className="py-2 px-4 border-b">コメント</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              {editingBudget?.id === budget.id ? (
                <>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.year}
                      onChange={(e) => handleInputChange(e, "year", false)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.month}
                      onChange={(e) => handleInputChange(e, "month", false)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.remainingAmount}
                      onChange={(e) =>
                        handleInputChange(e, "remainingAmount", false)
                      }
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.budgetAmount}
                      onChange={(e) =>
                        handleInputChange(e, "budgetAmount", false)
                      }
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.alertAmount}
                      onChange={(e) =>
                        handleInputChange(e, "alertAmount", false)
                      }
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.usageRate}
                      onChange={(e) => handleInputChange(e, "usageRate", false)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={editingBudget.comment}
                      onChange={(e) => handleInputChange(e, "comment", false)}
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                      onClick={handleUpdate}
                    >
                      更新
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{budget.year}</td>
                  <td className="py-2 px-4 border-b">{budget.month}</td>
                  <td className="py-2 px-4 border-b">
                    €{budget.remainingAmount}
                  </td>
                  <td className="py-2 px-4 border-b">€{budget.budgetAmount}</td>
                  <td className="py-2 px-4 border-b">€{budget.alertAmount}</td>
                  <td className="py-2 px-4 border-b">{budget.usageRate}%</td>
                  <td className="py-2 px-4 border-b">{budget.comment}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                      onClick={() => handleEdit(budget)}
                    >
                      編集
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {editingBudget?.id === null && (
            <tr>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={newBudget.year}
                  onChange={(e) => handleInputChange(e, "year")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={newBudget.month}
                  onChange={(e) => handleInputChange(e, "month")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200
                    focus:ring-opacity-50"
                  value={newBudget.remainingAmount}
                  onChange={(e) => handleInputChange(e, "remainingAmount")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={newBudget.budgetAmount}
                  onChange={(e) => handleInputChange(e, "budgetAmount")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={newBudget.alertAmount}
                  onChange={(e) => handleInputChange(e, "alertAmount")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={newBudget.usageRate}
                  onChange={(e) => handleInputChange(e, "usageRate")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={newBudget.comment}
                  onChange={(e) => handleInputChange(e, "comment")}
                />
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={handleAddNew}
                >
                  追加
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
