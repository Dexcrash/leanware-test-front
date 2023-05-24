import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import './OrderDetail.css';

const OrderDetail = ({ selectedProducts, updateQuantity }) => {
  const increment = (id, quantity) => {
    updateQuantity(id, quantity + 1);
  };

  const decrement = (id, quantity) => {
    updateQuantity(id, quantity - 1);
  };

  return (
    <div className="order-detail-detail-container">
      <Grid container spacing={2}>
        {selectedProducts.length === 0 && (
          <Grid item xs={12} key={0} data-testid="no-products-message">
            <Typography variant="h4">There is no products on the list yet...</Typography>
          </Grid>
        )}
        {selectedProducts.length > 0 &&
          selectedProducts.map((item, index) => (
            <Grid item xs={12} key={index + 1} className="order-detail-item">
              <Card className="order-detail-card" data-testid={`product-card-${item.id}`}>
                <CardMedia component="img" className="order-detail-image" image={item.img} alt={item.name} />
                <CardContent className="order-detail-content">
                  <Typography component="div" variant="h5">
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {item.description}
                  </Typography>
                </CardContent>
                <div className="quantity-wrapper">
                  <IconButton
                    className="quantity-modifier modifier-left"
                    onClick={() => decrement(item.id, item.quantity)}
                    data-testid={`decrement-button-${item.id}`}
                  >
                    &ndash;
                  </IconButton>
                  <input
                    className="quantity-display"
                    type="text"
                    value={item.quantity}
                    readOnly
                    data-testid={`quantity-display-${item.id}`}
                  />
                  <IconButton
                    className="quantity-modifier modifier-right"
                    onClick={() => increment(item.id, item.quantity)}
                    data-testid={`increment-button-${item.id}`}
                  >
                    &#xff0b;
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

OrderDetail.propTypes = {
  selectedProducts: PropTypes.array,
  updateQuantity: PropTypes.func.isRequired
};

export default OrderDetail;
