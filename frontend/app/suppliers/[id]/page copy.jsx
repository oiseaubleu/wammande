"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SupplierRegistration() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "りんご",
      productNumber: "W123",
      price: "€1",
      comment: "ちょっとすっぱい",
    },
  ]);
  const [nextOrderDate, setNextOrderDate] = useState("");
  const [orderCycle, setOrderCycle] = useState("");
  const [orderMethod, setOrderMethod] = useState("");

  const handleAddRow = () => {
    setSuppliers([
      ...suppliers,
      {
        id: suppliers.length + 1,
        name: "",
        productNumber: "",
        price: "",
        comment: "",
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id ? { ...supplier, [field]: value } : supplier
      )
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">仕入先情報登録</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">仕入先情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">仕入先名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注方法</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="1">①</option>
              <option value="2">②</option>
              <option value="3">③</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium">次回発注予定日</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={nextOrderDate}
              onChange={(e) => setNextOrderDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注サイクル</label>
            <div className="flex items-center mt-1">
              <input
                type="number"
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={orderCycle}
                onChange={(e) => setOrderCycle(e.target.value)}
              />
              <span className="ml-2">日ごと</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">仕入品情報</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">仕入品名</th>
              <th className="py-2 px-4 border-b">商品番号</th>
              <th className="py-2 px-4 border-b">単価</th>
              <th className="py-2 px-4 border-b">仕入品コメント</th>
              <th className="py-2 px-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={supplier.name}
                    onChange={(e) =>
                      handleInputChange(supplier.id, "name", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={supplier.productNumber}
                    onChange={(e) =>
                      handleInputChange(
                        supplier.id,
                        "productNumber",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={supplier.price}
                    onChange={(e) =>
                      handleInputChange(supplier.id, "price", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={supplier.comment}
                    onChange={(e) =>
                      handleInputChange(supplier.id, "comment", e.target.value)
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDeleteRow(supplier.id)}
                    className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddRow}
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          新しい行を追加
        </button>
      </div>

      <div className="flex justify-between">
        <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700">
          登録
        </button>
        <button className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700">
          戻る
        </button>
      </div>
    </div>
  );
}
