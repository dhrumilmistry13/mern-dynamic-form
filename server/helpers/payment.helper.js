const axios = require('axios');
const moment = require('moment');

const baseURL = process.env.PAYMENT_API_URL;
const client = axios.create({
  timeout: 100000,
  headers: {
    'Content-Type': 'application/graphql',
    Authorization: `${process.env.PAYMENT_MERCHANT_UID};${process.env.PAYMENT_API_KEY}`,
  },
});

const createOneTimePayment = (amount, payment_id) => {
  const data = JSON.stringify({
    query: `mutation oneTimePayment($amount: Int!,$payment_method_id: String!){
        createOneTimePayment(amount: $amount, 
                merchant_uid: "${process.env.PAYMENT_MERCHANT_UID}", 
                payment_method_id: $payment_method_id, 
                account_code: "", 
                currency: "", 
                send_receipt: true) {
          amount
          card_brand
          created_at
          currency
          last_four
          service_fee
          status
          transaction_id
        }
      }`,
    variables: {
      amount: parseFloat(parseFloat(amount) * 100).toFixed(0),
      payment_method_id: payment_id,
    },
  });
  return client.post(baseURL, data);
};
const createSubscriptionPayment = (
  amount,
  payment_id,
  pay_id,
  sub_name,
  sub_description,
  first_payment_date = moment().format('YYYY-MM-DD')
) => {
  const data = JSON.stringify({
    query: `mutation RecurringPayment($amount:Int!,$first_payment_date:AWSDate!,$payment_count:Int!,$payment_interval:RecurringInterval!,$payment_method_id:String!,$payor_id:String!,$recurring_description:String!,$recurring_name:String!){
    createRecurringPayment(input: {
              amount: $amount, 
              merchant_uid: "${process.env.PAYMENT_MERCHANT_UID}", 
              payment_count: $payment_count, 
              payment_interval: $payment_interval, 
              payment_method_id: $payment_method_id, 
              payor_id: $payor_id, 
              recurring_description: $recurring_description, 
              recurring_name: $recurring_name, 
              first_payment_date:$first_payment_date
          }) {
      account_code
      amount_per_payment
      created_date
      currency
      fee_mode
      fee_per_payment
      is_active
      is_processing
      merchant_uid
      metadata
      next_payment_date
      payment_interval
      prev_payment_date
      recurring_description
      recurring_id
      recurring_name
      reference
      remaining_payments
      status
      total_amount_per_payment
    }
  }`,
    variables: {
      amount: parseFloat(amount) * 100,
      payment_count: 365,
      payment_interval: 'MONTHLY',
      payment_method_id: payment_id,
      payor_id: pay_id,
      recurring_description: sub_description,
      recurring_name: sub_name,
      first_payment_date:
        first_payment_date >= moment().tz('Europe/London').format('YYYY-MM-DD')
          ? first_payment_date
          : moment().tz('Europe/London').format('YYYY-MM-DD'),
    },
  });
  return client.post(baseURL, data);
};
const updateSubscriptionPayment = (payment_method_id, recurring_id) => {
  const data = JSON.stringify({
    query: `mutation RecurringPayment($payment_method_id:String!,$recurring_id:String!){
    updateRecurringPayment(input: {
              payment_method_id: $payment_method_id,
              recurring_id: $recurring_id,
              pay_all_missed_payments:true
           }) {
      account_code
      amount_per_payment
      created_date
      currency
      fee_mode
      fee_per_payment
      is_active
      is_processing
      merchant_uid
      metadata
      next_payment_date
      payment_interval
      prev_payment_date
      recurring_description
      recurring_id
      recurring_name
      reference
      remaining_payments
      status
      total_amount_per_payment
    }
  }`,
    variables: {
      payment_method_id,
      recurring_id,
    },
  });
  return client.post(baseURL, data);
};
const getSubdcriptionData = (sub_id) => {
  const data = JSON.stringify({
    query: `query listRecurTransactions($query: SqlQuery) {
     recurringPayments(direction: FORWARD, limit: 1, query: $query) {
          items {
              account_code
              amount_per_payment
              created_date
              currency
              fee_mode
              fee_per_payment
              is_active
              is_processing
              merchant_uid
              next_payment_date
              payment_interval
              prev_payment_date
              recurring_description
              recurring_id
              recurring_name
              reference
              remaining_payments
              status
              total_amount_per_payment
          }
      }
  }`,
    variables: {
      query: {
        query_list: [
          {
            key: 'recurring_id',
            value: sub_id,
            operator: 'EQUAL',
            conjunctive_operator: 'NONE_NEXT',
          },
        ],
      },
    },
  });
  return client.post(baseURL, data);
};
const createRefundPayment = (amount, payment_id, resone, email) => {
  const data = JSON.stringify({
    query: `mutation CreateRefund($amount: Int!, $refund_email: String, $reason_code: RefundReasonCode!, $transaction_id: String!, $reason_details: String) {  
      createRefund(
          amount: $amount    
      refund_email: $refund_email
          transaction_id: $transaction_id
              refund_reason: {reason_code: $reason_code, reason_details: $reason_details
              }
                )}`,
    variables: {
      amount: parseFloat(amount) * 100,
      reason_code: 'REQUESTED_BY_CUSTOMER',
      reason_details: resone,
      refund_email: email,
      transaction_id: payment_id,
    },
  });
  return client.post(baseURL, data);
};
const cancelSubscription = (recurring_id) => {
  const data = JSON.stringify({
    query: `mutation cancelRecurring($recurring_id:String!)
  {
      cancelRecurringPayment(recurring_id:$recurring_id)
  }`,
    variables: { recurring_id },
  });
  return client.post(baseURL, data);
};
module.exports = {
  createOneTimePayment,
  createSubscriptionPayment,
  getSubdcriptionData,
  createRefundPayment,
  updateSubscriptionPayment,
  cancelSubscription,
};
