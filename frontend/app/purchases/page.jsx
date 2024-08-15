"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

// 既存の仕入品を編集するためのコンポーネント
function PurchaseRow({ purchase, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(purchase.name);
  const [isIngredient, setIsIngredient] = useState(purchase.is_food || false);

  const handleSave = () => {
    onSave(purchase.id, { name: editName, is_food: isIngredient });
    setIsEditing(false);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        ) : (
          <span className="block py-1.5 text-gray-900 shadow-sm  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            {purchase.name}
          </span>
        )}
      </td>
      <td className="flex justify-center">
        {isEditing ? (
          <>
            <input
              type="checkbox"
              id={`checkbox-${purchase.id}`}
              checked={isIngredient}
              onChange={(e) => setIsIngredient(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <label htmlFor={`checkbox-${purchase.id}`} className="ml-2">
              食材
            </label>
          </>
        ) : (
          <input
            type="checkbox"
            id={`checkbox-${purchase.id}`}
            checked={isIngredient}
            readOnly
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
        )}
      </td>
      <td>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
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
              onClick={() => onDelete(purchase.id)}
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

// 新規仕入品を登録するためのコンポーネント
function NewPurchaseForm({ onSave, onCancel }) {
  const [newName, setNewName] = useState("");
  const [isIngredient, setIsIngredient] = useState(true);

  const handleSave = () => {
    onSave({ name: newName, is_food: isIngredient });
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          placeholder="新規仕入品名"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </td>
      <td className="flex justify-center">
        <input
          type="checkbox"
          id="new-checkbox"
          checked={isIngredient}
          onChange={(e) => setIsIngredient(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <label htmlFor="new-checkbox" className="ml-2"></label>
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

// 仕入品一覧ページのコンポーネント
export default function Page() {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ここで検索ボックスの入力値を管理
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, getAccessToken } = useAuth();

  // データの取得
  async function fetchData(searchName = "") {
    const accessToken = await getAccessToken();
    const res = await fetch(`${API_DOMAIN}/purchases?name=${searchName}`, {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    setPurchases(data);
    setIsLoading(false);
  }

  // ページ読み込み時にデータを取得
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // 検索ボタンがクリックされたときに実行する関数
  const handleSearch = () => {
    fetchData(searchTerm);
  };

  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleSaveNewPurchase = (newPurchase) => {
    async function registerData() {
      const accessToken = await getAccessToken();
      const res = await fetch(`${API_DOMAIN}/purchases`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newPurchase),
      });
      const data = await res.json();
      setPurchases([...purchases, data]);
      setIsAdding(false);
    }
    registerData();
  };

  const handleCancelNewPurchase = () => {
    setIsAdding(false);
  };

  const handleSave = (id, updatedPurchase) => {
    async function updateData() {
      const accessToken = await getAccessToken();
      const res = await fetch(`${API_DOMAIN}/purchases/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedPurchase),
      });
      if (res.status >= 400) {
        alert("更新に失敗しました。");
        setPurchases(purchases);
      } else {
        const data = await res.json();
        setPurchases(
          purchases.map((purchase) =>
            purchase.id === data.id ? data : purchase
          )
        );
      }
    }
    updateData();
  };

  const handleDelete = (id) => {
    async function deleteData() {
      const accessToken = await getAccessToken();
      const purchasesBeforeDelete = [...purchases];
      const res = await fetch(`${API_DOMAIN}/purchases/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status >= 400) {
        setPurchases(purchasesBeforeDelete);
        alert("削除に失敗しました。");
      } else {
        setPurchases(purchases.filter((purchase) => purchase.id !== id));
      }
    }
    deleteData();
  };

  return (
    <div>
      <h1 className="text-base font-semibold leading-7 text-gray-900">
        仕入品一覧
      </h1>
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 入力値を更新
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            検索
          </button>
          <button
            onClick={handleAddNew}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            新規追加
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center" aria-label="読み込み中">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">仕入品名</th>
                <th className="px-4 py-2">食材チェック</th>
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                <NewPurchaseForm
                  onSave={handleSaveNewPurchase}
                  onCancel={handleCancelNewPurchase}
                />
              )}
              {purchases.map((purchase) => (
                <PurchaseRow
                  key={purchase.id}
                  purchase={purchase}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}