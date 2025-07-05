import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.FoodName === item.FoodName);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.FoodName === item.FoodName ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.FoodName === item.FoodName ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const updateCartItem = (item, quantity) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.FoodName === item.FoodName ? { ...cartItem, quantity: quantity } : cartItem
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((acc, item) => acc + item.FoodPrice * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  // New function to reset quantities of menu items to zero
  const resetItemQuantities = () => {
    setCart((prevCart) =>
      prevCart.map((cartItem) => ({ ...cartItem, quantity: 0 }))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        getTotalAmount,
        clearCart,
        resetItemQuantities, // Expose this function to CartScreen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context;
};
