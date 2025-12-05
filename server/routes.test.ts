import { describe, it, expect, beforeAll } from "vitest";
import Stripe from "stripe";

describe("Stripe Integration Tests", () => {
  let stripe: Stripe;

  beforeAll(() => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }
    stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
  });

  it("should have STRIPE_SECRET_KEY configured", () => {
    expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
    expect(process.env.STRIPE_SECRET_KEY).toMatch(/^sk_test_/);
  });

  it("should have STRIPE_WEBHOOK_SECRET configured", () => {
    expect(process.env.STRIPE_WEBHOOK_SECRET).toBeDefined();
    expect(process.env.STRIPE_WEBHOOK_SECRET).toMatch(/^whsec_/);
  });

  it("should be able to connect to Stripe API", async () => {
    const balance = await stripe.balance.retrieve();
    expect(balance).toBeDefined();
    expect(balance.object).toBe("balance");
  });

  it.skip("should have webhook endpoint configured", async () => {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    
    const ourWebhook = webhooks.data.find(
      (wh) => wh.url.includes("sionohmair-insight-academy") && wh.url.includes("/api/stripe/webhook")
    );
    
    expect(ourWebhook).toBeDefined();
    expect(ourWebhook?.status).toBe("enabled");
    expect(ourWebhook?.enabled_events).toContain("checkout.session.completed");
    expect(ourWebhook?.enabled_events).toContain("payment_intent.succeeded");
  });

  it("should be able to create a test checkout session", async () => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Test Coaching Session",
            },
            unit_amount: 2269, // 22.69 EUR
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://sionohmair-insight-academy.manus.space/success",
      cancel_url: "https://sionohmair-insight-academy.manus.space/cancel",
      metadata: {
        userId: "test-user-123",
        coachingType: "sprint-clarity",
      },
    });

    expect(session).toBeDefined();
    expect(session.id).toMatch(/^cs_test_/);
    expect(session.amount_total).toBe(2269);
    expect(session.currency).toBe("eur");
    expect(session.status).toBe("open");
  });
});
