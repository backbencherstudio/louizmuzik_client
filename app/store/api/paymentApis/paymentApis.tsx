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
    }),
});

export const { useAddPaypalEmailMutation } = paymentApis;