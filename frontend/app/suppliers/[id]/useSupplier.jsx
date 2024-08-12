import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
/**
 * 仕入先を管理するためのカスタムフック
 *
 * サポートしているケースとしては:
 *
 * - 指定のIDの仕入先情報を取ってくる。合わせて、仕入れ品の一覧も取得する
 * - 仕入先仕入れ品（SupplierPurchase）の特定のフィールドを更新する
 * - 仕入先仕入れ品を追加する
 */
const useSupplier = (id) => {
  const [supplier, setSupplier] = useState({
    id: "",
    name: "",
    cycle_value: 10,
    cycle_unit: "daily",
    how_to_order: "online",
    next_purchase_day: new Date(),
    supplier_purchases: [],
  });
  const [purchases, setPurchases] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得

  useEffect(() => {
    async function fetchData(id) {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const purchasesResponse = await fetch(`http://localhost:3000/purchases`, {
        mode: "cors",
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      const purchaseList = await purchasesResponse.json();
      setPurchases(
        // ここで、オブジェクトの配列→オブジェクトに変換してる！ [{id:1, ...}, {id:2, ...}, {}] -> {1: {}, 2: {}, ...}
        // こうすることで、PurchaseのIDから目的のPurchaseオブジェクトにすぐにたどり着けるようになる
        purchaseList.reduce(
          (obj, item) => ((obj[item.id] = { ...item }), obj),
          {}
        )
      );
      if (id !== "new") {

        const supplierResponse = await fetch(
          `http://localhost:3000/suppliers/${id}`,
          {
            mode: "cors",
            headers: {
              Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
            }
          }
        );
        const data = await supplierResponse.json();
        setSupplier(data);
      }
      setIsLoading(false);
    }
    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchData(id);
    }
  }, [id, isAuthenticated]);

  //仕入先の更新
  const updateSupplier = (field, value) => {
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      [field]: value, //これで上書きしてる
    }));
  };

  /**
   * updateSupplierPuchaseは、supplierPurchaseの特定のフィールドを更新する
   *　どの行が更新されたかはIDで判別する
   * @param {any} id ID of a purchase
   * @param {string} field name of the field to update
   * @param {any} value value to update
   */
  const updateSupplierPurchase = (id, field, value) => {
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      supplier_purchases: prevSupplier.supplier_purchases.map((purchase) =>
        purchase.id === id ? { ...purchase, [field]: value } : purchase
      ),
    }));
  };
  /**
   * replaceSupplierPurchaseは、新規追加ボタンを押して新しい仕入品情報を追加して
   * その行のOKボタンを押したときにその行の情報を更新する
   */
  const replaceSupplierPurchase = (id, newPurchase) => {
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      supplier_purchases: prevSupplier.supplier_purchases.map((purchase) =>
        purchase.id === id ? newPurchase : purchase
      ),
    }));
  };

  /**
   * addSupplierPurchaseは、空のsupplierPurchaseを追加する
   */
  const addTentativeSupplierPurchase = () => {
    const supplierPurchase = {
      id: `tmp-${Math.random().toString(32).substring(2)}`,
      supplier_id: supplier.id,
      purchase_id: "",
      item_number: "",
      price: 0,
      comment: "",
      version: 0, // 後々更新するようにしたいけど、Backend含めて色々修正必要かも
      isNewItem: true,
    };
    setSupplier((prevSupplier) => ({
      ...prevSupplier,
      supplier_purchases: [
        ...prevSupplier.supplier_purchases,
        supplierPurchase,
      ],
    }));
  };

  // /**
  //  * deleteSupplierPurchaseは、指定のIDのsupplierPurchaseを削除する これいらないよねたぶん
  //  *
  //  * @param {any} id ID of a purchase
  //  */
  // const deleteSupplierPurchase = (id) => {
  //   const filtered = supplier.supplier_purchases.filter(
  //     (purchase) => purchase.id !== id
  //   );
  //   console.log(id, filtered);
  //   setSupplier((prevSupplier) => ({
  //     ...prevSupplier,
  //     supplier_purchases: filtered,
  //   }));
  // };

  /**
   * saveSupplierは、supplierの新規追加も編集も保存する
   * @param {object} dataToSave (仕入先情報まるごと
   */

  const saveSupplier = (dataToSave) => {
    async function updateData(requestBody) {
      const accessToken = await getAccessToken()
      if (id === "new") {
        const res = await fetch(`http://localhost:3000/suppliers`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
          },
          body: JSON.stringify(requestBody),
        });
        if (res.status >= 400) {
          alert("登録に失敗しました。");
        } else {
          const data = await res.json();
          console.log("retrieved data from POST /suppliers", data);
          setSupplier(data);
          // 新規登録後は、IDが返ってくるので、そのIDにリダイレクトする
          window.location.href = `/suppliers/${data.id}`;
        }
      } else {
        const res = await fetch(`http://localhost:3000/suppliers/${id}`, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
          },
          body: JSON.stringify(requestBody),
        });
        if (res.status >= 400) {
          alert("更新に失敗しました。");
        } else {
          const data = await res.json();
          console.log("retrieved data from PUT /suppliers", data);
          setSupplier(data);
        }
      }
    }
    // purchase.id があると更新、ないと新規登録。
    //restは、supplier_purchases以外のデータ
    const { supplier_purchases, ...rest } = dataToSave;
    const supplier = {
      supplier_purchases_attributes: supplier_purchases.map((purchase) => {
        const { id, ...rest } = purchase;
        //仕入先仕入品のIDがtmp-で始まる場合は、新規追加されたものとして扱う
        return String(id).startsWith("tmp-") ? { ...rest } : purchase;
      }),
      ...rest,
    };

    if (isAuthenticated) {
      updateData(supplier);
    }



  };

  return {
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
  };
};

export default useSupplier;
