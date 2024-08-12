"use client";
import { useState, useRef, useEffect } from "react";

/***********************************************
 * 仕入品名のドロップダウンメニュー
 ************************************************/
function PurchaseNameDropdown({ purchases, searchTerm, onSelect, parentRef }) {
  const filteredSupplierPurchases = purchases.filter(
    (supplierPurchase) => supplierPurchase.purchase_name.includes(searchTerm)
  );

  return (
    <ul
      className="absolute bg-white border border-gray-300 shadow-lg z-10 max-h-48 overflow-auto"
      style={{
        width: parentRef.current ? parentRef.current.offsetWidth : "100%",
      }}
    >
      {filteredSupplierPurchases.map((supplierPurchase) => (
        <li
          key={supplierPurchase.id}
          className="px-4 py-2 hover:bg-indigo-200 cursor-pointer"
          onMouseDown={() => {
            onSelect(supplierPurchase);
          }}
        >
          {supplierPurchase.purchase_name}
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
  const handleItemSelected = (supplierPurchase) => {
    setSearchTerm(supplierPurchase.purchase_name);
    setShowDropdown(false);
    itemSelected(supplierPurchase.id);
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
    const updatedOrderDetail = { ...orderDetail, [field]: value };
    onUpdate(index, updatedOrderDetail);
  };

  const handleQuantityChange = (quantity) => {
    onUpdate(index, {
      ...orderDetail,
      quantity,
      subtotal_amount: quantity * price,
    });
  }

  /**
   * プルダウンでSupplierPurchaseのアイテムが選択されたときに動く処理
   * - 自分自信が持っている画面表示用のState (supplierPurchaseId, selectedItemNumber, price) を更新
   * - 親コンポーネントで管理されているorderDetailを更新
   * 
   * @param {number} id supplierPurchaseのID
   */
  const itemSelected = (id) => {
    setSupplierPurchaseId(id);
    const targetSupplierPurchase = supplierPurchases.find(
      (supplierPurchase) => supplierPurchase.id === id
    );
    const itemNumber = targetSupplierPurchase.item_number;
    setSelectedItemNumber(itemNumber ? itemNumber : "none");
    setPrice(targetSupplierPurchase.price);

    onUpdate(index, {
      ...orderDetail,
      supplier_purchase_id: id,
      item_number: itemNumber,
      subtotal_amount: orderDetail.quantity * targetSupplierPurchase.price,
    });
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
          onChange={(e) => handleQuantityChange(e.target.value)}
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
        <select
          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={orderDetail?.order_status}
          onChange={(e) => handleUpdate("order_status", e.target.value)}
          disabled={!isEditing}
        >
          <option value="not_ordered">未発注</option>
          <option value="ordered_pending_delivery">発注済（納品待ち）</option>
          <option value="order_cancelled">発注キャンセル</option>
          <option value="delivered">納品済</option>
          <option value="delivery_cancelled">納品キャンセル</option>
        </select>


        {/* <input
          type="text"
          value={orderDetail?.order_status}
          readOnly={!isEditing}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" /> */}
      </td>
      <td>
        <button
          onClick={() => onDelete(index)}
          className={`text-white rounded px-4 py-2 ${isEditing ? "bg-red-500 hover:bg-red-700" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!isEditing}
        >
          削除
        </button>
      </td>
    </tr>
  );
}