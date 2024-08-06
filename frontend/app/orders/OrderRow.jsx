"use client";
import { useState, useRef, useEffect } from "react";
import { SupplierNameDropdown } from "./new/page";

// TODO: これを別のコンポーネントに切り出しておく！
// ordersの直下に OrderRow.jsx の形でおいておく
/***********************************************
 * 仕入先名の入力フォーム
 ************************************************/
export function SupplierName({ suppliers, inputRef, supplierSelected }) {
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
/***********************************************
 * 仕入品名のドロップダウンメニュー
 ************************************************/
function PurchaseNameDropdown({ purchases, searchTerm, onSelect, parentRef }) {
  const filteredPurchases = purchases.filter((purchase) => purchase.purchase_name.includes(searchTerm)
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
function PurchaseName({ purchases, inputRef, itemSelected }) {
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
    setSearchTerm(purchase.purchase_name);
    setShowDropdown(false);
    itemSelected(purchase.id);
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
          <PurchaseNameDropdown
            purchases={purchases}
            searchTerm={searchTerm}
            onSelect={handleItemSelected}
            parentRef={inputRef} />
        </div>
      )}
    </>
  );
}
////////////////////////////////////////////////////////////////////
// OrderRow コンポーネント
export function OrderRow({ index, order, onUpdate, onDelete, supplierPurchases }) {
  const [supplierPurchaseId, setSupplierPurchaseId] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectedItemNumber, setSelectedItemNumber] = useState("");
  const inputRef = useRef();

  const handleUpdate = (field, value) => {
    console.log("field", field, "value", value);
    onUpdate(index, { ...order, [field]: value });
  };

  const calculateSubtotal = () => {
    return order.quantity * supplierPurchases[supplierPurchaseId]?.price;
  };

  useEffect(() => {
    handleUpdate("subtotal_amount", calculateSubtotal());
  }, [order.quantity, supplierPurchaseId]);

  const itemSelected = (id) => {
    setSupplierPurchaseId(id);
    const targetSupplierPurchase = supplierPurchases.find(
      (supplierPurchase) => supplierPurchase.id === id
    );
    const itemNumber = targetSupplierPurchase.item_number;
    setSelectedItemNumber(itemNumber ? itemNumber : "none");
    setPrice(targetSupplierPurchase.price);

    handleUpdate("supplier_purchase_id", id);
    console.log(id, supplierPurchases[id], supplierPurchases);
  };

  return (
    <tr>
      <td>
        <div ref={inputRef}>
          <PurchaseName
            purchases={supplierPurchases}
            inputRef={inputRef}
            itemSelected={itemSelected} />
        </div>
      </td>
      <td>
        <input
          type="text"
          value={selectedItemNumber}
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </td>
      <td>
        <input
          type="number"
          value={order.quantity}
          onChange={(e) => handleUpdate("quantity", e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </td>
      <td>
        <input
          type="number"
          value={price}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          readOnly />
      </td>
      <td>
        <input
          type="text"
          value={order.subtotal_amount}
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
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
