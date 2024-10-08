"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

// 既存の予算を編集するためのコンポーネント
function BudgetRow({ budget, onSave, onDelete, remainingBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editYear, setEditYear] = useState(budget.year);
  const [editMonth, setEditMonth] = useState(budget.month);
  const [editPurchaseBudget, setEditPurchaseBudget] = useState(
    budget.purchase_budget
  );
  const [editComment, setEditComment] = useState(budget.comment);
  const [editAlertThreshold, setEditAlertThreshold] = useState(
    budget.alert_threshold
  );

  const handleSave = () => {
    onSave(budget.id, {
      year: editYear,
      month: editMonth,
      purchase_budget: editPurchaseBudget,
      comment: editComment,
      alert_threshold: editAlertThreshold,
    });
    setIsEditing(false);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editYear}
            onChange={(e) => setEditYear(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {budget.year}
          </span>
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="text"
            value={editMonth}
            onChange={(e) => setEditMonth(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {budget.month}
          </span>
        )}
      </td>

      <td>
        <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          {remainingBudget?.remaining_budget}
        </span>
      </td>

      <td>
        {isEditing ? (
          <input
            type="text"
            value={editPurchaseBudget}
            onChange={(e) => setEditPurchaseBudget(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {budget.purchase_budget}
          </span>
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="text"
            value={editAlertThreshold}
            onChange={(e) => setEditAlertThreshold(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {budget.alert_threshold}
          </span>
        )}
      </td>

      <td>
        <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          {Math.round((Number(budget.purchase_budget) - Number(remainingBudget?.remaining_budget)) / Number(budget.purchase_budget) * 100)}%
        </span>
      </td>

      <td>
        {isEditing ? (
          <input
            type="text"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {budget.comment}
          </span>
        )}
      </td>

      <td>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              保存
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              キャンセル
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              編集
            </button>
            <button
              onClick={() => onDelete(budget.id)}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              削除
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

// 新規予算を登録するためのコンポーネント
function NewBudgetForm({ onSave, onCancel }) {
  const [newYear, setNewYear] = useState("");
  const [newMonth, setNewMonth] = useState("");
  const [newPurchaseBudget, setNewPurchaseBudget] = useState("");
  const [newAlertThreshold, setNewAlertThreshold] = useState("");
  const [newComment, setNewComment] = useState("");

  const handleSave = () => {
    onSave({
      year: newYear,
      month: newMonth,
      purchase_budget: newPurchaseBudget,
      alert_threshold: newAlertThreshold,
      comment: newComment,
    });
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </td>
      <td>
        <input
          type="text"
          value={newMonth}
          onChange={(e) => setNewMonth(e.target.value)}
          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </td>
      <td>
        <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          0
        </span>
      </td>
      <td>
        <input
          type="text"
          value={newPurchaseBudget}
          onChange={(e) => setNewPurchaseBudget(e.target.value)}
          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </td>
      <td>
        <input
          type="text"
          value={newAlertThreshold}
          onChange={(e) => setNewAlertThreshold(e.target.value)}
          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </td>
      <td>
        <span className="block py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          0
        </span>
      </td>
      <td>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </td>
      <td>
        <button
          onClick={handleSave}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          登録
        </button>
        <button
          onClick={onCancel}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
          キャンセル
        </button>
      </td>
    </tr>
  );
}


//指定した年月の予算残高を取得する関数
function getBudgetInfo(year, month, data) {
  // 指定したyearとmonthに一致するオブジェクトを検索
  const budget = data.find(item => item.year === year && item.month === month);

  // 一致するオブジェクトが存在すればremaining_budgetとtotal_budgetを返す
  if (budget) {
    return {
      remaining_budget: budget.remaining_budget,
      total_budget: budget.total_budget
    };
  } else {
    // 一致するオブジェクトが見つからない場合、nullを返す
    return null;
  }
}

// 予算一覧ページのコンポーネント
export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得
  const [remainingBudgets, setRemainingBudgets] = useState([]);

  useEffect(() => {
    async function fetchBudgetData() {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch(`${API_DOMAIN}/budgets`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      const data = await res.json();
      console.log("retrieved data from GET /budgets", data);
      setBudgets(data || []);
      setIsLoading(false);
    }
    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchBudgetData();
    }
  }, [isAuthenticated]);//4. 認証情報が変更されたら再度データを取得　ページを読み込んだ瞬間は認証情報が取得できていないので、認証情報が取得できたらデータを取得するようにする

  //全年月の予算残高
  useEffect(() => {
    async function fetchReminingData() {
      const accessToken = await getAccessToken();
      const res = await fetch(`${API_DOMAIN}/budgets/remaining`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      const data = await res.json();
      console.log(data);
      setRemainingBudgets(data.all_remaining_budgets);
    }
    if (isAuthenticated) {
      fetchReminingData();
    }
  }, [isAuthenticated]);






  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleSaveNewBudgets = (newBudget) => {
    async function registerData() {
      const accessToken = await getAccessToken();
      const res = await fetch(`${API_DOMAIN}/budgets`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newBudget),
      });
      const data = await res.json();
      console.log("retrieved data from POST /budgets", data);
      setBudgets([...budgets, data]);
      setIsAdding(false);
    }
    registerData();
  };

  const handleSave = (id, updatedBudget) => {
    async function updateData() {
      const accessToken = await getAccessToken();
      const res = await fetch(`${API_DOMAIN}/budgets/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedBudget),
      });
      if (res.status >= 400) {
        alert("更新に失敗しました。");
        setBudgets(budgets);
      } else {
        const data = await res.json();
        console.log(data);
        setBudgets(
          budgets.map((budget) => (budget.id === data.id ? data : budget))
        );
      }
    }
    updateData();
  };

  const handleCancelNewBudget = () => {
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    async function deleteData() {
      const budgetBeforeDelete = [...budgets];
      const accessToken = await getAccessToken();
      const res = await fetch(`${API_DOMAIN}/budgets/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (res.status >= 400) {
        setBudgets(budgetBeforeDelete);
        alert("削除に失敗しました。");
      } else {
        setBudgets(budgets.filter((budget) => budget.id !== id));
      }
    }
    deleteData();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">予算状況一覧</h1>
      </div>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={handleAddNew}
      >
        新規追加
      </button>

      {isLoading ? (
        <div className="flex justify-center" aria-label="読み込み中">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (

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
            {isAdding && (
              <NewBudgetForm
                onSave={handleSaveNewBudgets}
                onCancel={handleCancelNewBudget}
              />
            )}
            {budgets.map((budget) => (
              <BudgetRow
                key={budget.id}
                budget={budget}
                onSave={handleSave}
                onDelete={handleDelete}
                remainingBudget={
                  remainingBudgets.find((remainingBudget) => budget.year === remainingBudget.year && budget.month === remainingBudget.month)
                }
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}