import {
  FaBox,
  FaCheckCircle,
  FaClipboardList,
  FaTimesCircle,
  FaTruck,
  FaUndoAlt,
} from "react-icons/fa";

export const orderData = [
  {
    title: "Received",
    count: 1317,
    color: "bg-blue-500",
    icon: <FaClipboardList />,
  },
  { title: "Processed", count: 208, color: "bg-teal-500", icon: <FaBox /> },
  { title: "Shipped", count: 273, color: "bg-yellow-500", icon: <FaTruck /> },
  {
    title: "Delivered",
    count: 837,
    color: "bg-green-500",
    icon: <FaCheckCircle />,
  },
  {
    title: "Cancelled",
    count: 363,
    color: "bg-red-500",
    icon: <FaTimesCircle />,
  },
  {
    title: "Returned",
    count: 103,
    color: "bg-gray-500",
    icon: <FaUndoAlt />,
  },
];

export const detailedOrderData = [
  {
    id: "ORD001",
    customerName: "John Doe",
    product: "Wireless Mouse",
    status: "Delivered",
    paymentStatus: "Paid",
    date: "2024-12-18",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    product: "Laptop Stand",
    status: "Shipped",
    paymentStatus: "Pending",
    date: "2024-12-17",
  },
  {
    id: "ORD003",
    customerName: "Alice Brown",
    product: "Keyboard",
    status: "Cancelled",
    paymentStatus: "Refunded",
    date: "2024-12-16",
  },
];
