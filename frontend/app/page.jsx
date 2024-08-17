"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "./context/auth";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

// ToDoList Component
function ToDoList({ todos }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">ToDo</h2>
      <table className=" min-w-full bg-white border">
        <thead>
          <tr className="bg-pink-200">
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
                <Link href={`/orders/new?supplier_id=${todo.supplier_id}`} >
                  <button
                    className="bg-pink-500 text-white rounded px-4 py-2 hover:bg-pink-700"
                  >
                    発注登録
                  </button>
                </Link>
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
          <tr className="bg-sky-200">
            <th className="py-2 px-4 border-b">仕入先</th>

            <th className="py-2 px-4 border-b">前回の発注日</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {pendings.map((pending, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b text-center">{pending.supplier_name}</td>

              <td className="py-2 px-4 border-b text-center">{pending.order_date.split("T")[0]}</td>
              <td className="py-2 px-4 border-b text-center">
                <Link href={`/orders/${pending.order_id}?mode=edit`}>
                  <button
                    className="bg-sky-500 text-white rounded px-4 py-2 hover:bg-sky-700"

                  >
                    編集
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

// Main Component
export default function Page() {
  const [notOrdered, setNotOrdered] = useState([]);
  const [orderedPendingDelivery, setOrderedPendingDelivery] = useState([]);
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得
  useEffect(() => {
    async function fetchData() {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch(`${API_DOMAIN}/orders/todo`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }

      });
      const data = await res.json();
      console.log("retrieved data from GET /orders/todo", data);
      setNotOrdered(makeNotOrderedData(data.not_ordered));
      setOrderedPendingDelivery(data.ordered_pending_delivery);
    }
    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchData();
    }
  }, [isAuthenticated]);

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

  const handleEdit = (pending) => {
    // 編集処理
    alert(`編集`);
  };

  return (
    <div className="container mx-auto">
      <ToDoList todos={notOrdered} />
      <PendingList pendings={orderedPendingDelivery} onEdit={handleEdit} />
    </div>
  );
}