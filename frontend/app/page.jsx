"use client";

import React, { useState, useEffect } from 'react';



// ToDoList Component
const ToDoList = ({ todos, onRegister }) => (
  <div className="p-4">
    <h2 className="text-lg font-semibold">ToDo</h2>
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">仕入先</th>
          <th className="py-2 px-4 border-b">次回発注予定日</th>
          <th className="py-2 px-4 border-b">購入品目</th>
          <th className="py-2 px-4 border-b">ステータス</th>
          <th className="py-2 px-4 border-b"></th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{todo.supplier}</td>
            <td className="py-2 px-4 border-b">{todo.nextOrderDate}</td>
            <td className="py-2 px-4 border-b">{todo.item}</td>
            <td className="py-2 px-4 border-b">{todo.status}</td>
            <td className="py-2 px-4 border-b">
              <button
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
                onClick={() => onRegister(todo)}
              >
                発注登録
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// PendingList Component
const PendingList = ({ pendings, onEdit }) => (
  <div className="p-4">
    <h2 className="text-lg font-semibold">納品待ち</h2>
    <table className="min-w-full bg-white border">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">仕入先</th>
          <th className="py-2 px-4 border-b">次回発注予定日</th>
          <th className="py-2 px-4 border-b">購入品目</th>
          <th className="py-2 px-4 border-b">ステータス</th>
          <th className="py-2 px-4 border-b"></th>
        </tr>
      </thead>
      <tbody>
        {pendings.map((pending, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{pending.supplier}</td>
            <td className="py-2 px-4 border-b">{pending.nextOrderDate}</td>
            <td className="py-2 px-4 border-b">{pending.item}</td>
            <td className="py-2 px-4 border-b">{pending.status}</td>
            <td className="py-2 px-4 border-b">
              <button
                className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700"
                onClick={() => onEdit(pending)}
              >
                編集
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main Component
const App = () => {
  const [budget, setBudget] = useState(3000);
  const [todos, setTodos] = useState([
    { supplier: 'モノプリ', nextOrderDate: '2024/09/15', item: 'オクラ, エリンギ, シメジ, タイモ', status: '未発注' },
    { supplier: '肉屋', nextOrderDate: '2024/09/25', item: '豚肩肉', status: '未発注' },
    { supplier: '魚屋', nextOrderDate: '2024/09/30', item: 'タラ', status: '未発注' }
  ]);
  const [pendings, setPendings] = useState([
    { supplier: 'モノプリ', nextOrderDate: '2024/09/15', item: 'シメジ, シンガイモ', status: '納品待ち' }
  ]);

  const handleRegister = (todo) => {
    // 発注登録処理
    alert(`発注登録: ${todo.supplier} - ${todo.item}`);
  };

  const handleEdit = (pending) => {
    // 編集処理
    alert(`編集: ${pending.supplier} - ${pending.item}`);
  };

  return (
    <div className="container mx-auto">

      <ToDoList todos={todos} onRegister={handleRegister} />
      <PendingList pendings={pendings} onEdit={handleEdit} />
    </div>
  );
};

export default App;
