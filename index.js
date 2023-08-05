//IM-2018-085 H.A.T.D.THILAKASIRI
//DSD WATCH CENTER
//2023

// configurations -------------------------------------------------


var express = require('express')
var ejs = require('ejs'); 
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var alert = require('alert'); 
const path = require('path');
const fileUpload = require('express-fileupload');
var con = mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"",
   database:"dsd-app",
})

var app = express(); 
app.set('view engine','ejs');

app.listen(3000, () => {
    console.log('Server is running at port 3000');
}); 

con.connect(function(error){ 
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static('public'));



// login ,logout, authentication admin and custermer -------------------------------------------------

// login - custermer 
app.get('/custermerLogin', (req, res) => {
    res.render('pages/login',{
        loginError:null,
        session_username: req.session.custermerUsername,   
        rejister_OK:null,  
    });
   });  

// login - admin or superadmin
app.get('/adminlogin', (req, res) => {
    res.render('dashboard/login',{
        loginError:null,  
    });
   });  

// authentication 
app.post('/auth', function(request, response) {
	
	let username = request.body.username; //username aither username or email
	let password = request.body.password;
    let role = request.body.role;
	if (username && password) {
		if(role==0){
		con.query('SELECT * FROM user WHERE (username = ? OR email = ?) AND password = ? ', [username,username, password], function(error, results, fields) {
	
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedinAdmin = true;
				request.session.custermerUsername = username;
              
                console.log(request.session.custermerUsername);
                console.log(request.session.username);
                response.redirect('/');
			}        
			 else  {
                response.render('pages/login',{
                    loginError:'loginError', 
                    session_username:null,
                    rejister_OK:null,     
                });
             
			}			
			response.end();
		});	
	}
	
	else if(role==1){
		con.query('SELECT * FROM user WHERE (username = ? OR email = ?) AND password = ?', [username,username, password], function(error, results, fields) {
	
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedinAdmin = true;
				request.session.adminUsername = username;
                console.log(request.session.username);
      
                 var x =results[0].role;
                 if(x==1)
                 {
                    request.session.adminRole= x;
                    response.redirect('/home');
                 }
                 else if(x==2)
                 {
                    request.session.adminRole= x;
                    response.redirect('/home');
                 }
                 console.log(results[0].role);
                 console.log(request.session.adminRole);
                
			}        
			 else  {
				// response.send('Incorrect Username and or pppPassword!');
                response.render('dashboard/login',{
                    loginError:'loginError', 
                    session_username:null,  
                });
             
			}			
			response.end();
		});	
	}
	}
	 else {
        response.render('dashboard/home',{
            loginError:'loginError',  
        });
	}
	});


//logout - admin
   app.get('/adminLogout', (req, res) => {
    req.session.adminRole=null,
    req.session.adminRole=null,
    res.render('dashboard/login',{
        session_username:null,  
        loginSuccess:null,
        role:null, 
        loginError:null,       
    });
   }); 


// logout -customer

   app.get('/custermerLogout', (req, res) => {

    req.session.custermerUsername=null,
    res.render('pages/login',{
        session_username:req.session.custermerUsername,  
        loginSuccess:null,
        role:null,
        loginError:'',
        rejister_OK:null,      
    });
   }); 






// custermer funtions ------------------------------------------------------


// user - rejister -customer - get

app.get('/signUp', (req, res) => {
    res.render('pages/signUp',{
        rejister_OK:null,
        rejistation_error:null,      
    });
   });  

//user - rejister -customer - post 

app.post('/custermerSignIn',(req, res) => { 
  
    if(req.body.password==req.body.retypePassword){

        let data = {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email,contactNumber1: req.body.contactNumber1,contactNumber2: req.body.contactNumber2,adress: req.body.adress,username: req.body.username,password: req.body.password,role:0};
        let sql = "INSERT INTO user SET ?";
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;
          res.render('pages/login',{
            session_username:req.session.custermerUsername,  
            loginSuccess:null,
            role:null,
            loginError:'',
            rejister_OK:'ok',
            rejistation_error:null,      
        });
        });
    }

    else{
        res.render('pages/signUp',{
            rejistation_error:'ok',      
        });
    }
});



