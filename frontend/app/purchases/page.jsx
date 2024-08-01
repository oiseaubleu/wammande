"use client";

import { useState } from "react";

// 既存の仕入品を編集するためのコンポーネント
function PurchaseRow({ purchase, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(purchase.name);
  const [isIngredient, setIsIngredient] = useState(
    purchase.isIngredient || false
  );

  const handleSave = () => {
    onSave(purchase.id, { name: editName, isIngredient });
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
          <span>{purchase.name}</span>
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
    onSave({ name: newName, isIngredient });
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
        <label htmlFor="new-checkbox" className="ml-2">
          食材
        </label>
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
  const [purchases, setPurchases] = useState([
    { id: 1, name: "米", isIngredient: true },
    { id: 2, name: "豚肉", isIngredient: true },
    { id: 3, name: "牛肉", isIngredient: true },
    { id: 4, name: "ラップ", isIngredient: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    setIsAdding(true);
  };

  const handleSaveNewPurchase = (newPurchase) => {
    setPurchases([...purchases, { id: purchases.length + 1, ...newPurchase }]);
    setIsAdding(false);
  };

  const handleCancelNewPurchase = () => {
    setIsAdding(false);
  };

  const handleSave = (id, updatedPurchase) => {
    setPurchases(
      purchases.map((purchase) =>
        purchase.id === id ? { ...purchase, ...updatedPurchase } : purchase
      )
    );
  };

  const handleDelete = (id) => {
    setPurchases(purchases.filter((purchase) => purchase.id !== id));
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
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            検索
          </button>
          <button
            onClick={handleAddNew}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            新規追加
          </button>
        </div>

        <table className="w-full table-auto">
          <thead>
          <tr className="bg-gray-200">
              <th className="px-4 py-2">仕入品名</th>
              <th className="px-4 py-2">食材check</th>
              
            </tr>
          </thead>
          <tbody>
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
        {isAdding && (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">仕入品名</th>
                <th className="px-4 py-2">食材check</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <NewPurchaseForm
                onSave={handleSaveNewPurchase}
                onCancel={handleCancelNewPurchase}
              />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
