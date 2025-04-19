import { Table } from 'antd'
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getOrders, updateOrder } from "../features/auth/authSlice";
const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Product",
    dataIndex: "product",
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Orders = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, []);
  const orderState = useSelector((state) => state.auth.orders);

  const updateOrderStatus =(a,b)=>{
    dispatch(updateOrder({id:a,status:b}))
  }

  const data1 = [];
  for (let i = 0; i < orderState.length; i++) {
    data1.push({
      key: i + 1,
      name: orderState[i]?.user?.firstname + " " + orderState[i]?.user?.lastname,
      product:<Link to={`/admin/order/${orderState[i]?._id}`}>View Orders</Link>,
      amount: orderState[i]?.totalPrice,
      date: new Date(orderState[i].createdAt).toLocaleString(),
      action:(
        <select defaultValue={orderState[i]?.orderStatus} name="status" onChange={(e) => updateOrderStatus(orderState[i]?._id,e.target.value)} id="">
          <option value="processed">Processed</option>
          <option value="shipped">Shipped</option>
          <option value="Out For Delivery">Out ForDelivery</option>
          <option value="Delivered">Delivered</option>
        </select>
      )
    });
  }


  return (
    <div>
        <h3 className="mb-4 text-2xl font-semibold">Orders</h3>
        <div>
        <Table columns={columns} dataSource={data1} />
        </div>
    </div>
  )
}

export default Orders