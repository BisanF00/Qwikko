// src/modules/chatbot/intents/customerIntents.js
const axios = require("axios");

exports.handleCustomerIntent = async (intent, message, token) => {
  const headers = { Authorization: `Bearer ${token || ""}` };
  try {
    switch (intent) {
      case "orders": {
        const res = await axios.get(
          "http://localhost:3000/api/customers/orders",
          { headers }
        );
        const orders = res.data || [];
        if (!orders.length) return "You have no orders yet.";

        return orders
          .map((o) => {
            const id = o.id;
            const status = o.status || "unknown";
            const total =
              typeof o.total_amount === "number"
                ? o.total_amount.toFixed(2)
                : o.total_amount ?? "N/A";
            const created = o.created_at
              ? new Date(o.created_at).toLocaleString()
              : "N/A";
            const items = Array.isArray(o.items) ? o.items : [];
            const itemsCount = items.reduce(
              (sum, it) => sum + (it.quantity || 0),
              0
            );

            return `#${id} | status: ${status} | total: ${total} | Items included in this order:: ${itemsCount} | ordered At: ${created} `;
          })
          .join("\n");
      }

      case "order_details": {
        const orderId = message.match(/\d+/)?.[0];
        if (!orderId) return "Please provide the order number.";

        const res = await axios.get(
          `http://localhost:3000/api/customers/orders/${orderId}`,
          { headers }
        );

        const order = res.data?.data;
        if (!order) return `Order #${orderId} not found.`;

        // Helpers
        const fmtMoney = (n) =>
          typeof n === "number"
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(n)
            : n ?? "N/A";
        const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "N/A");

        // Basic fields from controller query
        const id = order.order_id ?? order.id ?? orderId;
        const total = fmtMoney(order.total_amount);
        const payStatus = order.payment_status ?? "unknown";
        const address = order.shipping_address || "N/A";
        const created = fmtDate(order.created_at);
        const updated = fmtDate(order.updated_at);

        // Items list (note: keys are 'product_name', 'price', 'quantity', 'variant' per your SQL)
        const items = Array.isArray(order.items) ? order.items : [];
        const itemsCount = items.reduce((s, it) => s + (it.quantity || 0), 0);
        const itemsStr = items
          .map((i, idx) => {
            const name = i.product_name || i.name || `Item ${idx + 1}`;
            const price = fmtMoney(i.price);
            const qty = i.quantity ?? 0;
            const variant = i.variant ? ` [${i.variant}]` : "";
            const line =
              typeof i.price === "number" && typeof qty === "number"
                ? fmtMoney(i.price * qty)
                : null;
            return `- ${name}${variant} — ${price} × ${qty}${
              line ? ` = ${line}` : ""
            }`;
          })
          .join("\n");

        // Payments (if any)
        const pays = Array.isArray(order.payments) ? order.payments : [];
        const paysStr = pays.length
          ? pays
              .map((p) => {
                const amt = fmtMoney(p.amount);
                const pm = p.payment_method || "N/A";
                const st = p.status || "N/A";
                const tid = p.transaction_id
                  ? ` (TX: ${p.transaction_id})`
                  : "";
                const when = fmtDate(p.created_at);
                return `• ${pm}: ${amt} — ${st}${tid} on ${when}`;
              })
              .join("\n")
          : "• No payments recorded";

        return [
          `Order #${id}`,
          `Payment Status (payment): ${payStatus}`,
          `Total: ${total}`,
          `Items: ${itemsCount}`,
          `Created: ${created}`,
          `Updated: ${updated}`,
          `Shipping: ${address}`,
          itemsStr ? `\nItems:\n${itemsStr}` : "",
          `\nPayments:\n${paysStr}`,
        ]
          .filter(Boolean)
          .join("\n");
      }

      case "track_order": {
        const orderId = message.match(/\d+/)?.[0];
        if (!orderId) return "Please provide the order number.";

        const res = await axios.get(
          `http://localhost:3000/api/customers/orders/${orderId}/track`,
          { headers }
        );

        // دعم أكثر من شكل للرد:
        // { data: { status: "..." } } أو { status: "..." }
        const status = res.data?.data?.status ?? res.data?.status ?? "unknown";

        // لو ما فيه داتا أصلاً
        if (!res.data || (!res.data.data && !res.data.status)) {
          return `Order #${orderId} not found.`;
        }

        return `Order #${orderId} — Status: ${status}`;
      }

      case "wishlist": {
        const res = await axios.get(
          "http://localhost:3000/api/customers/wishlist",
          { headers }
        );
        const list = res.data || [];
        if (!list.length) return "Your wishlist is empty.";
        return list.map((p) => `${p.name} - $${p.price}`).join("\n");
      }
      case "cart": {
        const res = await axios.get(
          "http://localhost:3000/api/customers/cart",
          { headers }
        );
        const carts = res.data || [];
        if (!carts.length) return "You have no carts.";
        return carts
          .map(
            (c) =>
              `Cart #${c.id}: ${c.items.length} items — Total: $${c.items
                .reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
                .toFixed(2)}`
          )
          .join("\n");
      }
      case "cart_details": {
        const cartId = message.match(/\d+/)?.[0];
        if (!cartId) return "Please provide the cart ID.";
        const res = await axios.get(
          `http://localhost:3000/api/customers/cart/${cartId}`,
          { headers }
        );
        const cart = res.data;
        if (!cart?.items?.length) return `Cart #${cartId} is empty.`;
        return cart.items
          .map((i) => `${i.name} - $${i.price} × ${i.quantity}`)
          .join("\n");
      }
      case "payment":
        return "We accept Credit/Debit Card, PayPal, and Cash on Delivery.";
      case "coverage":
        return "We deliver to Amman, Zarqa, Irbid, Aqaba, Mafraq, Balqa, Madaba, Karak, Tafilah, Ma'an, Jerash, Ajloun.";
      case "category": {
        try {
          const res = await axios.get(`http://localhost:3000/api/categories`, {
            headers: { Authorization: `Bearer ${token || ""}` },
          });

          const categories = res.data.data || res.data;

          if (!categories || categories.length === 0)
            return "There are no categories available right now. 🛍️";

          const formatted = categories
            .map(
              (c, i) =>
                `${i + 1}. **${c.name}**${
                  c.description ? ` - ${c.description}` : ""
                }`
            )
            .join("\n");

          return `🛒 **Available Categories:**\n${formatted}\n\nYou can mention any category name to explore its products.`;
        } catch (err) {
          console.error(
            "Error fetching categories:",
            err.response?.data || err
          );
          return "❌ Sorry, I couldn't fetch the categories at the moment.";
        }
      }
      case "vendors": {
        const res = await axios.get(
          "http://localhost:3000/api/vendor/stores", // your route
          { headers: { Authorization: `Bearer ${token || ""}` } }
        );
        const vendors = res.data.data || [];
        if (!vendors.length) return "No approved vendors found.";

        return vendors
          .map(
            (v, i) =>
              `${i + 1}. ${v.store_name} (ID: ${v.id}) - Contact: ${
                v.contact_email || "N/A"
              }`
          )
          .join("\n");
      }
      case "go_to_orders": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `📦 Sure! You can view all your orders here:\n${frontendUrl}/customer/orders`;
      }

      case "go_to_cart": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `🛒 Here's your shopping cart — review your items or proceed to checkout:\n${frontendUrl}/customer/cart`;
      }

      case "go_to_products": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `🛍️ Explore all available products here:\n${frontendUrl}/customer/products`;
      }

      case "go_to_vendors": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `🏪 Browse and discover trusted vendors here:\n${frontendUrl}/customer/stores`;
      }

      case "go_to_settings": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `⚙️ Manage your account settings here:\n${frontendUrl}/customer/settings`;
      }

      case "go_to_profile": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `👤 View and edit your personal profile here:\n${frontendUrl}/customer/profile`;
      }

      case "go_to_home": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `🏠 Welcome home! Visit your main dashboard here:\n${frontendUrl}/customer/home`;
      }

      case "go_to_wishlist": {
        const frontendUrl = process.env.FRONTEND_URL;
        return `💖 Check out your saved products in your wishlist here:\n${frontendUrl}/customer/wishlist`;
      }

      default:
        return ""; // empty => AI will handle generic answer
    }
  } catch (err) {
    console.error("customerIntents error:", err?.response?.data || err.message);
    return "❌ Couldn't fetch data from backend.";
  }
};
