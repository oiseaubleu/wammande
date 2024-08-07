"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderList() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState({});
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);



  //ordersのデータを取得
  useEffect(() => {
    async function fetchOrderData() {
      const res = await fetch("http://localhost:3000/orders", {
        mode: "cors",
      });
      const data = await res.json();
      console.log(data);
      setOrders(data);
      setIsLoading(false);
    }
    fetchOrderData();
  }, []);


  useEffect(() => {
    async function fetchSupplierData() {
      const res = await fetch("http://localhost:3000/suppliers", {
        mode: "cors",
      });
      const supplierList = await res.json();
      console.log(supplierList);
      setSuppliers(
        supplierList.reduce(
          (obj, item) => ((obj[item.id] = { ...item }), obj),
          {}
        )
      );
      setIsLoading(false);
    }
    fetchSupplierData();
  }, []);




  const handleSearch = () => {
    // 検索ロジックを追加します。
    console.log("Search clicked");
  };

  const handleSortByDate = () => {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );
    setOrders(sortedOrders);
  };


  const handleDelete = (id) => {
    async function deleteData(id) {
      const res = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE",
        mode: "cors",
      });
      setOrders(orders.filter((order) => order.id !== id));
    }
    if (confirm("この発注情報を本当に削除しますか?")) {
      deleteData(id);
    }
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">発注一覧</h1>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">仕入先名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            // value={supplierName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">仕入品名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={itemName}
            // onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ステータス</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={status}
            // onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">全て</option>
              <option value="納品待ち">納品待ち</option>
              <option value="納品済み">納品済み</option>
            </select>
          </div>
        </div>
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          検索
        </button>
      </div>

      <div className="mb-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={handleSortByDate}
        >
          発注日を最近の順にする
        </button>
      </div>
      <Link href="/orders/new">
        <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
          新規追加
        </button>
      </Link>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">発注日</th>
            <th className="py-2 px-4 border-b">仕入先</th>
            <th className="py-2 px-4 border-b">ステータス</th>
            <th className="py-2 px-4 border-b">発注金額</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-2 px-4 border-b">{order.order_date.split("T")[0]}</td>
              <td className="py-2 px-4 border-b">
                {suppliers[order.supplier_id]?.name || "不明"}
              </td>
              <td className="py-2 px-4 border-b">{order.order_status}</td>
              <td className="py-2 px-4 border-b">€{order.total_amount}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/orders/${order.id}`}>
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-700">
                    詳細
                  </button>
                </Link>
                <Link href={`/orders/${order.id}?mode=edit`}>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    編集
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