// index -  custermer  

app.get('/', function(req,res){
    con.query("SELECT * FROM products ORDER BY RAND() LIMIT 3",(err,result)=>{
   res.render('pages/index',{
    result:result,
    session_username: req.session.custermerUsername,  
    loginSuccess:null,
});
        })   
   });



//  brand -customer

app.get('/brand', function(req,res){
    con.query("SELECT * FROM products LIMIT 250",(err,result)=>{  
     res.render('pages/brand',{
        result:result,
        session_username: req.session.custermerUsername,
    });
    })      
 });

// filter category -customer

app.post('/brand-catogory', function(req,res){
    con.query("SELECT * FROM products WHERE category ='"+req.body.catogory+"'",(err,result)=>{  
     res.render('pages/brand-category',{
        result:result,
        filter_name:req.body.catogory,
        session_username: req.session.custermerUsername,
    });
     })      
 });

 // filter gender - customer

app.post('/brand-gender', function(req,res){
    con.query("SELECT * FROM products WHERE gender ='"+req.body.gender+"'",(err,result)=>{  
     res.render('pages/brand-category',{
        result:result,
        filter_name:req.body.gender,
        session_username: req.session.custermerUsername,
    });
     })      
 });


 // filter price -customer

 app.post('/brand-price', function(req,res){
    con.query("SELECT * FROM products WHERE new_price >='"+req.body.min+"' AND new_price <='"+req.body.max+"'",(err,result)=>{  
     res.render('pages/brand-category',{
        result:result,
        filter_name:'price category',
        session_username: req.session.custermerUsername,
    });
     })      
 });

 // filter color -customer

 app.post('/brand-color', function(req,res){
    con.query("SELECT * FROM products WHERE main_color ='"+req.body.mainColor+"'",(err,result)=>{  
     res.render('pages/brand-category',{
        result:result,
        filter_name:req.body.mainColor,
        session_username: req.session.custermerUsername,
    });
     })      
 });

 // custormiztion sort -customer

 app.post('/sort-button', function(req,res){
    if(req.session.custermerUsername){
        req.session.beltColor=req.body.belt;
        req.session.ringColor=req.body.ring;
        con.query("SELECT * FROM products WHERE color_customization='Yes'",(err,result)=>{  
         res.render('pages/custermize-item-list',{
            result:result,
            filter_name:'Custermization available watches',
            session_username:req.session.custermerUsername,
            belt_color:req.session.beltColor,
            ring_color:req.session.ringColor,
        });
         })  
    }
    else{
        res.redirect('/custermerLogin');
    }
       
 });
 
 // serch bar - customer

 app.post('/brand-serch', function(req,res){
    con.query("SELECT * FROM products WHERE shortName LIKE '%"+req.body.serch+"%'",(err,result)=>{  
     res.render('pages/brand-category',{
        result:result,
        filter_name:'See Products',
        session_username: req.session.custermerUsername,
    });
     })      
 });

 

 //custeermize -customer

 app.get('/custermize', (req, res) => {
    res.render('pages/sorting',{
        session_username: req.session.custermerUsername,      
    });
   });  










//itm details - get - customer

app.get('/item/:userId', function(req,res){
    const userId = req.params.userId;
    con.query(`SELECT * FROM products where id= ${userId}`,(err,result)=>{
   res.render('pages/itemDetails',{
    result:result,
    session_username: req.session.custermerUsername,

});
        })   
   });


//itm details custermization - customer

app.get('/item-custermization/:userId', function(req,res){
    const userId = req.params.userId;
    con.query(`SELECT * FROM products where id= ${userId}`,(err,result)=>{
   res.render('pages/itemDetails-custermization',{
    result:result,
    session_username: req.session.custermerUsername,
    belt_color:req.session.beltColor,
    ring_color:req.session.ringColor,

});
        })   
   });

