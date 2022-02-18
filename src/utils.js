import { BUY_MULTIPLIER, SELL_MULTIPLIER } from "./constants";

function getPrice(data){
    let basePrice = data.prezzo;
    return parseFloat(basePrice.replace(",", "."));
}

function getFinalPrice(data, multiplier){
    let p = getPrice(data);
    return Math.round((p*multiplier)*2)/2;
}

function priceFormat(price){
    return price.toFixed(2)+"€";
}

function getTotalPrice(cart){
    if(Object.keys(cart).length===0) return 0;
    let finalPrice=0;
    Object.keys(cart).map((key, index)=>{
        let product = cart[key];
        let price = (getFinalPrice(product.book, (parseInt(product.action)>0)?BUY_MULTIPLIER:SELL_MULTIPLIER))*product.quantity*parseInt(product.action);
        finalPrice+=price;
    });
    return finalPrice;
}


export {getPrice, getFinalPrice, priceFormat, getTotalPrice}