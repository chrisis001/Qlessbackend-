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

    if(url.pathname.startsWith("/order/") && request.method=="POST"){
       const mtejaID = url.pathname.split("/")[2];
       const order = await request.json();
       let orders = await env.QLESS_KV.get("orders_" + mtejaID, {type:"json"}) || [];
       orders.unshift({...order, id: Date.now(), time: new Date().toISOString()});
       await env.QLESS_KV.put("orders_" + mtejaID, JSON.stringify(orders));
       return new Response(JSON.stringify({success:1}), { headers });
    }

    if(url.pathname.startsWith("/dashboard/")){
       const mtejaID = url.pathname.split("/")[2];
       const orders = await env.QLESS_KV.get("orders_" + mtejaID, {type:"json"}) || [];
       const html = `<h1>Dashboard: ${mtejaID}</h1><p>Orders: ${orders.length}</p>`;
       return new Response(html, { headers:{'Content-Type':'text/html',...headers} });
    }

    return new Response("QLESS API Iko Live", { headers });
  }
}
