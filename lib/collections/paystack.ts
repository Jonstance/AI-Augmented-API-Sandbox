import type { Collection } from "@/lib/types";

export const paystackCollection: Collection = {
  id: "paystack",
  name: "Paystack",
  baseUrl: "https://api.paystack.co",
  authType: "bearer",
  authLabel: "Paystack Secret Key",
  endpoints: [
    {
      id: "paystack-list-transactions",
      name: "List Transactions",
      category: "Transactions",
      method: "GET",
      path: "/transaction?perPage=5",
      description: "List all transactions",
    },
    {
      id: "paystack-verify-transaction",
      name: "Verify Transaction",
      category: "Transactions",
      method: "GET",
      path: "/transaction/verify/:reference",
      params: [
        { name: "reference", defaultValue: "T123456789", description: "Transaction reference" },
      ],
      description: "Verify a transaction by reference",
    },
    {
      id: "paystack-list-customers",
      name: "List Customers",
      category: "Customers",
      method: "GET",
      path: "/customer?perPage=5",
      description: "List all customers",
    },
    {
      id: "paystack-create-customer",
      name: "Create Customer",
      category: "Customers",
      method: "POST",
      path: "/customer",
      description: "Create a new customer",
      defaultBody: {
        email: "adaeze.okafor@example.ng",
        first_name: "Adaeze",
        last_name: "Okafor",
        phone: "+2348012345678",
      },
    },
    {
      id: "paystack-initialize-payment",
      name: "Initialize Payment",
      category: "Payment",
      method: "POST",
      path: "/transaction/initialize",
      description: "Initialize a new payment transaction",
      defaultBody: {
        email: "chukwuemeka.eze@example.ng",
        amount: 500000,
        currency: "NGN",
        reference: `TXN_${Date.now()}`,
      },
    },
  ],
};
