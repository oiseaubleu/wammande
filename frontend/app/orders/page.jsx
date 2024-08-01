import OrderList from "./OrderList";

export default function Page() {
  const orders = [1, 2, 3, 4, 5];
  const orderList = OrderList({ orders });

  return (
    <div>
      <h1>Orders</h1>
      {orderList}
    </div>
  );
}
