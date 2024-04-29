var db = openDatabase('food', '1.0', 'food poisoning', 2 * 1024 * 1024);

var msg;
var food_category = [];
var food = [];
var food_reaction = [];

db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS category (id unique, title)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS food (id unique, title)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS reaction (id1 , id2, content)');
  //   tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "菜鸟教程")');
  //   tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "www.runoob.com")');
  //   msg = '<p>数据表已创建，且插入了两条数据。</p>';
  //   document.querySelector('#status').innerHTML = msg;
});

// db.transaction(function (tx) {
//   tx.executeSql('DELETE FROM LOGS  WHERE id=1');
//   msg = '<p>删除 id 为 1 的记录。</p>';
//   document.querySelector('#status').innerHTML = msg;
// });

// db.transaction(function (tx) {
//   tx.executeSql("UPDATE LOGS SET log='www.w3cschool.cc' WHERE id=2");
//   msg = '<p>更新 id 为 2 的记录。</p>';
//   document.querySelector('#status').innerHTML = msg;
// });

// db.transaction(function (tx) {
//   tx.executeSql(
//     'SELECT * FROM LOGS',
//     [],
//     function (tx, results) {
//       var len = results.rows.length,
//         i;
//       msg = '<p>查询记录条数: ' + len + '</p>';
//       document.querySelector('#status').innerHTML += msg;

//       for (i = 0; i < len; i++) {
//         msg = '<p><b>' + results.rows.item(i).log + '</b></p>';
//         document.querySelector('#status').innerHTML += msg;
//       }
//     },
//     null
//   );
// });
