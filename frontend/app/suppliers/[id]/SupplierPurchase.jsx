"use client";

import { useState, useEffect, useRef } from "react";

/**
 * 仕入れ品名のドロップダウンメニュー
 *  - 仕入れ品名の入力フォームの下に表示される
 * - 仕入れ品名の候補を表示する
 * - クリックで選択できる
 * - 選択されたら、入力フォームに反映される
 * - 既存の仕入れ品名は選択不可
 * - 新規の仕入れ品名は選択可能
 * - 仕入れ品名の絞り込み機能
 *
 * @param {Array} purchases - 仕入れ品リスト(配列に仕入品のオブジェクトが入ってる)
 * @param {string} searchTerm - 絞り込み検索のキーワード
 * @param {function} onSelect - 仕入れ品名が選択されたときのコールバック
 * @param {object} parentRef - 仕入れ品名の入力フォームのRef　親要素の幅を取得するために使用
 * @returns {JSX.Element} - 仕入れ品名のドロップダウンメニュー
 *
 */

function PurchaseNameDropdown({ purchases, searchTerm, onSelect, parentRef }) {
  const filteredPurchases = purchases.filter((purchase) =>
    purchase.name.includes(searchTerm)
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
          {purchase.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * 仕入れ品名の入力フォーム
 * - 仕入れ品名の絞り込み機能
 * - 仕入れ品名が選択されたら、入力フォームに反映される
 * - 仕入れ品名が選択されたら、ドロップダウンメニューを閉じる
 *
 * @param {Array} purchases - 仕入れ品リスト(配列に仕入品のオブジェクトが入ってる)
 * @param {object} inputRef - 仕入れ品名の入力フォームのRef
 * @param {boolean} isEditing - 編集モードかどうか
 * @param {function} itemSelected - 仕入れ品名が選択されたときのコールバック
 * @returns {JSX.Element} - 仕入れ品名の入力フォーム
 *
 */

function SupplierName({ purchases, inputRef, isEditing, itemSelected }) {
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

/**
 * 仕入先仕入れ品 SupplierPurchaseのコンポーネント
 *
 * 仕入れ情報詳細ページの中のテーブルの行1行分を表す
 * - 仕入れ品名 … 既存のレコードの場合は修正不可。新規アイテムの場合は入力フォームで、絞り込みから選択可能
 * - 商品番号 … 入力フォーム
 * - 単価 … 入力フォーム
 * - コメント … 入力フォーム
 * - 保存ボタン … 既存のレコードの場合は削除ボタン、新規アイテムの場合は保存ボタン
 * - 削除ボタン … 既存のレコードの場合のみ表示
 * - 保存ボタンを押すと、親コンポーネントのStateを更新する
 * - 削除ボタンを押すと、親コンポーネントのStateを更新する
 * - 仕入れ品名の選択があった場合、親コンポーネントのStateを更新する
 * - 仕入れ品名の選択があった場合、表示されている仕入れ品名も更新する
 *
 * @param {number} index - 仕入れ品のインデックス(SupplierPurchaseのID)
 * @param {object} supplierPurchase - 仕入れ品の情報
 * @param {object} purchases - 仕入れ品リスト
 * @param {Array} selectedPurchaseIds - 選択された仕入れ品のIDリスト
 * @param {boolean} isEditing - 編集モードかどうか
 * @param {function} onChange - 仕入れ品の情報が変更されたときのコールバック
 * @param {function} replaceItem - 仕入れ品の情報を更新するコールバック
 * @returns {JSX.Element} - 仕入先仕入れ品のコンポーネント
 *
 *
 */
function SupplierPurchase({
  index,
  supplierPurchase,
  purchases,
  selectedPurchaseIds,
  isEditing,
  onChange,
  replaceItem,
}) {
  // 個別の仕入れ品の状態を管理するためのState
  const [purchaseId, setPurchaseId] = useState(supplierPurchase.purchase_id);
  const [itemNumber, setItemNumber] = useState(supplierPurchase.item_number);
  const [price, setPrice] = useState(supplierPurchase.price);
  const [comment, setComment] = useState(supplierPurchase.comment);
  const [validationErrors, setValidationErrors] = useState([]);
  // 仕入れ品名の選択があった場合、親コンポーネントのStateを更新する
  const inputRef = useRef();
  // 新規追加の仕入れ品のリスト
  const purchasesForDropdown = Object.values(purchases).filter(
    (purchase) => !selectedPurchaseIds.includes(purchase.id)
  );

  // 仕入れ品の情報が変更されたときにStateを更新する(バリデーション・選択されたIDのセット・新規の仕入品更新)
  useEffect(() => {
    const errors = [];
    if (!purchaseId) {
      errors.push({ message: "仕入れ商品を選んでね", item: "purchase_id" });
    }
    if (!itemNumber) {
      errors.push({ message: "商品番号を入力してね", item: "item_number" });
    }
    const parsedPrice = parseFloat(price);
    if (price !== "" && !isNaN(parsedPrice) && parsedPrice < 0) {
      errors.push({ message: "単価を入力してね (0以上の数値)", item: "price" });
    }
    setValidationErrors(errors);
    onChange(supplierPurchase.id, "validationErrors", errors);
  }, [purchaseId, itemNumber, price]);

  const itemSelected = (id) => {
    setPurchaseId(id);
  };
  const confirmNewItem = () => {
    const itemToReplace = {
      ...supplierPurchase,
      purchase_id: purchaseId,
      item_number: itemNumber,
      price: price,
      comment: comment,
      isNewItem: false, //ボタンの表示を変えるため
    };
    replaceItem(supplierPurchase.id, itemToReplace);
  };

  const deleteColor = isEditing ? "bg-red-500" : "bg-gray-300";
  const hasErrors = (item) =>
    validationErrors.some((error) => error.item === item);
  const errorMessage = (item) =>
    hasErrors(item) && (
      <div className="text-red-500 text-xs">
        {validationErrors
          .filter((error) => error.item === item)
          .map((error, index) => (
            <span key={`${error.message}-${index}`}>{error.message}</span>
          ))}
      </div>
    );

  // 仕入れ品の名前で検索する→選択したらPurchase IDを更新する→表示されてる名前も変わる
  // 仕入れ品の変更があった場合、親のコンポーネントが持っているStateをいい感じに更新してあげる必要がある
  // なんだけど、個々のSupplierPurchaseに保存ボタンを持つとうざいので、裏でいい感じに更新しないといけない
  return (
    <tr key={index}>
      <td className="py-2 px-4 border-b">
        <div ref={inputRef}>
          <input type="hidden" value={purchaseId} />
          {supplierPurchase.isNewItem ? (
            <SupplierName
              purchases={purchasesForDropdown}
              inputRef={inputRef}
              isEditing={isEditing}
              itemSelected={itemSelected}
            />
          ) : (
            <input
              type="text"
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center ${!isEditing ? "bg-gray-200" : ""}`}
              value={purchases[purchaseId]?.name}
              readOnly
            />
          )}
        </div>
        {errorMessage("purchase_id")}
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center
            ${!isEditing ? "bg-gray-200" : ""}
            ${validationErrors.some((error) => error.item === "item_number") ? "border-red-500" : ""}
            `}
          value={itemNumber}
          onChange={(e) => {
            setItemNumber(e.target.value);
            onChange(supplierPurchase.id, "item_number", e.target.value);
          }}
          required
          readOnly={!isEditing}
        />
        {errorMessage("item_number")}
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center ${!isEditing ? "bg-gray-200" : ""}`}
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            onChange(supplierPurchase.id, "price", e.target.value);
          }}
          required
          readOnly={!isEditing}
        />
        {errorMessage("price")}
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center ${!isEditing ? "bg-gray-200" : ""}`}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            onChange(supplierPurchase.id, "comment", e.target.value);
          }}
          readOnly={!isEditing}
        />
      </td>
      <td className="py-2 px-4 border-b">
        {supplierPurchase.isNewItem ? (
          <button
            className={`text-white rounded px-4 py-2 ${validationErrors.length === 0 ? "bg-green-400 hover:bg-green-600" : "bg-gray-300"}`}
            onClick={confirmNewItem}
            disabled={validationErrors.length > 0}
          >
            OK
          </button>
        ) : (
          <button
            className={`${deleteColor} text-white rounded px-4 py-2 hover:bg-red-700 ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}
            onClick={() => {
              onChange(supplierPurchase.id, "_destroy", true);
            }}
            disabled={!isEditing}
          >
            削除
          </button>
        )}
      </td>
    </tr>
  );
}

export default SupplierPurchase;
