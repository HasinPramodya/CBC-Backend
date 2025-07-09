import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

export async function createOrder(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "you need to login first",
    });
    return;
  }

  const orderData = {
    OrderID: "",
    email: req.body.email,
    address: req.body.address,
    status: req.body.status,
    phoneNo: req.body.phoneNo,
    billItem: [],
    total: 0,
  };

  try {
    const lastOrder = await Order.find().sort({ date: -1 }).limit(1);
    if (lastOrder.length == 0) {
      orderData.OrderID = "ORD001";
    } else {
      const lastOrderId = lastOrder[0].OrderID;
      const lastOrderNumber = parseInt(lastOrderId.replace("ORD", ""));
      const orderNumber = lastOrderNumber + 1;
      orderData.OrderID = "ORD" + orderNumber.toString().padStart(4, "0");
    }

    for (let i = 0; i < req.body.billItem.length; i++) {
      const product = await Product.findOne({
        productId: req.body.billItem[i].productID,
      });
      if (product == null) {
        res.status(404).json({
          message: "product not found",
        });
        return;
      }
      orderData.billItem[i] = {
        productId: product.productId,
        productName: product.productName,
        image: product.images[0],
        price: product.price,
        quantity: req.body.billItem[i].quantity,
      };
      orderData.total =
        orderData.total + product.price * orderData.billItem[i].quantity;
    }

    const order = new Order(orderData);

    console.log(order);

    await order.save();
    res.status(200).json({
      message: "Order created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Order can not created successfully",
      error: err.message,
    });
  }
}

export async function getOrders(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "You need to Login first",
    });
    return;
  }

  if (req.user.userType == "admin") {
    try {
      const orders = await Order.find();
      res.status(200).json({
        orders,
      });
    } catch (err) {
      res.status(500).json({
        message: "Can not get Orders",
      });
    }
  } else {
    try {
      const orders = await Order.find({
        email: req.user.email,
      });
      res.status(200).json({
        orders,
      });
    } catch (err) {
      res.status(500).json({
        message: "Can not get Orders",
      });
    }
  }
}

export async function updateOrder(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "You need to Login first",
    });
    return;
  }

  if (req.user.userType == "admin") {

    try {
      const order = await Order.findOneAndUpdate(
        { OrderID: req.params.orderId },
        req.body
      );
      res.status(200).json(
        {
          message: "Order Updated Successfully",
        }
      )
    } catch(error) {
     console.log(error);
     res.status(500).json({
      message: "Can not update Order",
     })
    }
  }
}