// custermer details  -------------------------------------------------

// custermer details loading -customer

app.get('/customerDetails',(req, res) => {
    const userId = req.params.userId;
    let sql = "Select * from user where username='"+req.session.custermerUsername+"'";
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('pages/customerDetails', {
            // title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0],
            session_username: req.session.custermerUsername,
            rejistation_error:null, 
        });
    });
});

// // custermer details update
// app.post('/custermerSignInUpdate',(req, res) => {
//     const userId = req.body.id;
//     let sql = "update users SET firstName='"+req.body.firstName+"',  lastName='"+req.body.lastName+"',email='"+req.body.email+"',contactNumber1='"+req.body.contactNumber1+"',contactNumber2='"+req.body.contactNumber2+"',adressNo='"+req.body.adressNo+"',adrtessStreet='"+req.body.adrtessStreet+"',adressCity='"+req.body.adressCity+"',username='"+req.body.username+"',password='"+req.body.password+"' where id ="+userId;
//     let query = con.query(sql,(err, results) => {
//       if(err) throw err;
//       res.redirect('/custermerEdits/1');
//     });
// });


// user edit -customer

app.post('/userEdit',(req, res) => { 
    if(req.body.password==req.body.retypePassword){
        let data = {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email,contactNumber1: req.body.contactNumber1,contactNumber2: req.body.contactNumber2,adress:req.body.adress,username: req.body.username,password: req.body.password,role:0};
        let sql = "update  user SET ? where username ='"+req.body.username+"'";
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;
          res.redirect('/customerDetails');
        });
    }
    else{
        res.render('pages/signUp',{
            rejistation_error:'ok',      
        });
    }
   
});

//order -customer

app.get('/order',function(req,res){
    //    if(req.session.cart==null){//MY 
    // alert("Your cart is empty.Please add items to the cart before the access.");
    
    if(req.session.custermerUsername==null){
        res.redirect('/custermerLogin');
        }	
        else{
        con.query("SELECT *,DATE_FORMAT(date ,'%d %m %Y') as day FROM cart WHERE username ='"+req.session.custermerUsername+"' AND (status='pending' OR status='process'OR status='completed'OR status = 'canceled') order by orderId desc",(err,result)=>{  
            console.log(result[0]);
                res.render('pages/order',{                    
                    result:result,
                    session_username: req.session.custermerUsername,  
                });
                })       
        } 
    });


//review - customer

app.post('/review',function(req,res){
    //funtion eke variable eka = ejs eken ganna variable eka
    var id   =  req.body.id;   
    var new_review = req.body.review;
    var new_re= parseInt(new_review);
                console.log(new_review);
                console.log(id);
                con.query('SELECT review FROM products WHERE id =?', [id], function(error, results, fields) {
                    if (error) throw error;
                    if (results.length > 0) {
                         console.log('review sucsess');
                         var x =results[0].review;
                         console.log(x);
                         var a=(x+1);
                         var b=(new_re +1);
                         console.log(a);
                         console.log(b);
                         var y =((x + new_re)/2);
                         console.log(y);
                         con.query("update products SET review='"+y+"' where id ='"+id+"'",(err,result)=>{  
                            // res.render('pages/sorting',{result:result});
                              res.redirect('/order');
                            })
                    } 
                    else{
                        res.send("faild");
                    }       
                });           
    });

//chekout - customer -------------------------------------------------

//chekout loading - customer

app.get('/checkout',(req, res) => {
    if(req.session.custermerUsername==null){
        res.redirect('/custermerLogin');
    }
    else
    {
    const userId = req.params.userId;
    // let sql = "Select * from user where username='"+req.session.username+"'";
    let sql = "SELECT (sum(cart.id)/count(cart.id)) as orderid ,sum(cart.price*cart.quantity) as total ,sum(cart.customizationCharges*cart.quantity) as totalcus,sum(cart.quantity) as quantity ,count(cart.id) as product ,user.firstName as firstName,user.lastName as lastName,user.email as email,user.adress as adress,user.contactNumber1 as no1 ,user.contactNumber2 as no2,user.username as username from cart,user where cart.username=user.username AND  user.username= '"+req.session.custermerUsername+"' AND cart.status='cart'";
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('pages/checkout', {
            user : result[0],
            session_username: req.session.custermerUsername,
        });
    });
}
});



