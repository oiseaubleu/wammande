"use client";

import { useState, useEffect, useRef } from "react";

/***********************************************
 * 仕入先情報を取得
 ************************************************/

function fetchSuppliers() {
  return fetch("http://localhost:3000/orders/new", { mode: "cors" })
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching suppliers:", error));
}

/***********************************************
 * 仕入先名のドロップダウンメニュー
 ************************************************/

function SupplierNameDropdown({ suppliers, searchTerm, onSelect, parentRef }) {
  const filteredSuppliers = suppliers.filter((supplier) =>
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
function SupplierName({ suppliers, inputRef, supplierSelected }) {
  const [searchTerm, setSearchTerm] = useState(""); //検索ワード
  const [showDropdown, setShowDropdown] = useState(false); //ドロップダウンメニューの表示状態

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
        required
      />
      {showDropdown && (
        <div ref={dropdownRef}>
          <SupplierNameDropdown
            suppliers={suppliers}
            searchTerm={searchTerm}
            onSelect={handleSupplierSelected}
            parentRef={inputRef}
          />
        </div>
      )}
    </>
  );
}

/***********************************************
 * 仕入品名のドロップダウンメニュー
 ************************************************/

function PurchaseNameDropdown({ purchases, searchTerm, onSelect, parentRef }) {
  const filteredPurchases = purchases.filter((purchase) =>
    purchase.purchase_name.includes(searchTerm)
  );

  return (
    <ul
      className="absolute bg-white border border-gray-300 shadow-lg z-10 max-h-48 overflow-auto"
      style={{
        width: parentRef.current ? parentRef.current.offsetWidth : "100%",
      }}
    >
      {filteredPurchases.map((purchase) => (
        <li
          key={purchase.id}
          className="px-4 py-2 hover:bg-indigo-200 cursor-pointer"
          onMouseDown={() => {
            onSelect(purchase);
          }}
        >
          {purchase.purchase_name}
        </li>
      ))}
    </ul>
  );
}

/***********************************************
 * 仕入品名の入力フォーム
 ************************************************/
function PurchaseName({ purchases, inputRef, isEditing, itemSelected }) {
  const [searchTerm, setSearchTerm] = useState(""); //検索ワード
  const [showDropdown, setShowDropdown] = useState(false); //ドロップダウンメニューの表示状態

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
  //検索ワードが変わるたびに、ドロップダウンメニューを表示する
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      setShowDropdown(true);
    }
  };
  //選択されたら、検索ワードを更新して、ドロップダウンメニューを閉じる
  const handleItemSelected = (purchase) => {
    setSearchTerm(purchase.name);
    setShowDropdown(false);
    itemSelected(purchase.id);
  };

  return (
    <>
      <input
        type="text"
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center ${!isEditing ? "bg-gray-200" : ""}`}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        required
      />
      {isEditing && showDropdown && (
        <div ref={dropdownRef}>
          <PurchaseNameDropdown
            purchases={purchases}
            searchTerm={searchTerm}
            onSelect={handleItemSelected}
            parentRef={inputRef}
          />
        </div>
      )}
    </>
  );
}

////////////////////////////////////////////////////////////////////

// OrderRow コンポーネント
function OrderRow({ index, order, onUpdate, onDelete, purchases }) {
  const inputRef = useRef();

  const handleUpdate = (field, value) => {
    onUpdate(index, { ...order, [field]: value });
  };

  const calculateSubtotal = () => {
    return order.quantity * order.unit_price;
  };

  useEffect(() => {
    handleUpdate("subtotal", calculateSubtotal());
  }, [order.quantity, order.unit_price]);

  const itemSelected = (purchaseId) => {
    handleUpdate("purchase_id", purchaseId);
  };

  return (
    <tr>
      <td>
        <div ref={inputRef}>
          <PurchaseName
            purchases={purchases}
            inputRef={inputRef}
            itemSelected={itemSelected}
          />
        </div>
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

// OrderRegistration コンポーネント
export default function OrderRegistration() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [status, setStatus] = useState("未発注");
  const [totalAmount, setTotalAmount] = useState(0);
  const inputRef = useRef();

  const supplierSelected = (id) => {
    setSupplierName(suppliers.find((supplier) => supplier.id === id).name);
    setPurchases(
      suppliers.find((supplier) => supplier.id === id).supplier_purchases
    );
  };

  useEffect(() => {
    async function fetchData() {
      const suppliersData = await fetchSuppliers();
      setSuppliers(suppliersData);
    }

    fetchData();
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
