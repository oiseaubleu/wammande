"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderRow } from "../OrderRow";
import { useAuth } from "../../context/auth";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

/***********************************************
 * 仕入先名のドロップダウンメニュー
 ************************************************/

export function SupplierNameDropdown({ suppliers, searchTerm, onSelect, parentRef }) {
  const filteredSuppliers = suppliers?.filter((supplier) =>
    supplier.name.includes(searchTerm)
  );

  return (
    <ul
      className="absolute bg-white border border-gray-300 shadow-lg z-10 max-h-48 overflow-auto"
      style={{
        width: parentRef.current ? parentRef.current.offsetWidth : "100%",
      }}
    >
      {filteredSuppliers.map((supplier) => (
        <li
          key={supplier.id}
          className="px-4 py-2 hover:bg-indigo-200 cursor-pointer"
          onMouseDown={() => {
            onSelect(supplier);
          }}
        >
          {supplier.name}
        </li>
      ))}
    </ul>
  );
}

/***********************************************
 * 仕入先名の入力フォーム
 ************************************************/
export function SupplierName({ suppliers, inputRef, supplierSelected, initialSearchTerm }) {
  const [searchTerm, setSearchTerm] = useState(""); //検索ワード
  const [showDropdown, setShowDropdown] = useState(false); //ドロップダウンメニューの表示状態
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得

  // ドロップダウンメニューの外側をクリックしたら閉じる
  const dropdownRef = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      // ドロップダウンメニューの外側をクリックしたら閉じる
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    });
  }, []);

  // 親コンポーネントからsearchTermが渡されたら、それをセットする
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  //検索ワードが変わるたびに、ドロップダウンメニューを表示する
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      setShowDropdown(true);
    }
  };
  //選択されたら、検索ワードを更新して、ドロップダウンメニューを閉じる
  const handleSupplierSelected = (supplier) => {
    setSearchTerm(supplier.name);
    setShowDropdown(false);
    supplierSelected(supplier.id);
  };

  return (
    <>
      <input
        type="text"
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center`}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        required />
      {showDropdown && (
        <div ref={dropdownRef}>
          <SupplierNameDropdown
            suppliers={suppliers}
            searchTerm={searchTerm}
            onSelect={handleSupplierSelected}
            parentRef={inputRef} />
        </div>
      )}
    </>
  );
}

// OrderRegistration コンポーネント
export default function OrderRegistration() {
  const [orderDetails, setOrderDetails] = useState([]);
  // TODO: supplierPurchases, purchasesで名前が混乱しているので整理する
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierPurchases, setSelectedSupplierPurchases] = useState(
    []
  );
  const [supplierId, setSupplierId] = useState(null);
  const [supplierName, setSupplierName] = useState("");

  const [orderDate, setOrderDate] = useState("");
  const [status, setStatus] = useState("未発注");
  const [totalAmount, setTotalAmount] = useState(0);
  const inputRef = useRef();

  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("supplier_id") && suppliers.length > 0) {
      supplierSelected(parseInt(searchParams.get("supplier_id")));
    }
  }, [searchParams, suppliers])

  const supplierSelected = (id) => {
    setSupplierId(id);
    setSupplierName(suppliers.find((supplier) => supplier.id === id).name);
    setSelectedSupplierPurchases(
      suppliers.find((supplier) => supplier.id === id).supplier_purchases
    );
    setOrderDate(
      suppliers
        .find((supplier) => supplier.id === id)
        .next_purchase_day.split("T")[0]
    );
  };

  useEffect(() => {
    async function fetchData() {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch(`${API_DOMAIN}/orders/new`, {
        mode: "cors", headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      })
      const data = await res.json();
      console.log("retrieved data from GET /orders/new", data);
      setSuppliers(data);
    }
    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchData();
    }

  }, [isAuthenticated]);

  const handleAddRow = () => {
    setOrderDetails([
      ...orderDetails,
      {
        supplier_purchase_id: "",
        item_number: "",
        order_status: 0,
        quantity: 0,
        subtotal_amount: 0,

      },
    ]);
  };

  const handleUpdateRow = (index, updatedOrder) => {
    const updatedOrders = orderDetails.map((order, i) =>
      i === index ? updatedOrder : order
    );
    setOrderDetails(updatedOrders);
    calculateTotal(updatedOrders);
  };

  const handleDeleteRow = (index) => {
    const updatedOrders = orderDetails.filter((order, i) => i !== index);
    setOrderDetails(updatedOrders);
    calculateTotal(updatedOrders);
  };

  const calculateTotal = (orders) => {
    const total = orders.reduce((sum, order) => sum + order.subtotal_amount, 0);
    setTotalAmount(total);
  };

  /**
   * POST orders
   */
  const saveOrder = async (order) => {
    const accessToken = await getAccessToken();
    const res = await fetch(`${API_DOMAIN}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
      },
      body: JSON.stringify(order),
      mode: "cors",
    });
    const data = await res.json();
    // 登録後は詳細画面にリダイレクトする
    window.location.href = `/orders/${data.id}`;
  };

  const handleSave = () => {
    const order = {
      supplier_id: supplierId,
      order_status: 0, // 未発注
      order_date: orderDate, // 発注日目安日（未発注の場合は実際の発注日でないことに注意）
      total_amount: totalAmount,
      order_details_attributes: orderDetails,
    };
    saveOrder(order);
  };

  const handleSubmit = () => {
    const order = {
      supplier_id: supplierId,
      order_status: 1, // 発注済みに変更
      order_date: new Date().toISOString().split("T")[0], // 発注日を強制的に今日に設定
      total_amount: totalAmount,
      order_details_attributes: orderDetails.map((detail) => ({
        ...detail,
        order_status: 1, // 発注済みに変更
      })),
    };
    saveOrder(order);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">発注登録</h1>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">ステータス</label>
        <span>{status}</span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">発注先情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div ref={inputRef}>
            <label className="block text-sm font-medium">仕入先名</label>
            <SupplierName
              suppliers={suppliers}
              inputRef={inputRef}
              supplierSelected={supplierSelected}
              initialSearchTerm={supplierName}
              getAccessToken={getAccessToken}
            />
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
            {orderDetails.map((orderDetail, index) => (
              <OrderRow
                key={index}
                index={index}
                orderDetail={orderDetail}
                onUpdate={handleUpdateRow}
                onDelete={handleDeleteRow}
                supplierPurchases={selectedSupplierPurchases}
                isEditing={true}
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
          <h2 className="text-xl font-semibold mb-2">
            合計金額: €{totalAmount}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-gray-700"
          >
            一時保存
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            発注登録
          </button>
          <Link href="/orders">
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-red-700">
              戻る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}