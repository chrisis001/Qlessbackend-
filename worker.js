export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // HII NDIO ROUTE INAKOSEKANA BOSS
    if (url.pathname === '/owner/stats' || url.pathname === '/orders/stats') {
      const stats = {
        totalOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0
      };
      return new Response(JSON.stringify(stats), {
        headers: {...headers, 'Content-Type': 'application/json' }
      });
    }

    if(url.pathname.startsWith("/order/") && request.method === 'POST') {
      const mtejaID = url.pathname.split("/")[2];
      const order = await request.json();
      let orders = await env.QLESS_KV.get("orders_" + mtejaID, "json") || [];
      orders.unshift({...order, id: Date.now()});
      await env.QLESS_KV.put("orders_" + mtejaID, JSON.stringify(orders));
      return new Response(JSON.stringify({success: true}), { headers });
    }

    if(url.pathname.startsWith("/dashboard/")) {
      const mtejaID = url.pathname.split("/")[2];
      const orders = await env.QLESS_KV.get("orders_" + mtejaID, "json") || [];
      const html = `<h1>Dashboard: ${mtejaID}</h1><pre>${JSON.stringify(orders, null, 2)}</pre>`;
      return new Response(html, { headers: {...headers, 'Content-Type': 'text/html'} });
    }

    return new Response("QLESS API Iko Live", { headers });
  }
}
add owner/stats
