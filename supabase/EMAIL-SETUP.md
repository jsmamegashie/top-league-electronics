# Turning on email receipts

The app already asks for a receipt email after every in-shop sale (when the customer has an email),
when an online order is packed, and an order confirmation when someone checks out online with an email.
Nothing is sent until these three steps are done. Each receipt is only ever sent once.

1. **Resend account.** Sign up at resend.com, add your domain (for example pricerighttech.com) and add the DNS
   records it shows you. Then create an API key.
2. **Deploy the function.** In Supabase: Edge Functions > Deploy a new function > Via editor.
   Name it `send-receipt`, paste the contents of `functions/send-receipt/index.ts`, and deploy.
   In the function's settings, turn **off** "Verify JWT" (online customers are not signed in).
3. **Add secrets.** Edge Functions > Secrets:
   - `RESEND_API_KEY` = the key from step 1
   - `MAIL_FROM` = `PriceRight Tech <receipts@yourdomain.com>` (must use the verified domain)
   - `SITE_URL` = `https://top-league-electronics.vercel.app` (or your own domain later)

Test: make a sale to a customer with your own email. The staff app shows "Receipt emailed to the customer".
