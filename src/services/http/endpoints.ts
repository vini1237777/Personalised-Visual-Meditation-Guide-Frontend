export const ENDPOINTS = {
  user: {
    get: "/api/user/get",
    update: "/api/user/update",
    delete: "/api/user/delete",
  },
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
    resetPassword: "/api/auth/reset-password",
    changePassword: "/api/auth/change-password",
    verifyEmail: "/api/auth/verify-email",
    sendVerificationEmail: "/api/auth/send-verification-email",
  },
  script: {
    post: "/api/script/post",
  },
} as const;
