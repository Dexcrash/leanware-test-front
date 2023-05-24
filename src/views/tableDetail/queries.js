import { gql } from '@apollo/client';

const FETCH_ORDER_QUERY = gql`
  query FetchOrder($tableId: Int!, $customerId: Int!) {
    order_order(where: { table_id: { _eq: $tableId }, customer_id: { _eq: $customerId }, state: { _neq: "3"} }) {
      waiter_id
      total_tip
      total_check
      table_id
      state
      number
      id
      date_paid
      date_created
      percentage_tip
    }
  }
`;

const ADD_ORDER_QUERY = gql`
mutation AddOrder($tableId: Int!, $customerId: Int!, $number: Int!) {
  insert_order_order(objects: {customer_id: $customerId, number: $number, table_id: $tableId,  waiter_id:1, state:"1", total_check: 0, total_tip:0}) {
    returning {
      waiter_id
      total_tip
      total_check
      table_id
      state
      number
      id
      date_paid
      date_created
      customer_id
    }
  }
}
`;

const FETCH_PRODUCTS_QUERY = gql`
query FetchProducts {
  order_product {
    category
    description
    id
    img
    price
    name
  }
}
`;

const FETCH_SELECTED_PRODUCTS_QUERY = gql`
  query FetchSelectedProducts($orderId: bigint) {
    order_quantity(where: { order_id: { _eq: $orderId } }) {
      product_id
      quantity
    }
  }
`;

const ADD_PRODUCT_QUERY = gql`
  mutation AddProduct($productId: bigint, $orderId: bigint) {
    insert_order_quantity_one(object: { product_id: $productId, quantity: 1, order_id: $orderId }) {
      id
      order_id
      product_id
      quantity
    }
  }
`;

const UPDATE_PRODUCT_QUERY = gql`
  mutation UpdateProduct($orderId: bigint, $productId: bigint, $quantity: Int!) {
    update_order_quantity(where: { order_id: { _eq: $orderId }, product_id: { _eq: $productId } }, _set: { quantity: $quantity }) {
      affected_rows
    }
  }
`;

const SET_STATE_QUERY = gql`
  mutation SetStateOrder($orderId: bigint, $state: String) {
    update_order_order(where: { id: { _eq: $orderId } }, _set: { state: $state }) {
      affected_rows
    }
  }
`;

const DEL_ORDER_QUERY = gql`
  mutation DelOrder($orderId: bigint) {
    delete_order_order(where: { id: { _eq: $orderId } }) {
      affected_rows
    }
  }
`;

const SET_PAID_QUERY = gql`
  mutation SetPaidOrders($tableId: Int!, $paid: date) {
    update_order_order(where: {table_id: {_eq: $tableId}, waiter_id: {_eq: 1}}, _set: {state: "3", date_paid: $paid}) {
      affected_rows
    }
  }
`;

const SET_TIP_QUERY = gql`
  mutation SetTipAndTotals($orderId: bigint, $tip: Int!, $tipPercentage: Int!, $total: Int!) {
    update_order_order(where: {id: {_eq: $orderId}}, _set: {total_tip: $tip, total_check: $total, percentage_tip: $tipPercentage}) {
      affected_rows
    }
  }
`;

export {
    FETCH_ORDER_QUERY,
    ADD_ORDER_QUERY,
    FETCH_PRODUCTS_QUERY,
    FETCH_SELECTED_PRODUCTS_QUERY,
    ADD_PRODUCT_QUERY,
    UPDATE_PRODUCT_QUERY,
    SET_STATE_QUERY,
    DEL_ORDER_QUERY,
    SET_PAID_QUERY,
    SET_TIP_QUERY
}