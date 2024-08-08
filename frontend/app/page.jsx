// "use client";

// import React, { useState, useEffect } from 'react';



// // ToDoList Component
// function ToDoList({ todos, onRegister }) {
//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold">ToDo</h2>
//       <table className="min-w-full bg-white border">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">仕入先</th>
//             <th className="py-2 px-4 border-b">次回発注予定日</th>

//             <th className="py-2 px-4 border-b">前回の発注日</th>
//             <th className="py-2 px-4 border-b"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {todos.map((todo, index) => (
//             <tr key={index}>
//               <td className="py-2 px-4 border-b  text-center">{todo.supplier_name}</td>
//               <td className="py-2 px-4 border-b  text-center">{todo.next_purchase_day.split("T")[0]}</td>

//               <td className="py-2 px-4 border-b  text-center">{todo.order_date.split("T")[0]}</td>
//               <td className="py-2 px-4 border-b  text-center">
//                 <button
//                   className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
//                   onClick={() => onRegister(todo)}
//                 >
//                   発注登録
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // PendingList Component
// function PendingList({ pendings, onEdit }) {
//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold">納品待ち</h2>
//       <table className="min-w-full bg-white border">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">仕入先</th>
//             <th className="py-2 px-4 border-b">次回発注予定日</th>

//             <th className="py-2 px-4 border-b">前回の発注日</th>
//             <th className="py-2 px-4 border-b"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {pendings.map((pending, index) => (
//             <tr key={index}>
//               <td className="py-2 px-4 border-b  text-center">{pending.supplier_name}</td>
//               <td className="py-2 px-4 border-b  text-center">{pending.next_purchase_day.split("T")[0]}</td>

//               <td className="py-2 px-4 border-b  text-center">{pending.order_date.split("T")[0]}</td>
//               <td className="py-2 px-4 border-b  text-center">
//                 <button
//                   className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700"
//                   onClick={() => onEdit(pending)}
//                 >
//                   編集
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

// }

// // Main Component
// export default function Page() {
//   const [allDisplayDate, setAllDisplayDate] = useState([]);
//   const [notOrdered, setNotOrdered] = useState([]);
//   const [orderedPendingDelivery, setOrderedPendingDelivery] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch("http://localhost:3000/orders/todo", {
//         mode: "cors",
//       });
//       const data = await res.json();
//       console.log(data);
//       // const notOrderList = Object.values(data.not_ordered.reduce((acc, order) => {
//       //   // supplier_idが存在しないか、現在のitemのorder_dateが既存のものより新しい場合に更新する
//       //   if (!acc[order.supplier_id] || new Date(order.order_date) > new Date(acc[order.supplier_id].order_date)) {
//       //     acc[order.supplier_id] = order;
//       //   }
//       //   return acc;
//       // }
//       //   , {}));
//       // //納品待ちは、オーダーごとであり、仕入れ先ごとじゃないので、重複してても出していい
//       // // const orderedPendingDeliveryList = Object.values(data.ordered_pending_delivery.reduce((acc, order) => {
//       // //   // supplier_idが存在しないか、現在のitemのorder_dateが既存のものより新しい場合に更新する
//       // //   if (!acc[order.supplier_id] || new Date(order.order_date) > new Date(acc[order.supplier_id].order_date)) {
//       // //     acc[order.supplier_id] = order;
//       // //   }
//       // //   return acc;
//       // // }, {}));

//       // setNotOrdered(notOrderList);
//       // setOrderedPendingDelivery(data.ordered_pending_delivery);
//       setAllDisplayDate(data);
//       setNotOrdered(makeNotOrderedData(data));
//       setOrderedPendingDelivery(makeOrderedPendingDeliveryData(data));
//     }
//     fetchData();
//   }, []);


//   //重複を削除する（未発注分のみ。）
//   function filterNotOrdered(data) {
//     return Object.values(data.not_ordered.reduce((acc, order) => {
//       // supplier_idが存在しないか、現在のitemのorder_dateが既存のものより新しい場合に更新する
//       if (!acc[order.supplier_id] || new Date(order.order_date) > new Date(acc[order.supplier_id].order_date)) {
//         acc[order.supplier_id] = order;
//       }
//       return acc;
//     }
//       , {}));
//   }


//   // 日付計算関数
//   function calculateNextPurchaseDay(orderDate, cycleValue, cycleUnit) {
//     const date = new Date(orderDate);
//     switch (cycleUnit) {
//       case "daily":
//         date.setDate(date.getDate() + cycleValue);
//         break;
//       case "weekly":
//         date.setDate(date.getDate() + cycleValue * 7);
//         break;
//       case "monthly":
//         date.setMonth(date.getMonth() + cycleValue);
//         break;
//       case "yearly":
//         date.setFullYear(date.getFullYear() + cycleValue);
//         break;
//       default:
//         break;
//     }
//     return date;
//   }

//   // 今日の日付+3日以内かどうかを判定する関数
//   function isWithinNextThreeDays(date) {
//     const today = new Date();
//     const threeDaysLater = new Date(today);
//     threeDaysLater.setDate(today.getDate() + 3);
//     return date >= today && date <= threeDaysLater;
//   }

//   // 未発注データを作成する関数
//   function makeNotOrderedData(data) {
//     const filteredData = filterNotOrdered(data);

