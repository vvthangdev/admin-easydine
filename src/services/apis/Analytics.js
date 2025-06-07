import axiosInstance from "../../config/axios.config";
import { handleApiResponse } from "./handleApiResponse";

export const analyticsAPI = {
  // Nhóm phân tích đơn hàng
  getOrderStatusDistribution: ({ startDate, endDate } = {}) =>
    axiosInstance
      .get("/analytics/orders/status", { params: { startDate, endDate } })
      .then(handleApiResponse),

  getRevenueTrend: ({ startDate, endDate, interval = "day" } = {}) =>
    axiosInstance
      .get("/analytics/orders/revenue", { params: { startDate, endDate, interval } })
      .then(handleApiResponse),

  getPaymentMethodDistribution: ({ startDate, endDate } = {}) =>
    axiosInstance
      .get("/analytics/orders/payment-methods", { params: { startDate, endDate } })
      .then(handleApiResponse),

  getPeopleVsAmount: ({ startDate, endDate } = {}) =>
    axiosInstance
      .get("/analytics/orders/people-amount", { params: { startDate, endDate } })
      .then(handleApiResponse),

  getCancelReasonDistribution: ({ startDate, endDate } = {}) =>
    axiosInstance
      .get("/analytics/orders/cancel-reasons", { params: { startDate, endDate } })
      .then(handleApiResponse),

  // Nhóm phân tích món ăn
  getItemSalesByCategory: ({ startDate, endDate } = {}) =>
    axiosInstance
      .get("/analytics/items/category-sales", { params: { startDate, endDate } })
      .then(handleApiResponse),

  getItemCategoryDistribution: () =>
    axiosInstance
      .get("/analytics/items/category-distribution")
      .then(handleApiResponse),
};