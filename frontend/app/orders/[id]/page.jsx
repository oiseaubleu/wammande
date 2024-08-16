"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SupplierName, OrderRow } from "../OrderRow";
import { useAuth } from "../../context/auth";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font
} from "@react-pdf/renderer";
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [purchases, setPurchases] = useState({});//発注先の仕入れ品情報すべて
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得

  const searchParams = useSearchParams(); // URLのクエリパラメータを取得するためのフック
  useEffect(() => {
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
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const orderRes = await fetch(`${API_DOMAIN}/orders/${id}`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      const order = await orderRes.json();
      console.log("retrieved data from GET /orders/:id", order);

      const supplierPurchasesRes = await fetch(`${API_DOMAIN}/suppliers/${order.supplier_id}`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      const supplier = await supplierPurchasesRes.json();
      console.log("retrieved data from GET /suppliers/:id", supplier);

      setPurchases(supplier.supplier_purchases);
      setOrder(order);
      setIsLoading(false);
    }
    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchOrderData();
    }
  }, [id, isAuthenticated]);


  // PDFの内容を定義するコンポーネント
  const MyDocument = () => (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header}>発注内容詳細</Text>
        <View style={styles.section}>
          <Text style={styles.label}>ステータス</Text>
          <Text style={styles.value}>{getOrderStatusLabel(order.order_status)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>発注先情報</Text>
          <Text style={styles.label}>仕入先名: {order.supplier_name}</Text>
          <Text style={styles.label}>発注日: {order.order_date?.split("T")[0]}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>発注品情報</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>仕入品名</Text>
              <Text style={styles.tableHeader}>商品番号</Text>
              <Text style={styles.tableHeader}>数量</Text>
              <Text style={styles.tableHeader}>単価</Text>
              <Text style={styles.tableHeader}>小計</Text>
            </View>
            {order.order_details?.filter(detail => !detail._destroy).map((detail, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {detail.purchase_name || "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {purchases.find((p) => p.id === detail.supplier_purchase_id).item_number || "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {detail.quantity || 0}
                </Text>
                <Text style={styles.tableCell}>
                  {purchases.find((p) => p.id === detail.supplier_purchase_id).price || 0}
                </Text>
                <Text style={styles.tableCell}>
                  {detail.subtotal_amount || 0}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.total}>合計金額: €{order.total_amount}</Text>
      </Page>
    </Document>
  );

















  /**
   * 
   * @param {object[boolean]} 発注を登録するかどうかのフラグ。trueならステータスを発注済みに切り替える
   */
  const updateOrder = async ({ willRegisterPurchase }) => {
    const accessToken = await getAccessToken(); //1. アクセストークンを取得
    const sendOrder = {
      ...order,
      order_date: willRegisterPurchase ? new Date().toISOString().split("T")[0] : order.order_date,
      order_status: willRegisterPurchase ? 1 : order.order_status,
      order_details_attributes: order.order_details.map((detail) => {
        const { id, ...rest } = detail;
        const order_status = willRegisterPurchase ? 1 : detail.order_status;
        if (String(id).match(/^tmp-/)) {
          // 新規追加の行は、idを消しておく
          return {
            ...rest,
            order_status,
          };
        } else {
          return {
            id,
            ...rest,
            order_status,
          };
        }
      })
    };

    const res = await fetch(`${API_DOMAIN}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(sendOrder),
      mode: "cors",
    });
    const date = await res.json();

    // 登録後は詳細画面にリダイレクトする
    window.location.href = `/orders/${id}`;

  };

  const handlePDFExport = () => {
    console.log("PDF Export button clicked [not implemented]");
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
            id: `tmp-${Math.random().toString(32).substring(2)}`,
            supplier_purchase_id: "", // 仕入れ品を選択するまでわからないので空にしておく
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
        total_amount: calculateTotal(updatedOrderDetails),
        order_details: updatedOrderDetails
      }
    );
  };

  /**
   * 各行の削除ボタンが押されたときの動きを司る関数
   * 
   * @param {number | string} index orderDetailのID。新規追加の場合は `tmp-xxxx` という文字列
   */
  const handleDeleteRow = (index) => {
    let updatedOrderDetails;
    if (String(index).match(/^tmp-/)) {
      // 新規追加してすぐの行は、そのまま削除してしまってOK
      updatedOrderDetails = order.order_details.filter((order_detail) => order_detail.id !== index);
    } else {
      // 既存の行は、_destroy: true を追加しておく
      updatedOrderDetails = order.order_details.map((order_detail) =>
        order_detail.id === index ? { ...order_detail, _destroy: true } : order_detail
      );
    }
    setOrder(
      {
        ...order,
        total_amount: calculateTotal(updatedOrderDetails),
        order_details: updatedOrderDetails
      }
    );
  };

  const calculateTotal = (orders) => {
    return orders.filter((order) => !order._destroy).reduce((sum, order) => sum + Number(order.subtotal_amount), 0);
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
          setIsEditing(false);
          updateOrder({ willRegisterPurchase: false }); //
        }}
      >
        {order.order_status === "not_ordered" ? `一時保存` : `更新`}
      </button>
      {
        order.order_status === "not_ordered" && (
          <>
            <button
              onClick={() => {
                setIsEditing(false);
                updateOrder({ willRegisterPurchase: true });
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              発注登録
            </button>
            <button
              className="bg-blue-700 text-white rounded px-4 py-2 hover:bg-blue-800"
              onClick={() => handleAddRow()}
            >
              新規追加
            </button>
          </>
        )}
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
        return "納品待ち";
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
            {/* 既存レコードで削除されたもの＝_destroy: true があるものは除外する */
              order.order_details.filter((orderDetail) => !orderDetail._destroy).map((orderDetail, index) => (
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


          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xl">
          合計金額: <span className="font-bold">€{order.total_amount}</span>
        </div>
        <PDFDownloadLink document={<MyDocument />} fileName="order_details.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "PDF作成中..." : (
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                PDF出力
              </button>
            )
          }
        </PDFDownloadLink>
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

Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: "/fonts/NotoSansJP-Regular.ttf",
    },
    {
      src: "/fonts/NotoSansJP-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// PDF用のスタイル
const styles = StyleSheet.create({
  body: {
    padding: 10,
    fontSize: 12,
    fontFamily: "NotoSansJP",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "100%",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E4",
    paddingVertical: 5,
  },
  tableHeader: {
    flexGrow: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  tableCell: {
    flexGrow: 1,
    fontSize: 12,
  },
  total: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});