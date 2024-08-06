"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import SupplierPurchase from "./SupplierPurchase";
import useSupplier from "./useSupplier";
import Link from "next/link";

export default function SupplierDetail() {
  const { id } = useParams();
  const {
    supplier,
    purchases,
    isLoading,
    isEditing,
    updateSupplier,
    updateSupplierPurchase,
    replaceSupplierPurchase,
    addTentativeSupplierPurchase,
    setIsEditing,
    saveSupplier,
  } = useSupplier(id);
  // next_purchase_day の表示用。↑の `supplier` ではDateオブジェクトで、そのまま `input` に表示しづらい
  const [nextPurchaseDay, setNextPurchaseDayString] = useState("");
  useEffect(() => {
    if (supplier.next_purchase_day) {
      const date = new Date(supplier.next_purchase_day);
      setNextPurchaseDayString(date.toISOString().split("T")[0]);
    }
  }, [supplier.next_purchase_day]);

  const searchParams = useSearchParams(); // URLのクエリパラメータを取得するためのフック
  useEffect(() => {
    console.log("mode", searchParams.get("mode"));
    if (searchParams.get("mode") === "edit") {
      setIsEditing(true);
    }
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  //すべてtrueのときだけtrue返すので、保存してもいい状態かどうか調べてる
  const isSafeToSave = supplier.supplier_purchases.every(
    (purchase) =>
      purchase._destroy || //削除ボタンが押された状態{_destory: true} これから消すレコードについてはバリデーションしない
      !purchase.validationErrors ||
      purchase.validationErrors.length === 0
  );

  //ボタンの出し分け
  const saveOrEditButton = isEditing ? (
    <>
      <button
        className={`text-white rounded px-4 py-2
          ${isSafeToSave ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"} `}
        disabled={!isSafeToSave}
        onClick={() => {
          setIsEditing(false); /* 本当はここで保存処理 */
          saveSupplier(supplier);
        }}
      >
        保存
      </button>
      <button
        className="bg-blue-700 text-white rounded px-4 py-2 hover:bg-blue-800"
        onClick={() => addTentativeSupplierPurchase()}
      >
        新規追加
      </button>
    </>
  ) : (
    <button
      className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
      onClick={() => setIsEditing(true)}
    >
      編集
    </button>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">仕入先情報詳細</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">仕入先情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">仕入先名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={supplier.name}
              onChange={(e) => updateSupplier("name", e.target.value)}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注方法</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={supplier.how_to_order}
              onChange={(e) => updateSupplier("how_to_order", e.target.value)}
              disabled={!isEditing}
            >
              <option value="application">アプリ</option>
              <option value="direct">直接</option>
              <option value="online">オンライン</option>
              <option value="email">メール</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium">次回発注予定日</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={nextPurchaseDay}
              onChange={(e) => {
                updateSupplier("next_purchase_day", e.target.value);
              }}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注サイクル</label>
            <div className="flex items-center mt-1">
              <input
                type="text"
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={supplier.cycle_value}
                onChange={(e) => updateSupplier("cycle_value", e.target.value)}
                readOnly={!isEditing}
              />
              <select
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={supplier.cycle_unit}
                onChange={(e) => updateSupplier("cycle_unit", e.target.value)}
                disabled={!isEditing}
              >
                <option value="daily">日</option>
                <option value="weekly">週</option>
                <option value="monthly">月</option>
                <option value="yearly">年</option>
              </select>
              <span className="ml-2">ごと</span>
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
            {supplier.supplier_purchases.map(
              (item, index) =>
                !item._destroy && ( //この時点で削除フラグがついたものが抜ける
                  <SupplierPurchase
                    key={item.id}
                    supplierPurchase={item}
                    purchases={purchases}
                    selectedPurchaseIds={supplier.supplier_purchases
                      .filter((purchase) => !purchase._destroy)
                      .map((purchase) => purchase.purchase_id)}
                    isEditing={isEditing}
                    onChange={updateSupplierPurchase}
                    //onDelete={deleteSupplierPurchase}
                    replaceItem={replaceSupplierPurchase}
                  />
                )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        {saveOrEditButton}
        <Link href={`/suppliers`}>
          <button className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700">
            戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
