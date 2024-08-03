"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [purchases, setPurchases] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderData() {
      const res = await fetch(`http://localhost:3000/orders/${id}`, {
        mode: "cors",
      });
      const data = await res.json();
      console.log(data);
      setOrder(data);
      setIsLoading(false);
    }
    fetchOrderData();
  }, [id]);

  useEffect(() => {
    async function fetchPurchaseData() {
      const res = await fetch(`http://localhost:3000/purchases`, {
        mode: "cors",
      });
      const purchaseList = await res.json();
      console.log(purchaseList);
      setPurchases(
        purchaseList.reduce(
          (obj, item) => ((obj[item.id] = { ...item }), obj),
          {}
        )
      );
    }
    fetchPurchaseData();
  }, []);

  const handleEdit = () => {
    console.log("Edit button clicked");
  };

  const handlePDFExport = () => {
    console.log("PDF Export button clicked");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">発注内容詳細</h1>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">ステータス</label>
        <div className="flex items-center">
          <span className="bg-yellow-300 p-2 rounded mr-2">
            {order.order_status}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">発注先情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">仕入先名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={order.supplier_name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注日</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={order.order_date}
              readOnly
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
              <th className="py-2 px-4 border-b">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {order.order_details.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">
                  {purchases[item.supplier_purchase_id]?.name || "不明"}
                </td>
                <td className="py-2 px-4 border-b">
                  {purchases[item.supplier_purchase_id]?.item_number || "不明"}
                </td>
                <td className="py-2 px-4 border-b">{item.quantity}</td>
                <td className="py-2 px-4 border-b">
                  {purchases[item.supplier_purchase_id]?.item_price || "不明"}
                </td>
                <td className="py-2 px-4 border-b">{item.subtotal_amount}</td>
                <td className="py-2 px-4 border-b">{item.order_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xl">
          合計金額: <span className="font-bold">€{order.total_amount}</span>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handlePDFExport}
        >
          PDF出力
        </button>
      </div>

      <div className="flex justify-between mt-8">
        <button
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
          onClick={handleEdit}
        >
          編集
        </button>
        <Link href={`/orders`}>
          <button className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700">
            戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
