
var user;
var cartItems;
var products;

$(document).ready(() => {
    $('.bx-menu').click(() => {$('.menu').toggleClass('open')});
    $('#user-header').css("marginTop", $('header').height() + 'px');


    $.ajax({
        type: "GET",
        url: "./php/user.php",
        data: {},
        success: (response) => {
          if (response["status"]) {
            user = response["body"][0];
            $(".username").text(user["name"]);
            $(".email").text(user["email"]);
            if(user['type'] == 'admin'){
              $('.dashboard-link').show();
            }else{
              $('.dashboard-link').hide();
            }
            fetchProducts();
          } else {
            user = undefined;
            $('.dashboard-link').hide();
            document.location.href='login.html';
          }
          console.log(response);
        },
    });



});


function getCart() {
    $.ajax({
      type: "POST",
      url: "./php/cart.php",
      data: { request_type: "get" },
      success: (response) => {
        if (response["status"]) {
          cartItems = response.body;
          addItemsToCart();
          console.log(cartItems);
        } else {
          $(".cart").addClass("empty");
        }
      },
    });
}

function fetchProducts() {
    $.ajax({
      type: "POST",
      url: "./php/produto.php",
      data: {},
      success: (response) => {
        products = response;
        if (user == undefined) {
          $(".cart-footer").hide();
          $(".cart").addClass("empty");
        } else {
          $('.unloged').hide();
        }
        getCart();
        getPedidos();
      },
    });
  }

function getProduct(id) {
    let produto;
  
    $.each(products, (key, value) => {
      if (value["id"] == id) {
        produto = value;
      }
    });
  
    return produto;
  }

function addItemsToCart() {
    $(".tb-carrinho").html("");
  
    let total = 0;
  
    $.each(cartItems, (key, value) => {
      let product = getProduct(value["pid"]);
  
      if (product == undefined || product == null) {
        console.log(product);
        return;
      }
  
      var cartItem = $("<div>").attr("class", "cart-item");
      cartItem.attr('id', value["id"]);

      var left = $("<div>").attr("class", "left");

      var image = $("<img>");
      if (product["imagem"] == "default") {
        image.attr("src", "./images/e-store.jpg");
      } else {
        image.attr("src", product["image"]);
      }
      left.append(image);

      var center = $("<div>").attr("class", "center");

      var itemName = $("<div>").attr("class", "item-name");
      itemName.text(product["nome"]);
      center.append(itemName);

      var itemQuantity = $("<div>").attr("class", "quantity");

      var itemPrice = $("<span>").attr("class", "item-price");
      itemPrice.text(product["preco"] + " Mzn");

      itemQuantity.append(itemPrice);

      var x = $('<span>').attr('class', 'x');

      itemQuantity.append(x);

      var quantityValue = $("<input>").attr("class", "qauntity-value");
      quantityValue.attr("type", "number");
      quantityValue.attr("max", 5);
      quantityValue.attr("min", 1);
      quantityValue.val(value["quantidade"]);
      itemQuantity.append(quantityValue);

      center.append(itemQuantity);
      left.append(center);

      let action = $('<div>').attr('class', 'action');
      
      let remove = $('<i>').attr('class', 'bx bx-x');
      
      remove.click(() =>{
        
      });

      action.append(remove);

      var checkBox = $("<input>").attr("type", "checkbox");
      checkBox.attr('class', 'check');
      checkBox.attr('checked', 'true');
      checkBox.change(() => {updatePrice()});
      quantityValue.change(() => {updatePrice()});
  
      action.append(checkBox);

      cartItem.append(left);
      cartItem.append(action);
  
      total += product["preco"] * value["quantidade"];
  
      $(".tb-carrinho").append(cartItem);
  
    });
  
    //$(".total").text(total + " Mzn");
    //updatePrice();
  }
  
  function updatePrice(){
    let items = document.querySelectorAll('.cart-item');
  
    let price = 0;
  
    items.forEach(element => {
      if(element.querySelector('.check').checked){
        price += parseFloat(element.querySelector('.item-price').innerHTML) * parseInt(element.querySelector('.qauntity-value').value);
      }
    });
  
    $(".total").text(price + " Mzn");
  
  }

  function getPedidos(){
    $.ajax({
      type: 'POST',
      url: './php/pedido.php',
      data: {'request_type': 'read'},
      success: (response) =>{
        console.log(response);
      }      
    })
  }