// save/pending order - customer

app.post('/pending_order',(req, res) => {
    const userId = req.session.custermerUsername;
    var orderid= parseInt(req.body.orderid);
    console.log(req.body.orderid);
    console.log(orderid);
    let sql = "update cart SET status='pending', date =CURRENT_TIMESTAMP,orderid='"+orderid+"' where username ='"+req.session.custermerUsername+"'AND status='cart'";
    let query = con.query(sql,(err, results) => {
      if(err) throw err;
      con.query("SELECT * FROM cart WHERE username ='"+req.session.custermerUsername+"' AND status='cart'",(err,result)=>{  
        console.log(result[0]);
            res.render('pages/cart',{
                
                result:result,
                session_username: req.session.custermerUsername,  
                sucsess:'ok',
            });
            })  
    });
});



//cart - custermer ----------------------------------------------------

//add to cart custermization button - customer
app.post('/add_to_cart-cus',function(req,res){
    //funtion eke variable eka = ejs eken ganna variable eka
    var id   =  req.body.id;
    var namex = req.body.shortName;
    var price = req.body.new_price;
    var quantity = req.body.quantity;
    var image = req.body.image;
    var sale_price=req.body.sale_price;
    var username=  req.session.custermerUsername;
    var status =req.body.status;
    var custermize =req.body.custermize;
    var ring_color =req.body.ring_color;
    var belt_color =req.body.belt_color;
    var product = {productID:id,name:namex,price:price,quantity:quantity,image:image,username:username,status:status,custermize:custermize,ring_color:ring_color,belt_color:belt_color,customizationCharges:'1000'};//product object
    
    if(username==null){
        res.redirect('/custermerLogin');
        }	
            else{
                console.log(namex);
                console.log(id);
                        let sql = "INSERT INTO cart SET ?";
                        let query = con.query(sql, product,(err, results) => {
                          if(err) throw err;
                          res.redirect('/cart');
    
                        });
                    }
                });
      
    
//add to cart button - customer

app.post('/add_to_cart',function(req,res){
//funtion eke variable eka = ejs eken ganna variable eka
var id   =  req.body.id;
var namex = req.body.shortName;
var price = req.body.new_price;
var quantity = req.body.quantity;
var image = req.body.image;
var sale_price=req.body.sale_price;
var username=  req.session.custermerUsername;
var status =req.body.status;
var custermize =req.body.custermize;
var ring_color =req.body.ring_color;
var belt_color =req.body.belt_color;
var product = {productID:id,name:namex,price:price,quantity:quantity,image:image,username:username,status:status,custermize:custermize,ring_color:ring_color,belt_color:belt_color};//product object

if(username==null){
    res.redirect('/custermerLogin');
    }	
        else{
            console.log(namex);
            console.log(id);
            con.query('SELECT * FROM cart WHERE username = ?  AND productID = ? AND status="cart"', [username,id], function(error, results, fields) {

                if (error) throw error;
                if (results.length > 0) {
                    // res.send('cart succsess');
                    console.log('cart sucsess');
                     var x =results[0].quantity;
                     console.log(x);
                     var y =x+1;
                     console.log(y);
                     con.query("update cart SET quantity='"+y+"' where productID ='"+id+"' AND username ='"+username+"' AND status='cart'",(err,result)=>{  
                        // res.render('pages/sorting',{result:result});
                          res.redirect('/cart');
                        })
                }        
                 else  {
                    let sql = "INSERT INTO cart SET ?";
                    let query = con.query(sql, product,(err, results) => {
                      if(err) throw err;
                      res.redirect('/cart');

                    });
                }
            });
        }
});

