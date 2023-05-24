import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import './MenuList.css';

const MenuList = ({ addProduct, products }) => {
  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Entradas',
      img: 'https://aprende.com/wp-content/uploads/2022/05/canapes.jpg',
      products: []
    },
    {
      id: '2',
      name: 'Fuertes',
      img: 'https://cdn.bolivia.com/images/v2/gastronomia/mundo/comida-de-mar.jpg',
      products: []
    },
    {
      id: '3',
      name: 'Postres',
      img: 'https://www.elespectador.com/resizer/U9A_I1wTh1bLFhldZ2tDzLMu35I=/525x350/filters:quality(60):format(jpeg)/cloudfront-us-east-1.images.arcpublishing.com/elespectador/4GSSJF6WDRF3LAANCXFH3UZEPM.jpg',
      products: []
    },
  ]);
  const [items, setItems] = useState(categories);
  const [inCategories, setInCategories] = useState(true);

  useEffect(() => {
    const updatedCategories = categories.map((category) => {
      const categoryProducts = products.filter((product) => product.category === category.id);
      return { ...category, products: categoryProducts };
    });
    setCategories(updatedCategories);
  }, [categories, products]);

  const handleBackToCategories = () => {
    setItems(categories);
    setInCategories(true);
  };

  const handleGoToCategory = (id) => {
    const category = categories.find((cat) => cat.id === `${id}`);
    if (category) {
      const newItems = category.products.map((product) => ({
        id: product.id,
        name: product.name,
        img: product.img,
      }));
      setItems(newItems);
      setInCategories(false);
    }
  };

  const handleClickOnCards = (id) => {
    inCategories ? handleGoToCategory(id) : addProduct(id);
  };

  return (
    <div className="menu-list-container">
      <Grid container spacing={2} className="menu-list-grid">
        {!inCategories && (
          <Grid item xs={4} md={3} key={0}>
            <Button
              data-testid="button-back"
              variant="contained"
              className="back-button"
              onClick={handleBackToCategories}
            >
              BACK
            </Button>
          </Grid>
        )}
        {items.map((item, index) => (
          <Grid item xs={4} md={3} key={index + 1} className="menu-item">
            <Card
              data-testid={`category-card-${item.id}`}
              onClick={() => handleClickOnCards(item.id)}
              className="menu-card"
            >
              <CardMedia
                component="img"
                className="menu-image"
                image={item.img}
                alt={item.name}
              />
              <CardContent className="menu-content">
                <Typography component="span" variant="body1">
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

MenuList.propTypes = {
  addProduct: PropTypes.func.isRequired,
  products: PropTypes.array
};

export default MenuList;
