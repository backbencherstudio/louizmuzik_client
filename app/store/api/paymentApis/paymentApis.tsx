import { baseApi } from "../baseApi";

export const paymentApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPaypalEmail: builder.mutation({
      query: ({
        paypalEmail,
        userId,
      }: {
        paypalEmail: string;
        userId: string;
      }) => ({
        url: `/auth/userManagement/addPaypalEmail/${userId}`,
        method: "PATCH",
        body: { paypalEmail },
      }),
    }),

    cancelSubscription: builder.mutation({
      query: (customerId) => ({
        url: `/payment/cancel-subscription/${customerId}`,
        method: "POST",
      }),
    }),

    cancelPaypalSubscription: builder.mutation({
      query: (subscriptionId) => {
        return {
          url: `/payment/paypalSubscriptionCancel/${subscriptionId}`,
          method: "POST",
        };
      },
    }),

    purchasePack: builder.mutation({
      query: (data) => ({
        url: `/pack/packPurchase`,
        method: "POST",
        body: data,
      }),
    }),

    getBillingHistory: builder.query({
      query: (userId) => ({
        url: `/auth/userManagement/billingHistory/${userId}`,
        method: "GET",
      }),
    }),

    getSalesHistory: builder.query({
      query: (userId) => ({
        url: `auth/userManagement/singleUserSaleseHistory/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddPaypalEmailMutation,
  useCancelSubscriptionMutation,
  useCancelPaypalSubscriptionMutation,
  usePurchasePackMutation,
  useGetBillingHistoryQuery,
  useGetSalesHistoryQuery,
} = paymentApis;
