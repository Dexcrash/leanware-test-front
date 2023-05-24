import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Button, Card } from '@mui/material';
import './BillSummary.css';

const BillSummary = ({ selectedProducts, handleTip, order }) => {
  const { total_check, percentage_tip, total_tip } = order;
  const [subTotal, setSubTotal] = useState(0);
  const [ipc, setIpc] = useState(0);
  const [tip, setTip] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);

  const calculateValues = useCallback(() => {
    let sub = 0;
    selectedProducts.forEach((product) => (sub += product.price * product.quantity));
    setSubTotal(total_check || sub);
    setIpc((total_check || sub) * 0.08);
    setTipPercentage(percentage_tip || 0);
    setTip(total_tip || 0);
  }, [selectedProducts, total_check, percentage_tip, total_tip]);
  
  useEffect(() => {
    calculateValues();
  }, [calculateValues]);  

  const handleUpdateTip = (tip) => {
    setTipPercentage(tip);
    setTip(subTotal * (tip * 0.01));
    handleTip(subTotal, subTotal * (tip * 0.01), tip);
  };

  return (
    <div className="bill-summary-container">
      <div className="summary-card">
        <Typography component="div" variant="h5">
          Subtotal: {subTotal}
        </Typography>
        <Typography component="div" variant="h5">
          IPC(8%): {ipc}
        </Typography>
        <Typography component="div" variant="h5">
          Tip({tipPercentage}%): {tip}
        </Typography>
        <Typography component="div" variant="h5">
          Total: {subTotal + tip}
        </Typography>

        <Card className="tip-buttons-card">
          <Typography component="div" variant="h5">
            Select tip:
          </Typography>
          <Grid container spacing={2} className="tip-buttons-container">
            {[5, 8, 10, 15].map((percentage) => (
              <Grid item xs={3} key={percentage}>
                <Button
                  variant="contained"
                  onClick={() => handleUpdateTip(percentage)}
                  className="tip-button"
                  style={{ background: '#2B9CFF' }}
                >
                  {percentage}%
                </Button>
              </Grid>
            ))}
          </Grid>
        </Card>
      </div>
    </div>
  );
};

BillSummary.propTypes = {
  selectedProducts: PropTypes.array,
  handleTip: PropTypes.func.isRequired,
  order: PropTypes.object,
};

export default BillSummary;
