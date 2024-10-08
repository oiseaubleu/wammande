"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/auth";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function OrderList() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState({});
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得

  //ordersのデータを取得
  useEffect(() => {
    async function fetchOrderData() {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch(`${API_DOMAIN}/orders`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      const data = await res.json();
      console.log("retrieved data from GET /orders", data);
      setOrders(data);
      setIsLoading(false);
    }

    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchOrderData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    async function fetchSupplierData() {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch(`${API_DOMAIN}/suppliers`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット''
        }
      });
      const supplierList = await res.json();
      console.log("retrieved data from GET /suppliers", supplierList);
      setSuppliers(
        supplierList.reduce(
          (obj, item) => ((obj[item.id] = { ...item }), obj),
          {}
        )
      );
      setIsLoading(false);
    }

    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchSupplierData();
    }



  }, [isAuthenticated]);

  const handleSearch = async () => {
    const accessToken = await getAccessToken();

    const query = new URLSearchParams({
      supplier_name: document.querySelector('input[name="supplier_name"]').value,
      purchase_name: itemName,
      status: status,
      order_date: document.querySelector('input[name="order_date"]').value
    }).toString();

    console.log("Query params:", query);  // クエリパラメータを確認
    const res = await fetch(`${API_DOMAIN}/orders?${query}`, {
      mode: "cors",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    const data = await res.json();
    console.log("Search results:", data);  // 取得したデータを確認
    setOrders(data);
  };

  const handleSortByDate = () => {
    const sortedOrders = [...orders].sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );
    setOrders(sortedOrders);
  };


  const handleDelete = (id) => {
    async function deleteData(id) {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch(`${API_DOMAIN}/orders/${id}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      setOrders(orders.filter((order) => order.id !== id));
    }
    if (confirm("この発注情報を本当に削除しますか?")) {
      deleteData(id);
    }
  };


  if (isLoading) {
    return <div>Loading...!!</div>;
  }

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case "not_ordered":
        return "未発注";
      case "ordered_pending_delivery":
        return "納品待ち";
      case "order_cancelled":
        return "発注キャンセル";
      case "delivered":
        return "納品済";
      case "delivery_cancelled":
        return "納品キャンセル";
      default:
        return status;
    }
  };




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
              name="supplier_name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">仕入品名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">ステータス</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">全て</option>
              <option value="not_ordered">未発注</option>
              <option value="ordered_pending_delivery">納品待ち</option>
              <option value="delivered">納品済み</option>
              <option value="order_cancelled">発注キャンセル</option>
              <option value="delivery_cancelled">納品キャンセル</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">発注登録日</label>
            <input
              type="date"
              name="order_date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
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
              <td className="py-2 px-4 border-b">{getOrderStatusLabel(order.order_status)}</td>
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