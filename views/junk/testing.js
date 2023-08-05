

//example crud operations end  
//--------------------------------end dashboard side 

// app.get('/view', (req, res) => {
//     // res.render('dashboard/view');
//     // res.send( req.session.username);
//     // res.render('dashboard/view', {
//     //     user:user.firstName,
//     // })
//     con.query("SELECT * FROM products LIMIT 9",(err,result)=>{  
//         res.render('dashboard/view',{result:result},{
//           // res.send("Hello");
//              // loggedin: true,
//         // data: req.session.data,
//         // message: req.session.message
//         message1: req.session.username,  
//         message2: 'ssss',
//          }) 
//     res.render('dashboard/view', {
        
//     });

//    }); 




// //routing for home page visible invisible
// app.get('/cart',function(req,res){
// 	var cart =req.session.cart;
// 	var total = req.session.total;
	
// 	res.render('pages/cart',{cart:cart,total:total});
// 	});


// app.get('/cart', (req, res) => {
  
//     res.render('pages/cart');
//    }); 

// cart end**

//load products and images form database - 2023.01.10
    
        //load products and images form database - 2023.01.10
// app.get('/view', function(req,res){
//     con.query("SELECT * FROM catogory",(err,result)=>{  
//    res.render('dashboard/view',{result:result});
//         })      
//    });
 //load products and images form database - 2023.01.10
//    app.get('/view', function(req,res){
//     con.query("SELECT * FROM products LIMIT 3",(err,result)=>{  
//    res.render('dashboard/view',{  user : result[0]});
//         })      
//    });

//* 1.  login      - custermer*/
//* 2.  login      - admin*/
//* 3.  login      - superadmin*/
//* 4.  customer   - home*/
//* 5.  customer   - shop*/
//* 6.  customer   - sorting*/
//* 7.  customer   - cart*/
//* 8.  customer   - chekout*/
//* 9.  customer   - profile*/
//* 10. customer   - review*/
//* 11. customer   - order summary*/
//* 12. customer   - order status*/
//* 13. customer   - notification bell*/
//* 14.  customer  - rejistation*/
//* 15.  customer  - forgot password*/
//* 1.  dashboard - home page */
//* 2.  dashboard - add product page*/
//* 3.  dashboard - view and update product page */
//* 4.  dahboard  - orders*/
//* 5.  dashboard - admin profile */
//* 6.  dashboard - admin rejistation */
//* 7.  dashboard - admin forgot password*/
//* 8.  dashboard - transaction reports page */
//* 9.  dashboard - analyzing page*/
//* 10.  dashboard - catogory page*/
//* 11.  sample crud */


//--------------------------------end dashboard side 




      
// app.get('/orders', (req, res) => {
//     res.render('dashboard/orders');
//    });  

// const user = {
//     firstName: 'Tim',
//     lastName: 'Cook',
// }

// app.post('/auth', function(request, response) {
	
// 	let username = request.body.username;
// 	let password = request.body.password;
// 	let role     = request.body.role;
	
// 	if (username && password ) {
// 		if(role==1){
// 		con.query('SELECT * FROM user WHERE username = ? AND password = ? AND role = 1', [username, password], function(error, results, fields) {
	
// 			if (error) throw error;
// 			if (results.length > 0) {
// 				// Authenticate the user
// 				request.session.loggedinAdmin = true;
// 				request.session.username = username;
//                 console.log(request.session.username);
// 				// Redirect to home page
// 				// response.redirect('/home');
// 				// response.send('redirect to home page');
// 				response.redirect('/home');
// 				//  var a = results;
// 				// response.send(a);
// 			}
// 			 else  {
// 				response.send('Incorrect Username and or Password!');
// 			}			
// 			response.end();
// 		});	
// 	}
	
// 	else if(role==2){
// 		con.query('SELECT * FROM user WHERE username = ? AND password = ? AND role = 2', [username, password], function(error, results, fields) {
// 			if (error) throw error;
// 			if (results.length > 0) {
// 				request.session.loggedinSuperAdmin = true;
// 				request.session.username = username;
//                 console.log(request.session.username);
// 				response.redirect('/home');   
// 			}		
// 			 else  {                         
// 				response.send('Incorrect Username and/or Password!');
// 			}			
// 			response.end();
// 		});	
// 	}

//     else if(role==0){
// 		con.query('SELECT * FROM user WHERE username = ? AND password = ? AND role = 0', [username, password], function(error, results, fields) {
// 			if (error) throw error;
// 			if (results.length > 0) {
// 				request.session.loggedinSuperAdmin = true;
// 				request.session.username = username;
// 				response.redirect('/home');   
// 			}		
// 			 else  {                         
// 				response.send('Incorrect Username and/or Password!');
// 			}			
// 			response.end();
// 		});	
// 	}
// 	 else {
// 		response.send('Please enter Username and Password!');
// 		response.end();
// 	}
// 	}});


//* 4.  customer - home*/
// app.get('/', function(req,res){
//     con.query("SELECT * FROM products ORDER BY RAND() LIMIT 3",(err,result)=>{
//    res.render('pages/index',{
//     result:result,
//     session_username: req.session.username,  
//     // message2: 'ssss',
// });
      