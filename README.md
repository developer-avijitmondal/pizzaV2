# pizzaV2

1. create new user 
URL : POST http://localhost:6000/api/v2/users/create

2. get user details with auth token
URL : GET http://localhost:6000/api/v2/auth

3. Login with username / password
URL : POST http://localhost:6000/api/v2/auth

4. create new product
URL POST : http://localhost:6000/api/v2/product

5. get all products
URL GET : http://localhost:6000/api/v2/product

6. create new cart for single user
URL POST : http://localhost:6000/api/v2/cart

7. get user cart details with email
URl GET : http://localhost:6000/api/v2/cart?email=dev@email.com

8. remove user cart with email
URL GET : http://localhost:6000/api/v2/cart/remove?email=dev@email.com

9. create new order with cart items
URL POST : http://localhost:6000/api/v2/orders/create

10. get all orders by the email
URL GET : http://localhost:6000/api/v2/orders?email=developer.avijitmondal@gmail.com&limit=50&sort=0