//     const result = filteredData.map(item => {
//       const nextPurchaseDay = calculateNextPurchaseDay(item.order_date, item.supplier_cycle_value, item.supplier_cycle_unit);
//       return { ...item, next_purchase_day: nextPurchaseDay };
//     })
//       .filter(item => isWithinNextThreeDays(new Date(item.next_purchase_day)));

//     return result;
//   }


//   //納品待ちデータを作成する関数
//   function makeOrderedPendingDeliveryData(data) {
//     const result = data.map(item => {
//       const nextPurchaseDay = calculateNextPurchaseDay(item.order_date, item.supplier_cycle_value, item.supplier_cycle_unit);
//       return { ...item, next_purchase_day: nextPurchaseDay };
//     })
//       .filter(item => isWithinNextThreeDays(new Date(item.next_purchase_day)));

//     return result;
//   }


//   const handleRegister = (todo) => {
//     // 発注登録処理
//     alert(`発注登録`);
//   };

//   const handleEdit = (pending) => {
//     // 編集処理
//     alert(`編集`);
//   };



//   return (
//     <div className="container mx-auto">
//       <ToDoList todos={notOrdered} onRegister={handleRegister} />
//       <PendingList pendings={orderedPendingDelivery} onEdit={handleEdit} />
//     </div>
//   );

// }





// // const App = () => {
// //   const [budget, setBudget] = useState(3000);
// //   const [todos, setTodos] = useState([
// //     { supplier: 'モノプリ', nextOrderDate: '2024/09/15', status: '未発注' },
// //     { supplier: '肉屋', nextOrderDate: '2024/09/25', status: '未発注' },
// //     { supplier: '魚屋', nextOrderDate: '2024/09/30', status: '未発注' }
// //   ]);
// //   const [pendings, setPendings] = useState([
// //     { supplier: 'モノプリ', nextOrderDate: '2024/09/15', status: '納品待ち' }
// //   ]);

// // const handleRegister = (todo) => {
// //   // 発注登録処理
// //   alert(`発注登録: ${todo.supplier} - ${todo.item}`);
// // };

// // const handleEdit = (pending) => {
// //   // 編集処理
// //   alert(`編集: ${pending.supplier} - ${pending.item}`);
// // };

// //   return (
// //     <div className="container mx-auto">

// //       <ToDoList todos={todos} onRegister={handleRegister} />
// //       <PendingList pendings={pendings} onEdit={handleEdit} />
// //     </div>
// //   );
// // };

// // export default App;



"use client";

import React, { useState, useEffect } from 'react';

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
              <td className="py-2 px-4 border-b text-center">{todo.supplier_name}</td>
              <td className="py-2 px-4 border-b text-center">{todo.next_purchase_day.split("T")[0]}</td>
              <td className="py-2 px-4 border-b text-center">{todo.order_date.split("T")[0]}</td>
              <td className="py-2 px-4 border-b text-center">
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
              <td className="py-2 px-4 border-b text-center">{pending.supplier_name}</td>
              <td className="py-2 px-4 border-b text-center">{pending.next_purchase_day.split("T")[0]}</td>
              <td className="py-2 px-4 border-b text-center">{pending.order_date.split("T")[0]}</td>
              <td className="py-2 px-4 border-b text-center">
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
      setNotOrdered(makeNotOrderedData(data.not_ordered));
      setOrderedPendingDelivery(data.ordered_pending_delivery);
    }
    fetchData();
  }, []);

  // 重複を削除する（未発注分のみ。）
  function filterNotOrdered(data) {
    return Object.values(data.reduce((acc, order) => {
      // supplier_idが存在しないか、現在のitemのorder_dateが既存のものより新しい場合に更新する
      if (!acc[order.supplier_id] || new Date(order.order_date) > new Date(acc[order.supplier_id].order_date)) {
        acc[order.supplier_id] = order;
      }
      return acc;
    }, {}));
  }

  // 日付計算関数
  function calculateNextPurchaseDay(orderDate, cycleValue, cycleUnit) {
    const date = new Date(orderDate);
    switch (cycleUnit) {
      case "daily":
        date.setDate(date.getDate() + cycleValue);
        break;
      case "weekly":
        date.setDate(date.getDate() + cycleValue * 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + cycleValue);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + cycleValue);
        break;
      default:
        break;
    }
    return date;
  }

  // 今日の日付+3日以内かどうかを判定する関数
  function isWithinNextThreeDays(date) {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    return date >= today && date <= threeDaysLater;
  }

  // 未発注データを作成する関数
  function makeNotOrderedData(data) {
    const filteredData = filterNotOrdered(data);
    const result = filteredData.map(item => {
      const nextPurchaseDay = calculateNextPurchaseDay(item.order_date, item.supplier_cycle_value, item.supplier_cycle_unit);
      return { ...item, next_purchase_day: nextPurchaseDay.toISOString() };
    }).filter(item => isWithinNextThreeDays(new Date(item.next_purchase_day)));
    return result;
  }

  // 納品待ちデータを作成する関数
  function makeOrderedPendingDeliveryData(data) {
    const result = data.map(item => {
      const nextPurchaseDay = calculateNextPurchaseDay(item.order_date, item.supplier_cycle_value, item.supplier_cycle_unit);
      return { ...item, next_purchase_day: nextPurchaseDay.toISOString() };
    }).filter(item => isWithinNextThreeDays(new Date(item.next_purchase_day)));
    return result;
  }

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
