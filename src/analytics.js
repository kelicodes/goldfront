// analytics.js
import ReactGA from "react-ga4";
import sha256 from "crypto-js/sha256";

const GA_MEASUREMENT_ID = "G-T661WRB21T";

/** Initialize GA */
export const initGA = (user = null) => {
  ReactGA.initialize(GA_MEASUREMENT_ID, {
    gtagOptions: { send_page_view: true },
  });

  // Set user properties if available
  if (user) {
    ReactGA.set({
      user_id: user.id || null, // GA4 user ID
      login_status: user.loggedIn ? "logged_in" : "guest",
      user_email_hash: user.email ? sha256(user.email).toString() : null,
      user_age: user.age || null,
      user_gender: user.gender || null,
      user_country: user.country || null,
    });
  }
};

/** Log a page view */
export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

/** Log a generic GA4-style event with optional user data */
export const logEvent = (eventName, params = {}, user = null) => {
  const eventParams = { ...params };

  if (user) {
    eventParams.user_id = user.id || null;
    eventParams.login_status = user.loggedIn ? "logged_in" : "guest";
    eventParams.user_email_hash = user.email ? sha256(user.email).toString() : null;
  }

  ReactGA.event({ name: eventName, params: eventParams });
};

/** Log product view */
export const logViewProduct = (item, user = null) => {
  logEvent("view_item", {
    item_name: item.name,
    item_id: item.productId,
    price: Number(item.price),
    category: item.category || "N/A",
    currency: "KES",
  }, user);
};

/** Log add to cart */
export const logAddToCart = (item, user = null) => {
  logEvent("add_to_cart", {
    item_name: item.name,
    item_id: item.productId,
    price: Number(item.price),
    quantity: Number(item.quantity) || 1,
    category: item.category || "N/A",
    currency: "KES",
  }, user);
};

/** Log remove from cart */
export const logRemoveFromCart = (item, user = null) => {
  logEvent("remove_from_cart", {
    item_name: item.name,
    item_id: item.productId,
    price: Number(item.price),
    quantity: Number(item.quantity) || 1,
    category: item.category || "N/A",
    currency: "KES",
  }, user);
};

/** Log checkout start */
export const logBeginCheckout = (cart, user = null) => {
  logEvent("begin_checkout", {
    items: cart.map((item) => ({
      item_name: item.name,
      item_id: item.productId,
      price: Number(item.price),
      quantity: Number(item.quantity),
      category: item.category || "N/A",
      currency: "KES",
    })),
  }, user);
};

/** Log completed purchase */
export const logPurchase = (order, user = null) => {
  logEvent("purchase", {
    transaction_id: order.id,
    value: Number(order.totalPrice),
    currency: "KES",
    items: order.items.map((item) => ({
      item_name: item.name,
      item_id: item.productId,
      price: Number(item.price),
      quantity: Number(item.quantity),
      category: item.category || "N/A",
    })),
  }, user);
};

/** Log user login */
export const logUserLogin = (user) => {
  logEvent("login", { login_method: user.method || "unknown" }, user);
};

/** Log user signup */
export const logUserSignup = (user) => {
  logEvent("sign_up", { signup_method: user.method || "unknown" }, user);
};
