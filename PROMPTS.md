# Prompts Log — AI Business Advisor (Week 7)

## Feature
Given a forecast (product, market, demand score, predicted price), the AI
suggests whether to sell now, an expected price, and one actionable tip —
using Google Gemini (`gemini-3.1-flash-lite`).

## Version 1 — too generic
**Prompt:** "Give advice for selling {product}."
**Output:** Generic tips about selling in general, ignored the actual
market/demand_score/price data entirely — not usable.

## Version 2 — added context but no length limit
**Prompt:** Included product, market, demand_score, and predicted_price,
but no instruction on length/format.
**Output:** Accurate but 8+ sentences, too long to fit in a dashboard card.

## Version 3 — final (used in the app)
**Prompt:**
"You are a market advisor for small farmers and artisans in Uttarakhand.
Product: {product}, Market: {market}, Demand score: {demand_score}/100,
Predicted price: ₹{predicted_price}. Give a short, practical recommendation
(3-4 sentences) on whether to sell now, what price to expect, and one
actionable tip. Keep it simple, in plain English."

**Example input:** Apples, Mussoorie, demand score 82, price ₹120
**Example output:** "With a high demand score of 82, now is an excellent
time to bring your apples to the Mussoorie market. You can confidently
expect a price of around ₹120 per kg, but be prepared to negotiate
slightly based on immediate local stock levels. To maximize your profit,
sort your apples by size and color before heading to the market, as
premium presentation allows you to command the higher end of the
price range."

**Best version:** Version 3 — because constraining length to 3-4 sentences
keeps it dashboard-friendly, and explicitly asking for a sell/price/tip
structure gives farmers something immediately actionable instead of
generic advice.

## System role
"You are a market advisor for small farmers and artisans in Uttarakhand"
— sets domain context so recommendations stay relevant to local produce
and pricing rather than generic business advice.
