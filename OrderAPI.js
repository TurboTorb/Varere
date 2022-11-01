
let sandbox = true;
let prod_url = "www.platform.com/";
let sandbox_url = "www.platform.sandbox.com/";
let return_url = "www.store.com/paid";
let cancel_url = "www.store.com/cancelled";
let user_address = "0x873rhf08uf82h4g98h24984h";


const methods = {
    // Get link to Order page
    order: function(productIDs, intent, shipping, flow, return_url, cancel_url) {
        // NOTE: intent might be "PREORDER" or "REDEEM" or "REFUND" etc.
        // NOTE: shipping might be "NO_SHIPPING" on a digital product or service
        // NOTE: flow might be "PAY_NOW" or "FINANCE" etc.
        try {
            let request = {
                "intent": intent,
                "purchase_units": productIDs,
                "application_context": {
                    "return_url": return_url,
                    "cancel_url": cancel_url,
                    "shipping_preference": shipping,
                    "user_action": flow
                }
            }
            return request;
        } catch (error) {
            console.error("Order error: ", error);
        };
    },

    buildLink: function(method, url, request) {
        // TODO: Build a link here that we can decode on our platform site onMount
        let link = "www.link.com/"
        return link;
    },

    openLink: function(link, title) {
        // TODO: Open the link here in a new window
        let windowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        window.open(link, title, windowFeatures);
    }
}

const SDK = (productIDs, intent, shipping, flow, return_url, cancel_url, platform_url, method, title) => {
    const request = methods.order(productIDs, intent, shipping, flow, return_url, cancel_url);
    const link = methods.buildLink(method, platform_url, request);
    openLink(link, title);
}

export default SDK;

// Paypal request function
// async function openWindow(method, url, request, content_type) {
//     // console.log("REQUEST: "+request);
//     let def_content_type = 'application/json';
//     if(!content_type) {
//         content_type = def_content_type;
//     }
//     const headers = {
//         'Authorization': 'Bearer '+user_address,
//         'Content-Type': content_type,
//         'Prefer': 'return=representation'
//     }
//     // console.log('sending request...')
//     //using the axios instance to perform the request that received from each http method
//     return axiosAPI({
//         method,
//         url,
//         data: request,
//         headers
//     }).then(res => {
//         // console.log("HEADERS:",res.headers);
//         // console.log("HEADERS:Content-Type:",res.headers['content-type']);
//         // Auto refresh token: API server supplies new token if current token is nearing end of life
//         // console.log('res', res)
//         return Promise.resolve(res.data);
//     }).catch(err => {
//         // console.log(err);
//         return Promise.reject(err);
//     });
// };