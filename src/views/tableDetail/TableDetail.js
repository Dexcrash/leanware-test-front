
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Button, Divider } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import OrderList from '../../components/orderList/OrderList';
import MenuList from '../../components/menuList/MenuList';
import OrderDetail from '../../components/orderDetail/OrderDetail';
import BillSummary from '../../components/billSummary/BillSummary';
import {
  FETCH_ORDER_QUERY,
  FETCH_PRODUCTS_QUERY,
  FETCH_SELECTED_PRODUCTS_QUERY,
  ADD_PRODUCT_QUERY,
  UPDATE_PRODUCT_QUERY,
  SET_STATE_QUERY,
  DEL_ORDER_QUERY,
  ADD_ORDER_QUERY,
  SET_PAID_QUERY,
  SET_TIP_QUERY,
} from './queries';
import './TableDetail.css'

const TableDetail = () => {
  const { tableId } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(1);
  const [customers, setCustomers] = useState([{ id: 1, name: 'Customer 1' }]);
  const [order, setOrder] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { loading, error, data } = useQuery(FETCH_ORDER_QUERY, { variables: { tableId: parseInt(tableId), customerId: parseInt(selectedCustomerId) } });
  const productsQuery = useQuery(FETCH_PRODUCTS_QUERY);
  const selectedProductsQuery = useQuery(FETCH_SELECTED_PRODUCTS_QUERY, { variables: { orderId: order.id } });
  const [addProduct] = useMutation(ADD_PRODUCT_QUERY, { refetchQueries: [{ query: FETCH_SELECTED_PRODUCTS_QUERY, variables: { orderId: order.id } }] });
  const [updateProduct] = useMutation(UPDATE_PRODUCT_QUERY, { refetchQueries: [{ query: FETCH_SELECTED_PRODUCTS_QUERY, variables: { orderId: order.id } }] });
  const [setStateOrder] = useMutation(SET_STATE_QUERY, { refetchQueries: [{ query: FETCH_ORDER_QUERY, variables: { tableId: parseInt(tableId), customerId: parseInt(selectedCustomerId) } }] });
  const [delOrder] = useMutation(DEL_ORDER_QUERY, { refetchQueries: [{ query: FETCH_ORDER_QUERY, variables: { tableId: parseInt(tableId), customerId: parseInt(selectedCustomerId) } }] });
  const [addOrder] = useMutation(ADD_ORDER_QUERY, { refetchQueries: [{ query: FETCH_ORDER_QUERY, variables: { tableId: parseInt(tableId), customerId: parseInt(selectedCustomerId) } }] });
  const [setPaid] = useMutation(SET_PAID_QUERY, { refetchQueries: [{ query: FETCH_ORDER_QUERY, variables: { tableId: parseInt(tableId), customerId: parseInt(selectedCustomerId) } }] });
  const [setTip] = useMutation(SET_TIP_QUERY, { refetchQueries: [{ query: FETCH_ORDER_QUERY, variables: { tableId: parseInt(tableId), customerId: parseInt(selectedCustomerId) } }] });
  const navigate = useNavigate();

  useEffect(() => {
    if (productsQuery.data && productsQuery.data.order_product.length > 0) {
      setProducts(productsQuery.data.order_product);
    }
  }, [productsQuery.data]);


  const handleAddOrder = useCallback(async (id) => {
    try {
      await addOrder({
        variables: {
          tableId: tableId,
          customerId: id,
          number: 11231
        },
      });
    } catch (error) {
      console.error('Error adding order:', error);
    }
  }, [addOrder, tableId]);
  
  useEffect(() => {
    if (data && data.order_order.length > 0) {
      setOrder(data.order_order[0]);
    } else if (data && data.order_order.length === 0) {
      handleAddOrder(selectedCustomerId);
    }
  }, [data, handleAddOrder, selectedCustomerId, setOrder]);
  
  useEffect(() => {
    if (selectedProductsQuery.data && selectedProductsQuery.data.order_quantity.length > 0) {
      const newData = selectedProductsQuery.data.order_quantity.map(prod => {
        const current = products.find(product => product.id === prod.product_id);
        return { ...current, quantity: prod.quantity };
      })
      setSelectedProducts(newData);
    } else if (selectedProductsQuery.data && selectedProductsQuery.data.order_quantity.length === 0) {
      setSelectedProducts([]);
    }
  }, [selectedProductsQuery.data, data, products]);


  const handleCustomerClick = (customerId) => {
    setSelectedCustomerId(customerId);
  };

  const addCustomer = () => {
    const newCustomerId = customers.length + 1;
    const newCustomer = {
      id: newCustomerId,
      name: `Customer ${newCustomerId}`,
    };
    setCustomers([...customers, newCustomer]);
  };

  const handleAddProduct = async (id) => {
    const exist = selectedProducts.find(prod => prod.id === id);

    if (!exist) {
      try {
        await addProduct({
          variables: {
            productId: parseInt(id),
            orderId: parseInt(order.id),
          },
        });
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  const handleChangeProduct = async (productId, quantity) => {
    try {
      await updateProduct({
        variables: {
          orderId: parseInt(order.id),
          productId: parseInt(productId),
          quantity: parseInt(quantity),
        },
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleOrderState = async (state, order_id) => {
    try {
      await setStateOrder({
        variables: {
          orderId: parseInt(order_id),
          state: state,
        },
      });
    } catch (error) {
      console.error('Error setting order state:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (order && order.id) {
        const updatedCustomers = customers.filter(cust => cust.id !== selectedCustomerId);
        setCustomers(updatedCustomers);
        setSelectedCustomerId(updatedCustomers[0].id);
        await delOrder({
          variables: {
            orderId: parseInt(order.id),
          },
        });
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handlePay = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-CA');
      await setPaid({
        variables: {
          tableId: tableId,
          paid: formattedDate
        },
      });
      navigate(`/`);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleTip = async (total, tip, percentage) => {
    try {
      await setTip({
        variables: {
          orderId: order.id,
          tip: tip,
          tipPercentage: percentage,
          total: total
        },
      });
    } catch (error) {
      console.error('Error adding tips:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Container maxWidth="md" className='table-detail-container'>
      <Grid container sx={{ my: 2 }} spacing={2}>
        <Grid item xs={2} className='table-detail-grid'>
          <OrderList
            selectedCustomerId={selectedCustomerId}
            onCustomerClick={handleCustomerClick}
            customers={customers}
            addCustomer={addCustomer}
          />
        </Grid>
        <Grid item xs={10}>
          <OrderDetail selectedProducts={selectedProducts} updateQuantity={handleChangeProduct} />
          <Grid container sx={{ background: '#2b9cff', height:'65px'}}>
            <Grid
              item
              xs={4}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                disabled={selectedProducts.length === 0}
                variant="contained"
                onClick={() => (order.state === '1' ? handleOrderState("2", order.id) : handleOrderState("1", order.id))}
                sx={{
                  background: '#E2F2FF',
                  color: 'black',
                  "&.Mui-disabled": {
                    background: "#F8F8F8",
                    color: "#c0c0c0"
                  }
              }}>
                {order.state === '2' ? 'ORDER' : 'CHECK'}
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Button
                disabled={selectedProducts.length === 0 || order.state === '1'}
                variant="contained"
                onClick={handlePay}
                sx={{
                  background: '#E2F2FF',
                  color: 'black',
                  "&.Mui-disabled": {
                    background: "#F8F8F8",
                    color: "#c0c0c0"
                  }
              }}>
              
                PAY
              </Button>
            </Grid>
            {customers.length > 1 && (
              <Grid
                item
                xs={4}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Button 
                  variant="contained" 
                  onClick={handleDelete}
                  sx={{
                    background: '#E2F2FF',
                    color: 'black',
                    "&.Mui-disabled": {
                      background: "#F8F8F8",
                      color: "#c0c0c0"
                    }
                }}>
                  DELETE
                </Button>
              </Grid>
            )}
          </Grid>
          <Divider orientation="horizontal" flexItem />
          {order.state === "1" && <MenuList addProduct={handleAddProduct} products={products} />}
          {order.state !== "1" && <BillSummary selectedProducts={selectedProducts} handleTip={handleTip} order={order} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TableDetail;
