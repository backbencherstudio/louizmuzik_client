import { baseApi } from "../baseApi";

export const paymentApis = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addPaypalEmail: builder.mutation({
            query: ({ paypalEmail, userId }: { paypalEmail: string, userId: string }) => ({
                url: `/auth/userManagement/addPaypalEmail/${userId}`,
                method: "PATCH",
                body: { paypalEmail },
            }),
        }),
        cancelSubscription: builder.mutation({
            query: ({ customerId }: { customerId: string }) => ({
                url: `/payment/cancel-subscription/${customerId}`,
                method: "POST",
            }),
        }),

        cancelPaypalSubscription: builder.mutation({
            query: ({ customerId }: { customerId: string }) => ({
                url: `/payment/paypalSubscriptionCancel/${customerId}`,
                method: "POST",
            }),
        }),
    }),
});

export const { useAddPaypalEmailMutation, useCancelSubscriptionMutation, useCancelPaypalSubscriptionMutation } = paymentApis;