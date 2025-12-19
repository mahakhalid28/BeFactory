module.exports = function(req, res, next) {
    let cart = req.session.cart;
    let coupon = req.body.coupon || req.query.coupon; // Check form or URL
    let discount = 0;
    let total = 0;

    // Calculate original total
    if (cart) {
        for (let id in cart) {
            total += cart[id].item.price * cart[id].quantity;
        }
    }

    // Apply Discount Logic
    if (coupon === 'SAVE10') {
        discount = total * 0.10; // 10%
    }

    // Attach data to request so the next route can use it
    req.session.discount = discount;
    req.session.finalTotal = total - discount;
    
    next();
};