export async function createPayment(
  amount: number,
  description: string,
  callbackUrl: string
) {
  try {
    const res = await fetch('https://sandbox.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amount * 10,
        description,
        callback_url: callbackUrl,
      }),
    })
    const data = await res.json()
    if (data.data?.code === 100) {
      return {
        success: true,
        authority: data.data.authority as string,
        paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${data.data.authority}`,
      }
    }
    return { success: false }
  } catch {
    return { success: false }
  }
}

export async function verifyPayment(authority: string, amount: number) {
  try {
    const res = await fetch('https://sandbox.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amount * 10,
        authority,
      }),
    })
    const data = await res.json()
    return {
      success: data.data?.code === 100,
      refId: data.data?.ref_id as number | undefined,
    }
  } catch {
    return { success: false }
  }
}
