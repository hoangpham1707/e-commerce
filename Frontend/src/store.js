import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems')).map(item => ({ ...item, isChecked: false }))
      : [],
  },
};
const  reducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id 
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };


    case 'CART_ITEM_CHECK': {
      const { productId } = action.payload;
      const updatedCartItems = state.cart.cartItems.map(item =>
        item._id === productId ? { ...item, isChecked: !item.isChecked } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return { ...state, cart: { ...state.cart, cartItems: updatedCartItems } };
    }

    case 'CART_ALLITEMS_CHECK': {
      const updatedCartItems = state.cart.cartItems.map(item => ({
        ...item,
        isChecked: !state.cart.cartItems.every(item => item.isChecked),
      }));
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return { ...state, cart: { ...state.cart, cartItems: updatedCartItems } };
    }
    case 'CART_RESET_ITEMS_CHECK':
      const updatedCartItems = state.cart.cartItems.map(item => ({
        ...item,
        isChecked: false}));
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: updatedCartItems,
        },
      };


    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      // return { ...state, cart: { ...state.cart, cartItems: [] } };
      const uncheckedCartItems = state.cart.cartItems.filter(item => !item.isChecked);
      localStorage.setItem('cartItems', JSON.stringify(uncheckedCartItems));
      return { ...state, cart: { ...state.cart, cartItems: uncheckedCartItems } };
      
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { 
          ...state.cart,
          paymentMethod: action.payload 
        },
      };
    default:
      return state;
  }
}

export const StoreProvider = (props) =>  {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}