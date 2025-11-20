import ReactGA from "react-ga4";
const GA_MEASUREMENT_ID = "G-T661WRB21T";

/** Initialize GA */
export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

/** Log a page view */
export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

/** Log a generic event */
export const logEvent = (category, action, label, value = null) => {
  ReactGA.event({ category, action, label, value });
};

/** Log product view */
export const logViewProduct = (item) => {
  ReactGA.event({
    category: "Ecommerce",
    action: "view_item",
    label: item.name,
    value: item.price,
    items: [
      {
        item_name: item.name,
        item_id: item.productId,
        price: item.price,
        category: item.category || "N/A",
      },
    ],
  });
};

/** Log add to cart */
export const logAddToCart = (item) => {
  ReactGA.event({
    category: "Ecommerce",
    action: "add_to_cart",
    label: item.name,
    value: item.price,
    items: [
      {
        item_name: item.name,
        item_id: item.productId,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
};

/** Log remove from cart */
export const logRemoveFromCart = (item) => {
  ReactGA.event({
    category: "Ecommerce",
    action: "remove_from_cart",
    label: item.name,
    value: item.price,
    items: [
      {
        item_name: item.name,
        item_id: item.productId,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
};

/** Log begin checkout */
export const logBeginCheckout = (cart) => {
  ReactGA.event({
    category: "Ecommerce",
    action: "begin_checkout",
    items: cart.map((item) => ({
      item_name: item.name,
      item_id: item.productId,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

/** Log completed purchase */
export const logPurchase = (order) => {
  ReactGA.event({
    category: "Ecommerce",
    action: "purchase",
    value: order.totalPrice,
    transaction_id: order.id,
    items: order.items.map((item) => ({
      item_name: item.name,
      item_id: item.productId,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

/** Log user login */
export const logUserLogin = (userEmail) => {
  ReactGA.event({
    category: "User",
    action: "login",
    label: userEmail,
  });
};

/** Log user signup */
export const logUserSignup = (userEmail) => {
  ReactGA.event({
    category: "User",
    action: "signup",
    label: userEmail,
  });
};