//cart loading - get - customer

app.get('/cart',function(req,res){
//    if(req.session.cart==null){//MY 
// alert("Your cart is empty.Please add items to the cart before the access.");

if(req.session.custermerUsername==null){
    res.redirect('/custermerLogin');
    }	
    else{
    con.query("SELECT * FROM cart WHERE username ='"+req.session.custermerUsername+"' AND status='cart'",(err,result)=>{  
        console.log(result[0]);
            res.render('pages/cart',{
                
                result:result,
                session_username: req.session.custermerUsername,  
                sucsess:null,
            });
            })       
    } 
});


// remove cart product - customer
    
app.post('/remove_product',(req, res) => {
    const id = req.body.id;
    let sql = `DELETE from cart where id = ${id} AND status="cart"`;
    let query = con.query(sql,(err, result) => {
            if(err) throw err;
            res.redirect('/cart');
        });
    });


//edit product quantity increase/ decrease - customer

app.post('/edit_product_quantity',function(req,res){
    //get values form input
    var productID=req.body.productID;
    var quantity = req.body.quantity;
    var increase_btn = req.body.increase_product_quantity;
    var decrease_btn = req.body.decrease_product_quantity;
    var username = req.session.custermerUsername;
    var cart =req.session.cart;

    if(increase_btn){
       
       var x= parseInt(quantity);

        console.log(x);
        console.log('increase');
        console.log(productID);
        console.log(quantity);
        y =x+1;
        console.log(y);
            con.query("update cart SET quantity='"+y+"' where productID ='"+productID+"' AND username ='"+username+"'AND status='cart'",(err,result)=>{  
                res.redirect('/cart');
                })  
    };

    if(decrease_btn){
        var x= parseInt(quantity);

        console.log(x);
        console.log('increase');
        console.log(productID);
        console.log(quantity);
        y =x-1;
        console.log(y);
            con.query("update cart SET quantity='"+y+"' where productID ='"+productID+"' AND username ='"+username+"' AND status='cart'",(err,result)=>{  
                res.redirect('/cart');
                }) 
        }
    
    // calculateTotal(cart,req);
    // res.redirect('/cart')
})























//----------------------------------------------------------

// admin - home

app.get('/home', (req, res) => {
    if(req.session.adminRole==null){
        res.redirect('/adminlogin');
      }
      else{
        con.query("select *, DATE_FORMAT(NOW() ,'%d %m %Y') as today ,DATE_FORMAT(date ,'%w') as day,CURRENT_TIME() as time FROM cart where yearweek(`date`) = yearweek(curdate())",(err,result)=>{  
            res.render('dashboard/home',{
                result:result,
               session_username: req.session.custermerUsername,  
               loginSuccess:null,
               role:req.session.adminRole,
           });
           }) 
      }
   });

//product - dashboard ----------------------------------------------------------

// add product - get - dashboard

app.get('/addProduct', function(req,res){
    if(req.session.adminUsername==null){
        res.redirect('/adminLogout');
    }
    else{
    con.query("SELECT * FROM catogory",(err,result)=>{  
   res.render('dashboard/addProduct',{
    result:result,
    session_username: req.session.adminUsername, 
    role:req.session.adminRole,
    sucsess:null,
});
        })  
    }    
   });

   app.use(express.static('public'));
   app.use(
    fileUpload({
        limits: {
            fileSize: 10000000,
        },
        abortOnLimit: true,
    })
);

//add product (save) - dashboard

