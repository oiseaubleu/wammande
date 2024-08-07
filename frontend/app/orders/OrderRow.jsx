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
 * 
 * purchases ... supplierPurchasesの配列
 * inputRef ... 親要素のRef。割とどうでもいい
 * itemSelected ... ドロップダウンからアイテムを選択したときに動く関数。引数は supplier_purchase_id 
 ************************************************/
function PurchaseName({ purchases, inputRef, itemSelected, initialSearchTerm }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || ""); //検索ワード
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



/**
 * OrderRow ... OrderDetailの１行分を表すコンポーネント
 * 
 * index ... OrderDetail自体のID
 * orderDetail ... order.order_detailsの中の１レコード分。元の order はこのコンポーネントを呼び出す親側で管理されている
 * onUpdate ... このorderDetailに変更があった場合に、もとのorder.order_detailsを更新する
 * onDelete ... このorderDetailが削除された場合に、もとのorder.order_detailsから削除（もしくは更新）する
 * supplierPurchases ... orderDetail.supplier_id の仕入れ先の持っている仕入れ品すべて。配列
 */
export function OrderRow({ index, orderDetail, onUpdate, onDelete, supplierPurchases, isEditing }) {
  const [supplierPurchaseId, setSupplierPurchaseId] = useState(orderDetail.supplier_purchase_id);
  const [price, setPrice] = useState(supplierPurchases.find((sp) => sp.id === orderDetail.supplier_purchase_id)?.price);
  const [selectedItemNumber, setSelectedItemNumber] = useState(supplierPurchases.find((sp) => sp.id === orderDetail.supplier_purchase_id)?.item_number);
  const inputRef = useRef();

  const handleUpdate = (field, value) => {
    console.log("field", field, "value", value);
    onUpdate(index, { ...orderDetail, [field]: value });
  };

  const calculateSubtotal = () => {
    const targetSupplierPurchase = supplierPurchases.find(
      (supplierPurchase) => supplierPurchase.id === orderDetail.supplier_purchase_id
    );
    console.log(targetSupplierPurchase);
    return orderDetail.quantity * price;
  };

  useEffect(() => {
    handleUpdate("subtotal_amount", calculateSubtotal());
  }, [orderDetail?.quantity, supplierPurchaseId]);

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
            itemSelected={itemSelected}
            initialSearchTerm={orderDetail.purchase_name}
          />
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
          value={orderDetail?.quantity}
          readOnly={!isEditing}
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
          value={orderDetail?.subtotal_amount}
          readOnly
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </td>
      <td>
        <input
          type="text"
          value={orderDetail?.order_status}
          readOnly={!isEditing}
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
