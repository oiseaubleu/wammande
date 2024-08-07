"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SupplierName, OrderRow } from "../OrderRow";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [purchases, setPurchases] = useState({});//発注先の仕入れ品情報すべて
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  const searchParams = useSearchParams(); // URLのクエリパラメータを取得するためのフック
  useEffect(() => {
    console.log("mode", searchParams.get("mode"));
    if (searchParams.get("mode") === "edit") {
      setIsEditing(true);
    }
  }, [searchParams]);

  useEffect(() => {
    /**
     * 特定のorderに対する情報をとってくる。
     * 1. まずはURLに含まれるIDをもとに、 /orders/${id} でorder全体のJSONをとってくる
     *     このとき、まだsetOrdeR(order)はしない。依存している supplierPurchases の情報がまだないので。
     * 2. そのあと、orderに紐づくSupplierの情報を丸っととってきて、その中のsupplier_purchasesを保存する
     * 3. ここまで保存して初めて、setOrder(order)する
     *    →ここでorderのstateが変化したので、下のほうにある order.order_details.map... の処理が動いて各行が描画される
     */
    async function fetchOrderData() {
      const orderRes = await fetch(`http://localhost:3000/orders/${id}`, {
        mode: "cors",
      });
      const order = await orderRes.json();
      console.log(order);

      const supplierPurchasesRes = await fetch(`http://localhost:3000/suppliers/${order.supplier_id}`, {
        mode: "cors",
      });
      const supplier = await supplierPurchasesRes.json();
      console.log(supplier);

      setPurchases(supplier.supplier_purchases);
      setOrder(order);
      setIsLoading(false);
    }
    fetchOrderData();
  }, [id]);



  const updateOrder = async () => {
    const sendOrder = {
      ...order,
      order_details_attributes: [...order.order_details]
    }

    const res = await fetch(`http://localhost:3000/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendOrder),
      mode: "cors",
    });
    const date = await res.json();

    // 登録後は詳細画面にリダイレクトする
    window.location.href = `/orders/${id}`;

  };

  const handlePDFExport = () => {
    console.log("PDF Export button clicked");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  //追加ボタンを押したときに新規の行がでてくる
  //
  const handleAddRow = () => {
    setOrder(
      {
        ...order,
        order_details: [
          ...order.order_details,
          {
            // TODO: 仮のid要素を追加しておく。じゃないと、後々 `handleUpdateRow` とかできない
            supplier_purchase_id: `tmp-${Math.random().toString(32).substring(2)}`,
            item_number: "",
            order_status: 0,
            quantity: 0,
            subtotal_amount: 0,
          }]
      });
  };

  //フォームを編集したときにstateに保存する
  //具体的には、order_detailsの中身をみて更新があったidだけ上書きしたい
  //index:更新があったorder_detailのid
  //updateOrder：その内容
  const handleUpdateRow = (index, updatedOrderDetail) => {
    const updatedOrderDetails = order.order_details.map((order_detail) =>
      order_detail.id === index ? updatedOrderDetail : order_detail
    );
    setOrder(
      {
        ...order,
        order_details:
          updatedOrderDetails

      }
    );
    calculateTotal(updatedOrderDetails);
  };

  //フォーム内容を削除したとき
  const handleDeleteRow = (index) => {
    // TODO: 編集画面では、order_detailsから消すのではなくて、 `_destroy: true` を足す必要がある
    const updatedOrderDetails = order.order_details.filter((order_detail) => order_detail.id !== index);
    setOrder(
      {
        ...order,
        order_details:
          updatedOrderDetails
      }
    );
    calculateTotal(updatedOrderDetails);
  };

  const calculateTotal = (orders) => {
    const total = orders.reduce((sum, order) => sum + order.subtotal_amount, 0);
    setTotalAmount(total);
  };


  //すべてtrueのときだけtrue返すので、保存してもいい状態かどうか調べてる
  const isSafeToSave = order.order_details.every(
    (order_detail) =>
      order_detail._destroy || //削除ボタンが押された状態{_destory: true} これから消すレコードについてはバリデーションしない
      !order_detail.validationErrors ||
      order_detail.validationErrors.length === 0
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
          updateOrder();//
        }}
      >
        更新
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

  const getOrderStatusLabel = (status) => {
    switch (status) {
      case "not_ordered":
        return "未発注";
      case "ordered_pending_delivery":
        return "発注済（納品待ち）";
      case "order_cancelled":
        return "発注キャンセル";
      case "delivered":
        return "納品済";
      case "delivery_cancelled":
        return "納品キャンセル";
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">発注内容詳細</h1>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">ステータス</label>
        <div className="flex items-center">
          <span className="bg-yellow-300 p-2 rounded mr-2">
            {getOrderStatusLabel(order.order_status)}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">発注先情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">仕入先名</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={order.supplier_name}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium">発注日</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={order.order_date.split("T")[0]}
              readOnly
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
              <th className="py-2 px-4 border-b">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: 1. order.order_details の要素1個ずつに対してmapする */}
            {order.order_details.map((orderDetail, index) => (
              <OrderRow
                key={orderDetail.id}
                index={orderDetail.id}
                orderDetail={orderDetail}
                onUpdate={handleUpdateRow}
                onDelete={handleDeleteRow}
                supplierPurchases={purchases}
                isEditing={isEditing} />
            )
            )}

            {/* { // ここをOrderRowに置き換えちゃう！
              order.order_details.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b">
                    {item.purchase_name || "不明"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {purchases[item.supplier_purchase_id]?.item_number || "不明"}
                  </td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">
                    {purchases[item.supplier_purchase_id]?.price || "不明"}
                  </td>
                  <td className="py-2 px-4 border-b">{item.subtotal_amount}</td>
                  <td className="py-2 px-4 border-b">{item.order_status}</td>
                </tr>
              ))} */}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xl">
          合計金額: <span className="font-bold">€{order.total_amount}</span>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={handlePDFExport}
        >
          PDF出力
        </button>
      </div>

      <div className="flex justify-between mt-8">
        {saveOrEditButton}
        <Link href={`/orders`}>
          <button className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700">
            戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
