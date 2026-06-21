import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { Plan } from "@prisma/client"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("stripe-signature")!
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId || !session.subscription) break
      const sub = await stripe.subscriptions.retrieve(session.subscription as string)
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: Plan.PRO,
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        },
      })
      break
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string }
      const subId = invoice.subscription
      if (!subId) break
      const sub = await stripe.subscriptions.retrieve(subId)
      const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: subId } })
      if (!user) break
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: Plan.PRO,
          stripeCurrentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        },
      })
      break
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: sub.id } })
      if (!user) break
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: Plan.FREE, stripeSubscriptionId: null, stripeCurrentPeriodEnd: null },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
