"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function SupplierPurchase({
  index,
  supplierPurchase,
  purchases,
  isEditing,
  onChange,
}) {
  const [purchaseId, setPurchaseId] = useState(supplierPurchase.id);
  const [itemNumber, setItemNumber] = useState(supplierPurchase.item_number);
  const [price, setPrice] = useState(supplierPurchase.price);
  const [comment, setComment] = useState(supplierPurchase.comment);

  // 仕入れ品の名前で検索する→選択したらPurchase IDを更新する→表示されてる名前も変わる
  // 仕入れ品の変更があった場合、親のコンポーネントが持っているStateをいい感じに更新してあげる必要がある
  // なんだけど、個々のSupplierPurchaseに保存ボタンを持つとうざいので、裏でいい感じに更新しないといけない
  return (
    <tr key={index}>
      {" "}
      {/* ここのindexは何行目かを表すだけ */}
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
          value={purchases[purchaseId].name}
          readOnly={!isEditing}
        />
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
          value={itemNumber}
          onChange={(e) => {
            setItemNumber(e.target.value);
            onChange(supplierPurchase.id, {
              id: purchaseId,
              item_number: itemNumber,
              price: price,
              comment: comment,
            });
          }}
          readOnly={!isEditing}
        />
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          readOnly={!isEditing}
        />
      </td>
      <td className="py-2 px-4 border-b">
        <input
          type="text"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-center"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          readOnly={!isEditing}
        />
      </td>
      {/* <td className="py-2 px-4 border-b">
      <button className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700" onClick={() => handleDeleteItem(index)}>削除</button>
    </td> */}
    </tr>
  );
}

export default function SupplierDetail() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [purchases, setPurchases] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchSupplierData() {
      if (id) {
        const res = await fetch(`http://localhost:3000/suppliers/${id}`, {
          mode: "cors",
        });
        const data = await res.json();
        console.log(data);
        setSupplier(data);
        setIsLoading(false);
      }
    }
    fetchSupplierData();
  }, [id]);

  useEffect(() => {
    async function fetchPurchaseData() {
      const res = await fetch(`http://localhost:3000/purchases`, {
        mode: "cors",
      });
      const purchaseList = await res.json();
      console.log(purchaseList);
      setPurchases(
        // ここで、オブジェクトの配列→オブジェクトに変換してる！ [{id:1, ...}, {id:2, ...}, {}] -> {1: {}, 2: {}, ...}
        // こうすることで、PurchaseのIDから目的のPurchaseオブジェクトにすぐにたどり着けるようになる
        purchaseList.reduce(
          (obj, item) => ((obj[item.id] = { ...item }), obj),
          {}
        )
      );
    }
    fetchPurchaseData();
  }, []);

  const editSupplierPurchase = (id, supplierPurchase) => {
    const updatedSupplierPurchases = supplier.supplier_purchases.map((item) =>
      item.id === id ? supplierPurchase : item
    );
    setSupplier({ supplier_purchases: updatedSupplierPurchases, ...supplier });
    console.log(supplier);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注方法</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={supplier.how_to_order}
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium">次回発注予定日</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={supplier.next_purchase_day}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注サイクル</label>
            <div className="flex items-center mt-1">
              <input
                type="text"
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={supplier.cycle_value}
                readOnly
              />
              <input
                type="text"
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={supplier.cycle_unit}
                readOnly
              />
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
            {supplier.supplier_purchases.map((item, index) => (
              <SupplierPurchase
                key={index}
                supplierPurchase={item}
                purchases={purchases}
                isEditing={isEditing}
                onChange={editSupplierPurchase}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <button
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
          onClick={() => {
            setIsEditing(true);
            console.log(`IsEditing enabled ${isEditing}`);
          }}
        >
          編集
        </button>
        <Link href={`/suppliers`}>
          <button className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700">
            戻る
          </button>
        </Link>
      </div>
    </div>
  );
}

const handleDeleteItem = (index) => {
  console.log(`Deleting item at index: ${index}`);
  // アイテムの削除ロジックを実装します。
};
