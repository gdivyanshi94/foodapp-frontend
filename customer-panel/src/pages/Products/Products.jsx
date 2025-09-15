import React, { useEffect, useState } from "react";
import "./Products.css";
import { loadCatalog } from "../../services/catalog";
import { config } from "../../services/config"
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux'
import { addToCartAction } from '../../slices/cartSlice'

function Products() {
    const [items, setItems] = useState([]);
    // get the reference of dispatch function
  const dispatch = useDispatch()
  const getCatalog = async () => {
    const result = await loadCatalog();
    if (result["status"] == 200) {
      setItems(result["data"]);
    } else {
      toast.error(result["error"]);
    }
  };

  useEffect(() => {
    getCatalog();
  }, []);

  const onAddToCart = (item) => {
    // invoke addToCartAction
    dispatch(addToCartAction(item))
  }

  return (
    <div>
      <h2 className='page-header'>Products</h2>

        <div className='row mt-3'>
          {items.map((item) => {
            const imageUrl = `${config.serverBaseUrlCatalog}/${item['image']}`
            return (
              <div className='col-3' key={item['id']}>
                <div className='card' style={{ position: 'relative' }}>
                  <img
                    style={{ height: 200 }}
                    src={imageUrl}
                    className='card-img-top'
                    alt='...'
                  ></img>
                  <button
                  onClick={() => onAddToCart(item)}
                  className='btn btn-success cart-button'
                >
                  Cart
                </button>
                  <div className='card-body'>
                    <h5 className='card-title'>{item['title']}</h5>
                    <p className='card-text'>{item['description']}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default Products
