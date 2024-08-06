"use client";

import { useState, useEffect } from "react";

function OrderRow({ index, order, onUpdate, onDelete, purchases }) {
  const handleUpdate = (field, value) => {
    onUpdate(index, { ...order, [field]: value });
  };

  const calculateSubtotal = () => {
    return order.quantity * order.unit_price;
  };

  useEffect(() => {
    handleUpdate("subtotal", calculateSubtotal());
  }, [order.quantity, order.unit_price]);

  return (
    <tr>
      <td>
        <select
          value={order.purchase_id}
          onChange={(e) => handleUpdate("purchase_id", e.target.value)}
        >
          {purchases.map((purchase) => (
            <option key={purchase.id} value={purchase.id}>
              {purchase.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="text"
          value={order.item_number}
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </td>
      <td>
        <input
          type="number"
          value={order.quantity}
          onChange={(e) => handleUpdate("quantity", e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </td>
      <td>
        <input
          type="number"
          value={order.unit_price}
          onChange={(e) => handleUpdate("unit_price", e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </td>
      <td>
        <input
          type="text"
          value={order.subtotal}
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </td>
      <td>
        <button
          onClick={() => onDelete(index)}
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700"
        >
          削除
        </button>
      </td>
    </tr>
  );
}

export default function OrderRegistration() {
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [status, setStatus] = useState("未発注");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    async function fetchPurchases() {
      const res = await fetch("http://localhost:3000/purchases", {
        mode: "cors",
      });
      const data = await res.json();
      setPurchases(data);
    }
    fetchPurchases();
  }, []);

  const handleAddRow = () => {
    setOrders([
      ...orders,
      {
        purchase_id: "",
        item_number: "",
        quantity: 0,
        unit_price: 0,
        subtotal: 0,
      },
    ]);
  };

  const handleUpdateRow = (index, updatedOrder) => {
    const updatedOrders = orders.map((order, i) =>
      i === index ? updatedOrder : order
    );
    setOrders(updatedOrders);
    calculateTotal(updatedOrders);
  };

  const handleDeleteRow = (index) => {
    const updatedOrders = orders.filter((order, i) => i !== index);
    setOrders(updatedOrders);
    calculateTotal(updatedOrders);
  };

  const calculateTotal = (orders) => {
    const total = orders.reduce((sum, order) => sum + order.subtotal, 0);
    setTotalAmount(total);
  };

  const handleSave = () => {
    // 一時保存のロジックを追加
  };

  const handleSubmit = () => {
    // 発注登録のロジックを追加
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">発注登録</h1>
        <div>
          <span>現在の予算残額: €3000</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">ステータス</label>
        <span>{status}</span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">発注先情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">仕入先名</label>
            <select
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">選択してください</option>
              {/* 仕入先のオプションを追加 */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">発注日目安日</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">発注品情報</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">仕入品名</th>
              <th className="py-2 px-4 border-b">商品番号</th>
              <th className="py-2 px-4 border-b">数量</th>
              <th className="py-2 px-4 border-b">単価</th>
              <th className="py-2 px-4 border-b">小計</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <OrderRow
                key={index}
                index={index}
                order={order}
                onUpdate={handleUpdateRow}
                onDelete={handleDeleteRow}
                purchases={purchases}
              />
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddRow}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          新しい行を追加
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span>合計金額: €{totalAmount}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            一時保存
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            発注登録
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
