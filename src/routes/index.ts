const route = {
  Home: "/",
  About: "/about",
  Contact: "/contact",
  Faq: "/faq",
  PrivacyPolicy: "/privacy-policy",
  TermsAndConditions: "/terms-and-conditions",
  NotFound: "/404",
  Login: "/login",
  ForgetPassword: "/forget",
  Register: "/register",
  EmailVerification: "/email-verification",
  ChangePassword: "/account/password",
  PasswordReset: "/resetpassword",
  PasswordResetEmail: "/resetpassword-email-sent",
  PasswordResetDone: "/password-reset-done",
  Account: "/account",
  Profile: "/account/setting",

  protectedRoutes(): string[] {
    return [
      this.Account,
      this.Profile,
    ];
  },
};

export default route;