app.post('/SaveProduct',(req, res) => { 

    const { image } = req.files;
    // If no image submitted, exit
    if (!image) return res.sendStatus(400);
    image.mv(__dirname + '/public/upload/' + image.name);

    // All good
    // res.sendStatus(200);

    var discount = req.body.discount;
    var new_price = req.body.price - discount ;
    var imagex=req.files.image.name;
    console.log(new_price);
    console.log(imagex);
    try{
        let data = {modelNo:req.body.modelNo,brandName:req.body.brandName,shortName:req.body.shortName,old_price:req.body.price,new_price:new_price,description:req.body.description,quantity:req.body.quantity,category:req.body.category,image:imagex,gender:req.body.gender,color_customization:req.body.customization,main_color:req.body.mainColor,review:'1'};
    // let data = {modelNo: req.body.modelNo};
    let sql = "INSERT INTO products SET ?";
    let query = con.query(sql, data,(err, results) => {
      if(err) throw err;
      con.query("SELECT * FROM catogory",(err,result)=>{  
        res.render('dashboard/addProduct',{
         result:result,
         session_username: req.session.adminUsername, 
         role:req.session.adminRole,
         sucsess:'ok',
     });
    });
})
    }
catch{
    res.render('dashboard/home'); 
}
});



// view product - dashboard

app.get('/view', function(req,res){
    if(req.session.adminRole==null){
        res.redirect('/adminlogin');
    }
    else{
        con.query("SELECT * FROM products",(err,result)=>{  
            res.render('dashboard/view',{
               result:result,
               // message1: req.session.username,  
               sucsess:null,
               role:req.session.adminRole,
           });
           }) 
    }
     
 });

//update product - get - dashboard

app.get('/editProduct/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT * from products where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('dashboard/editProduct', {
            user : result[0],
            role:req.session.adminRole,
        });
    });
});

// update product - post - dashboard

app.post('/updateProduct',(req, res) => {

    var discount = req.body.discount;
    var new_price = req.body.price - discount ;
    const id = req.body.id;
    console.log(id);
    console.log( req.body.quantity);
    console.log(discount);
    console.log(new_price);
  
    let sql = "update products SET old_price='"+req.body.price+"', new_price='"+new_price+"',  quantity='"+req.body.quantity+"' where id ='"+id+"'";
    let query = con.query(sql,(err, results) => {
      if(err) throw err;
      con.query("SELECT * FROM products",(err,result)=>{  
        res.render('dashboard/view',{
         result:result,
         session_username: req.session.adminUsername, 
         role:req.session.adminRole,
         sucsess:'ok',
     });
      
    });
});
});



//order - dashboard ----------------------------------------------------------

//order status - change as process
app.get('/order-Process/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `update cart SET status='process'where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/orders');
    });
});

//order status - change as complted
app.get('/order-Completed/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `update cart SET status='completed'where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/orders');
    });
});


//order status - change as complted
app.get('/order-Cancle/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `update cart SET status='canceled'where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/orders');
    });
});

app.get('/see-More/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = "Select * from user where username='"+userId+"'";
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('dashboard/userDetails', {
            user : result[0],
            role:req.session.adminRole,
        });
    });
});
// dahboard  - orders
app.get('/orders', function(req,res){
    con.query("SELECT  *, DATE_FORMAT(date ,'%d %m %Y') as date FROM cart where status='pending' OR status='process'",(err,result)=>{  
     res.render('dashboard/orders',{
        result:result,
        message1: req.session.username,  
        message2: 'ssss',
        role:req.session.adminRole,
    });
    }) 
 });

// dahboard  - orders
app.get('/completed', function(req,res){
    con.query("SELECT  *, DATE_FORMAT(date ,'%d %m %Y') as date FROM cart where status='completed' OR status='canceled' order by id desc",(err,result)=>{  
     res.render('dashboard/completed',{
        result:result,
        message1: req.session.username,  
        message2: 'ssss',
        role:req.session.adminRole,
    });
    }) 
 });




// admin - dahboard ----------------------------------------------------------

// admin profile - dashboard
app.get('/profile',(req, res) => {
    let sql = "SELECT * FROM user where role =1";
    let query = con.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('dashboard/profile', {
            users : rows,
            role:req.session.adminRole,
        });
    });
});

//admin edit - dashboard
app.get('/adminEdit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT * from user where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('dashboard/userEdit', {
            user : result[0]
        });
    });
});

