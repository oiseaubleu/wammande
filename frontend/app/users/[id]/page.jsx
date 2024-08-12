'use client';

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    admin: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    const fetchData = async (id) => {
      if (id === "new") {
        setIsNew(true);
        return;
      } else {
        const res = await fetch(`http://localhost:3000/users/${id}`, {
          mode: "cors",
        });
        const data = await res.json();
        setUser(data);
      }
    };
    fetchData(id);
  }, [id]);

  const { mode } = useSearchParams();
  useEffect(() => {
    setIsEditing(mode === "edit");
  }, [mode]);

  const updateUser = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  }

  const saveUser = async () => {
    if (isNew) {
      const res = await fetch(`http://localhost:3000/users`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      console.log("returned data from POST /users", data);
      window.location.href = `/users/${data.id}`;
    } else {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      console.log("returned data from PUT /users", data);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ユーザー管理</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 pb-4">
        <div>
          <label className="block text-sm font-medium">ユーザー名</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={user.name}
            onChange={(e) => updateUser("name", e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email名</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={user.email}
            onChange={(e) => updateUser("email", e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">管理者フラグ</label>
          <input
            type="checkbox"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            checked={user.admin}
            onChange={(e) => updateUser("checked", e.target.value)}
            readOnly={!isEditing}
          />
        </div>
      </div>
      <hr className="py-4" />
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              saveUser();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? "保存" : "編集"}
        </button>
        <Link href={`/users`}>
          <button className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
            戻る
          </button>
        </Link>
      </div>
    </div>
  );
}
