import Link from "next/link";

export default function OrderList({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order}>
          <Link href={`/orders/${order}`}>Order #{order}</Link>
        </li>
      ))}
    </ul>
  );
}