//admin update -dashboard
app.post('/adminUpdate',(req, res) => {
    const userId = req.body.id;
    let sql = "update user SET username='"+req.body.username+"',  email='"+req.body.email+"',  password='"+req.body.password+"' where id ="+userId;
    let query = con.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/profile');
    });
});

//admin delete -dashboard
app.get('/adminDelete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from user where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/profile');
    });
});

//admin add -dashboard
app.get('/adminAdd',(req, res) => {
    res.render('dashboard/addAdmin', {
        role:req.session.adminRole,
    });
});
 
//admin save -dashboard
app.post('/adminSave',(req, res) => { 
    let data = {username: req.body.username, email: req.body.email, password: req.body.password , role:'1'};
    let sql = "INSERT INTO user SET ?";
    let query = con.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/profile');
    });
});


//admin transaction ................................................................

app.get('/transaction', function(req,res){
    con.query("SELECT  *, DATE_FORMAT(date ,'%d %m %Y') as date FROM cart where status='completed' order by date desc",(err,result)=>{  
     res.render('dashboard/transaction',{
        result:result,
        message1: req.session.username,  
        message2: 'ssss',
        role:req.session.adminRole,
    });
    }) 
 });




   
 

// dashboard - catogory page load
app.get('/addCatogory',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    if(req.session.adminRole==null){
        res.redirect('/adminLogout');
        
    }
    else{
        let sql = "SELECT * FROM catogory";
        let query = con.query(sql, (err, rows) => {
            if(err) throw err;
            res.render('dashboard/addCatogory', {
                users : rows,
                role:req.session.adminRole,
            });
        });
    }
    
});

//save category
app.post('/saveCatogory',(req, res) => { 
    let data = {catogory : req.body.catogory,description:req.body.description };
    let sql = "INSERT INTO catogory SET ?";
    let query = con.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/addCatogory');
    });
});



// admin - analyzing
app.get('/analyzing', (req, res) => {
    if(req.session.adminRole==null){
        res.redirect('/adminlogin');
      }
      else{
        con.query("SELECT SUM(quantity*price) AS sales ,MONTH(date) as month FROM cart WHERE YEAR(date)=YEAR(curdate()) GROUP by MONTH(date);",(err,result)=>{  
            res.render('dashboard/analyzing',{
                result:result,
               session_username: req.session.custermerUsername,  
               loginSuccess:null,
               role:req.session.adminRole,
           });
           }) 
      }
   });






























//extra codes ----------------------------------------------------------------------------------------------------
//* 11.  sample crud */


app.get('/a',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM users";
    let query = con.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : rows
        });
    });
});
 
app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});
 
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    let query = con.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/a');
    });
});
 
app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});
 
 
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = con.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/a');
    });
});
 
 
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = con.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/a');
    });
});









// //delete category -**doesnt want

// app.get('/deleteCatogory/:userId',(req, res) => {
//     const userId = req.params.userId;
//     let sql = `DELETE from catogory where id = ${userId}`;
//     let query = con.query(sql,(err, result) => {
//         if(err) throw err;
//         res.redirect('/addCatogory');
//     });
// });



// try {
//     doAthing();
// } catch(e) {
//     console.log(e);
//     // [Error: Uh oh!]
// }

//* 1.  dashboard - home page */

// app.get('/home', function(request, response) {
// 	// If the user is loggedin
// 	if (request.session.loggedinAdmin) {
// 		// Output username
// 		// var cart =1;
// 		response.render('dashboard/home');
// 		// res.render('dashboard/home',{cart:cart,total:request.session.username});
// 		// res.send('Welcome back, ' + request.session.username + '!');      
// 	}
// 	else if(request.session.loggedinSuperAdmin){
//         request.session.valid = true;       
// 		response.render('dashboard/home');
// 	}	
// 	else {
// 		// Not logged in
// 		// res.send('Please login to view this page!');
//         response.render('dashboard/loginError');
// 	}
// 	response.end();
// });



