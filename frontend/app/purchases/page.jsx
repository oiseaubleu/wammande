"use client";

import { useState } from "react";

function PurchaseRow({ purchase }) {
  return (
    <div>
      <input type="text" value={purchase.name} />
      <input type="checkbox" id={purchase.id} />
      <label htmlFor={purchase.id}>食材かどうか</label>
      <button>編集</button>
      <button>削除</button>
    </div>
  );
}

export default function Page() {
  const [purchases, setPurchases] = useState([
    { id: 1, name: "米" },
    { id: 2, name: "豚肉" },
    { id: 3, name: "牛肉" },
  ]);

  const handleAddNew = () => {
    console.log("Add new purchase");
    setPurchases([...purchases, { id: purchases.length + 1, name: "" }]);
  };

  return (
    <div>
      <h1>仕入品一覧</h1>
      <div>
        <input type="text" />
        <button>検索</button>

        <button onClick={handleAddNew}>新規追加</button>

        {/* New form */}
        {purchases.map((purchase) => (
          <PurchaseRow purchase={purchase} />
        ))}
      </div>
    </div>
  );
}
