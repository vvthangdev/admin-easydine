var DataTypes = require("sequelize").DataTypes;
var _auth = require("./auth");
var _conversation = require("./conversation");
var _evaluate = require("./evaluate");
var _item = require("./item");
var _item_order = require("./item_order");
var _message = require("./message");
var _order_detail = require("./order_detail");
var _payment = require("./payment");
var _reservation_table = require("./reservation_table");
var _table_info = require("./table_info");
var _user = require("./user");

function initModels(sequelize) {
  var auth = _auth(sequelize, DataTypes);
  var conversation = _conversation(sequelize, DataTypes);
  var evaluate = _evaluate(sequelize, DataTypes);
  var item = _item(sequelize, DataTypes);
  var item_order = _item_order(sequelize, DataTypes);
  var message = _message(sequelize, DataTypes);
  var order_detail = _order_detail(sequelize, DataTypes);
  var payment = _payment(sequelize, DataTypes);
  var reservation_table = _reservation_table(sequelize, DataTypes);
  var table_info = _table_info(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  message.belongsTo(conversation, { as: "conversation", foreignKey: "conversation_id"});
  conversation.hasMany(message, { as: "messages", foreignKey: "conversation_id"});
  item_order.belongsTo(item, { as: "item", foreignKey: "item_id"});
  item.hasMany(item_order, { as: "item_orders", foreignKey: "item_id"});
  evaluate.belongsTo(order_detail, { as: "order", foreignKey: "order_id"});
  order_detail.hasOne(evaluate, { as: "evaluate", foreignKey: "order_id"});
  item_order.belongsTo(order_detail, { as: "order", foreignKey: "order_id"});
  order_detail.hasMany(item_order, { as: "item_orders", foreignKey: "order_id"});
  payment.belongsTo(order_detail, { as: "order", foreignKey: "order_id"});
  order_detail.hasMany(payment, { as: "payments", foreignKey: "order_id"});
  reservation_table.belongsTo(order_detail, { as: "reservation", foreignKey: "reservation_id"});
  order_detail.hasMany(reservation_table, { as: "reservation_tables", foreignKey: "reservation_id"});
  reservation_table.belongsTo(table_info, { as: "table", foreignKey: "table_id"});
  table_info.hasMany(reservation_table, { as: "reservation_tables", foreignKey: "table_id"});
  auth.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(auth, { as: "auths", foreignKey: "user_id"});
  conversation.belongsTo(user, { as: "user1_user", foreignKey: "user1"});
  user.hasMany(conversation, { as: "conversations", foreignKey: "user1"});
  conversation.belongsTo(user, { as: "user2_user", foreignKey: "user2"});
  user.hasMany(conversation, { as: "user2_conversations", foreignKey: "user2"});
  message.belongsTo(user, { as: "sender", foreignKey: "sender_id"});
  user.hasMany(message, { as: "messages", foreignKey: "sender_id"});
  order_detail.belongsTo(user, { as: "customer", foreignKey: "customer_id"});
  user.hasMany(order_detail, { as: "order_details", foreignKey: "customer_id"});

  return {
    auth,
    conversation,
    evaluate,
    item,
    item_order,
    message,
    order_detail,
    payment,
    reservation_table,
    table_info,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