//* $.  customer - profile*/

//    app.get('/custermerEdits/1',(req, res) => {
//     const userId = req.params.userId;
//     let sql = `Select * from user where userID= 1`;
//     let query = con.query(sql,(err, result) => {
//         if(err) throw err;
//         res.render('pages/customerDetails', {
//             // title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
//             user : result[0]
//         });
//     });
// });




// response.send('Incorrect Username and or Password!');
// console.log(results[0]); row result



// SELECT sum(cart.price*cart.quantity),user.firstName,user.lastName,user.email,user.adress,user.contactNumber1,user.contactNumber2,user.username from cart,user where cart.username=user.username;

// app.get('/checkout', (req, res) => {

//     res.render('pages/checkout',{
//         session_username: req.session.custermerUsername,  
//     });
//    });

//* $. custormer - itm details
// app.get('/checkout', function(req,res){
//     const userId = req.session.custermerUsername;
//     con.query(`SELECT sum(cart.price*cart.quantity) as total,user.firstName,user.lastName,user.email,user.adress,user.contactNumber1,user.contactNumber2,user.username from cart,user where cart.username=user.username AND  user.username= ${userId}`,(err,result)=>{ 
//         res.render('pages/checkout',{
//             user : result[0],
//     session_username: req.session.custermerUsername,

// });

	// response.send('Please enter Username and Password!');
		// response.end();


        // // console.log(result[0].total);
//         })   
//    });




// customer - cart
// function isProductInCart(cart,id){
//     for(let i=0; i<cart.length;i++){
//         if(cart[i].id==id)
//         return true; 
//     }
//     return false;
//     }
    
//     function calculateTotal(cart,req){
//         total = 0;
//         for(let i=0;i<cart.length; i++){
//             if(cart[i].sale_price){
//                 total = total + (cart[i].sale_price*cart[i].quantity);
//             }
//             else{
//                 total = total + (cart[i].price*cart[i].quantity);
//             }
//         }
//         req.session.total = total;
//         return total;
//     }



// // about -customer

// app.get('/about', function(req,res){
//     con.query("SELECT * FROM products ORDER BY RAND() LIMIT 3",(err,result)=>{
//    res.render('pages/about',{
//     result:result,
//     session_username: req.session.custermerUsername,  
// });
//       })   
// });

// // about
//  app.get('/about', (req, res) => {
//     // alert("message");
//     res.render('pages/about');
//    });

// // brand
// app.get('/brand', (req, res) => {
//     res.render('pages/brand');
//    });  


// // customer - sorting

// app.post('/live_watch_sorting', function(req,res){
//     con.query("SELECT * FROM products WHERE Belt1Color='"+req.body.B+"'",(err,result)=>{  
//      res.render('pages/sorting',{result:result});
//      })      
//  });


// // customer - chekout

// app.get('/custermize', function(req,res){
//     con.query("SELECT * FROM products LIMIT 9",(err,result)=>{  
//      res.render('pages/sorting',{
//         result:result,
//         session_username: req.session.custermerUsername,
//     });
//        // res.send("Hello");
//       })      
//  });


// // dashboard - analyzing page
// app.get('/analyzing', (req, res) => {
//     res.render('dashboard/analyzing', {
//         title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
//         role:req.session.adminRole,
//     });
//    }); 



// //delete product - dosent want
// app.get('/deleteProduct/:userId',(req, res) => {
//     const userId = req.params.userId;
//     let sql = `DELETE from products where id = ${userId}`;
//     let query = con.query(sql,(err, result) => {
//         if(err) throw err;
//         res.redirect('/view');
//     });
// });

 //admin transaction
 
// app.get('/transaction',(req, res) => {
//     let sql = "SELECT * FROM transaction";
//     let query = con.query(sql, (err, rows) => {
//         if(err) throw err;
//         res.render('dashboard/transaction', {
//             title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
//             users : rows,
//             role:req.session.adminRole,
//         });
//     });
// });
