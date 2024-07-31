const route = {
  Home: "/",
  About: "/about",
  Contact: "/contact",
  Faq: "/faq",
  PrivacyPolicy: "/privacy-policy",
  ShippingAndDelivery: "/shipping-and-delivery",
  Returns: "/return-policy",
  CancellatonsAndRefunds: "/cancellation-and-refunds",
  TermsAndConditions: "/terms-and-conditions",
  NotFound: "/404",
  Login: "/login",
  ForgetPassword: "/forget",
  Register: "/register",
  EmailVerification: "/email-verification",
  CartPage: "/cart",
  ChangePassword: "/account/password",
  Checkout: "/checkout",
  OrderComplete: "/order-complete",
  Products: "/products",
  Product: "/product",
  Shop: "/shop",
  Wishlist: "/wishlist",
  PasswordReset: "/resetpassword",
  PasswordResetEmail: "/resetpassword-email-sent",
  PasswordResetDone: "/password-reset-done",
  Account: "/account",
  Profile: "/account/setting",
  OrderHistory: "/orders/history",
  OrderDetails: "/orders/details",

  protectedRoutes(): string[] {
    return [
      this.Account,
      this.Profile,
      this.OrderHistory,
      this.OrderDetails,
      this.CartPage,
      this.Wishlist,
    ];
  },
};

export default route;
