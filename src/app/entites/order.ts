import {Customer} from "@/entites/customer";
import {Payment} from "@/entites/payment";
import {Shipping} from "@/entites/shipping";
import {Product} from "@/entites/product";

export interface Order {
  id: number
  orderCode: string
  qrCode: string
  user: Customer
  payment: Payment
  shipping: Shipping
  orderStatus: OrderStatus
  statusPayment: StatusPayment
  note: string
  shipping_note: string
  fullName: string
  email: string
  createdAt: string
  modifiedBy: string
  unitPrice: number
  orderQuantity: number
  label: string
  fee: number
  estimated_pick_time: Date
  estimated_deliver_time: Date
  orderDetail: OrderDetail
  products: OrderItem[]
}

export interface StatusPayment {
  id: number
  code: string
  status: string
}

export interface OrderDetail {
  id: number
  address: string
  province: string
  district: string
  ward: string
  tel: string
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  order: Order;
  product: Product;
}

export interface OrderStatus {
  id: number
  code: string
  status: string
}

