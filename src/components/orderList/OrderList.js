import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import './OrderList.css';

const OrderList = ({ selectedCustomerId, onCustomerClick, customers, addCustomer }) => {
  return (
    <Grid container spacing={1} className="order-list-container">
      <Grid item xs={12} key={0}>
        <Button
          variant="contained"
          onClick={addCustomer}
          className="add-chair-button"
          data-testid="add-chair-button" // Add data-testid attribute
          sx={{ background: '#F8F8F8' }}
        >
          <Typography variant="body1" className="add-chair-text">
            + Add chair
          </Typography>
        </Button>
      </Grid>

      {customers.map((order, index) => (
        <Grid item xs={12} key={index + 1}>
          <Card
            className={`order-card ${selectedCustomerId === order.id ? 'selected' : 'normal'}`}
            onClick={() => onCustomerClick(order.id)}
            data-testid={`order-${order.id}`} // Add data-testid attribute
          >
            <CardContent>
              <Typography variant="h6" className="order-id">
                {order.id < 10 ? '0' + order.id : order.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

OrderList.propTypes = {
  selectedCustomerId: PropTypes.number,
  onCustomerClick: PropTypes.func.isRequired,
  customers: PropTypes.array,
  addCustomer: PropTypes.func.isRequired,
};

export default OrderList;
