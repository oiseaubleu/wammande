"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 仕入先一覧ページのコンポーネント
export default function Page() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //ページが読み込まれたときにAPIからデータを取ってくる
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3000/suppliers", {
        mode: "cors",
      });
      const data = await res.json();
      console.log(data);
      setSuppliers(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  //const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  //   // サンプルデータの設定
  //   setSuppliers([
  //     { id: 1, name: "MONOPRIX", next_purchase_day: "2024/08/01" },
  //     { id: 2, name: "CARREFOUR", next_purchase_day: "2024/08/01" },
  //     { id: 3, name: "GÉANT", next_purchase_day: "2024/08/01" },
  //     { id: 4, name: "UNILEVER", next_purchase_day: "2024/08/01" },
  //   ]);
  // }, []);

  const handleDelete = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  const handleEdit = (id) => {
    // Edit functionality
    console.log("Editing supplier with id:", id);
  };

  // if (!isClient) {
  //   return null; // クライアントサイドでのみレンダリングする
  // }

  return (
    <div>
      <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
        新規追加
      </button>
      {/* Render suppliers data */}
      <table className="w-full table-auto mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">仕入先名</th>
            <th className="px-4 py-2">次回発注日</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b">
              <td className="px-4 py-2">{supplier.name}</td>
              <td className="px-4 py-2">{supplier.next_purchase_day}</td>
              <td className="px-4 py-2 flex space-x-2">
                {/* <button
                  onClick={() => handleEdit(supplier.id)}
                  
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                >
                  詳細
                </button> */}
                <Link href={`/suppliers/${supplier.id}`}>
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
                    詳細
                  </button>
                </Link>
                <button
                  onClick={() => handleEdit(supplier.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
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
