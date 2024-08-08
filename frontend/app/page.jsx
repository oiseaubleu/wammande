"use client";

import React, { useState, useEffect } from 'react';

//

// ToDoList Component
function ToDoList({ todos, onRegister }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">ToDo</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">仕入先</th>
            <th className="py-2 px-4 border-b">次回発注予定日</th>

            <th className="py-2 px-4 border-b">前回の発注日</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b  text-center">{todo.supplier_name}</td>
              <td className="py-2 px-4 border-b  text-center">{todo.next_purchase_day.split("T")[0]}</td>

              <td className="py-2 px-4 border-b  text-center">{todo.order_date.split("T")[0]}</td>
              <td className="py-2 px-4 border-b  text-center">
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
}

// PendingList Component
function PendingList({ pendings, onEdit }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">納品待ち</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">仕入先</th>
            <th className="py-2 px-4 border-b">次回発注予定日</th>

            <th className="py-2 px-4 border-b">前回の発注日</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {pendings.map((pending, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b  text-center">{pending.supplier_name}</td>
              <td className="py-2 px-4 border-b  text-center">{pending.next_purchase_day.split("T")[0]}</td>

              <td className="py-2 px-4 border-b  text-center">{pending.order_date.split("T")[0]}</td>
              <td className="py-2 px-4 border-b  text-center">
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

}

// Main Component
export default function Page() {
  const [notOrdered, setNotOrdered] = useState([]);
  const [orderedPendingDelivery, setOrderedPendingDelivery] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3000/orders/todo", {
        mode: "cors",
      });
      const data = await res.json();
      console.log(data);
      setNotOrdered(data.not_ordered);
      setOrderedPendingDelivery(data.ordered_pending_delivery);
    }
    fetchData();
  }, []);

  const handleRegister = (todo) => {
    // 発注登録処理
    alert(`発注登録`);
  };

  const handleEdit = (pending) => {
    // 編集処理
    alert(`編集`);
  };



  return (
    <div className="container mx-auto">
      <ToDoList todos={notOrdered} onRegister={handleRegister} />
      <PendingList pendings={orderedPendingDelivery} onEdit={handleEdit} />
    </div>
  );

}





// const App = () => {
//   const [budget, setBudget] = useState(3000);
//   const [todos, setTodos] = useState([
//     { supplier: 'モノプリ', nextOrderDate: '2024/09/15', status: '未発注' },
//     { supplier: '肉屋', nextOrderDate: '2024/09/25', status: '未発注' },
//     { supplier: '魚屋', nextOrderDate: '2024/09/30', status: '未発注' }
//   ]);
//   const [pendings, setPendings] = useState([
//     { supplier: 'モノプリ', nextOrderDate: '2024/09/15', status: '納品待ち' }
//   ]);

// const handleRegister = (todo) => {
//   // 発注登録処理
//   alert(`発注登録: ${todo.supplier} - ${todo.item}`);
// };

// const handleEdit = (pending) => {
//   // 編集処理
//   alert(`編集: ${pending.supplier} - ${pending.item}`);
// };

//   return (
//     <div className="container mx-auto">

//       <ToDoList todos={todos} onRegister={handleRegister} />
//       <PendingList pendings={pendings} onEdit={handleEdit} />
//     </div>
//   );
// };

// export default App;
