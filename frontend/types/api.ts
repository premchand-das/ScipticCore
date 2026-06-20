export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};