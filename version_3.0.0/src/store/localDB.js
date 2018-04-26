

var db = new loki("map.json");    //用new loki来创建数据库，使用localStarge来作为底层的数据存储时，loki的参数是localStorage的key的名称  
db.loadDatabase();    //初始化db后，我们调用loadDatabase方法来从localStorage中获取内容  
var coll = db.addCollection("test")    //为了存储文档，首先要获取集合，用db.addCollection来创建集合  
if (coll == null) {
    var coll = db.addCollection("test");
}

coll.insert({ name: "jike", msg: "hello" });        //向集合中插入一个文档，在insert的方法中编写一个js对象  
db.save();    //进行保存  
var list = coll.find({ name: "jike" });    //查找name为jike的文档列表,返回的是对象数组  
/* 支持两种查询：1、{property:name} 
            2、{property:{operator:value}}         operator表示值的取值范围*/

var resultset = coll.chain().find({ name: "jike" });         //loki还提供resultSet对象针对查询结果进一步做处理，如sort排序  

var list = resultset.offset(10).limit(5).data();        //data()返回对象数组,offset表示从哪开始，limit表示限制几个  

//coll.update(data);    //更新一个对象  
//coll.remove(data);    //删除一个对象  
console.log(coll.count())

export default db
