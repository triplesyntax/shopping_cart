var ShoppingCart = {}


/* initialize shopping cart */
ShoppingCart.new = function(pricingRules) {
  this.pricingRules = pricingRules
  this.items = []
  this.items_2 = []
  this.total = 0.00

  return ShoppingCart
}

/* add item in the cart */
ShoppingCart.add = function(item, promo_code) {

  /* check if exist in the product list */ 
  var product = this.pricingRules.getProduct(item)
  if (product) {
    var itemFound = 0

    /* check first if already added in the cart */ 
    for (var i = 0; i < this.items_2.length; i ++) {
      if (product.product_code === this.items_2[i].product_code) {
        /* increment item count in the cart */
        this.items_2[i].product_count++
        itemFound = 1
      }
    }

    /* add new item in the cart */
    if (!itemFound) {
      var newItem = {
        product_code: product.product_code,
        product_name: product.product_name,
        product_count: 1,
        product_price: product.product_price,
      }
      this.items_2.push(newItem)      
    }

    this.total = this.pricingRules.computePrice(product, promo_code, this.items_2)
    this.items = this.pricingRules.updateCartItems(this.items_2, this.pricingRules)
  } 
  else {
    console.log("invalid item")
  }
}



var PricingRules = {}

/* initialize pricing rules */
PricingRules.new = function() {
  this.product = []
  return PricingRules
}


/* add product in the product list */
PricingRules.add = function(product_code, product_name, product_price) {

  var product = {
    product_code: product_code,
    product_name: product_name,
    product_price: product_price
  }

  this.product.push(product)
}

/* get product in the product list, return null if not exists */
PricingRules.getProduct = function(product_code) {
  var i = 0

  for (i = 0; i < this.product.length; i++) {
    if (this.product[i].product_code == product_code) {
      return this.product[i]
    }
  }

  return null
}


/* compute total price */
PricingRules.computePrice = function(product, promo_code, items) {
  var product_price = 0
  var product_count = 0
  var total = 0.00

  for (i = 0; i < items.length; i++) {
    product_price = items[i].product_price
    product_count = items[i].product_count

    switch (items[i].product_code) {
      case "ult_small": /* Unlimited 1GB */
        total += PricingRules.computeUltSmallPromo(product_count, product_price)
        break

      case "ult_medium": /* Unlimited 2GB */
        total += parseFloat((product_count * product_price ).toFixed(10))
        break
      
      case "ult_large": /* Unlimited 5GB */
        total += PricingRules.computeUltLargePromo(product_count, product_price)
        break

      case "1gb": /* 1 GB Data-pack */
        total += parseFloat((product_count * product_price ).toFixed(10))
        break

      default:
        /* do nothing */
    }
  }

  total = parseFloat(total.toFixed(10))

  if (promo_code == "I<3AMAYSIM") {
    total = parseFloat((total-(total*0.10)).toFixed(10))
  }

  return total
}


/* compute total price for Unlimited 1GB promo */
PricingRules.computeUltSmallPromo = function (product_count, product_price) {
  var price = 0.00
  var promo_count = 3

  var count = parseInt(product_count / promo_count)
  var remainder = parseInt(product_count % promo_count)

  price += parseFloat((count * (promo_count - 1) * product_price).toFixed(10))
  price += parseFloat((remainder * product_price).toFixed(10))

  return price
}

/* compute total price for Unlimited 5GB promo */
PricingRules.computeUltLargePromo = function (product_count, product_price) {
  var price = 0.00
  var promo_count = 3
  var promo_price = 39.90

  if (product_count > promo_count) {
    price += parseFloat((product_count * promo_price).toFixed(10))
  }
  else {
    price += parseFloat((product_count * product_price ).toFixed(10))
  }

  return price
}

/* update cart items */
PricingRules.updateCartItems = function (items, pricingRules) {
  var product_count = 0
  var product_name = ""
  var x_tag = " x "
  var cart_items = []

  for (i = 0; i < items.length; i++) {
    product_count = items[i].product_count
    product_name = items[i].product_name

    switch (items[i].product_code) {
      case "ult_small":
        cart_items.push(product_count + x_tag + product_name)
        break

      case "ult_medium":
        cart_items.push(product_count + x_tag + product_name)
        var product = pricingRules.getProduct("1gb")
        cart_items.push(product_count + x_tag + product.product_name)
        break
      
      case "ult_large":
        cart_items.push(product_count + x_tag + product_name)
        break

      case "1gb":
        cart_items.push(product_count + x_tag + product_name)
        break

      default:
        /* do nothing */
    }
  }

  return cart_items
}
