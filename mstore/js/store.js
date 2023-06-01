let user;
let cartItems;
let products;

$(document).ready(() => {

  $('select').change(()=>{filter()})


  $('#store').css("marginTop", $('header').height() + 'px');
  $('.bx-menu').click(() => {$('.menu').toggleClass('open')});

  $(".bx-cart").click(() => {
    $(".cart").toggleClass("open");
  });

  $(".bx-left-arrow-alt").click(() => {
    $(".cart").toggleClass("open");
  });

  $(".bx-user").click(() => {
    $(".user-details").toggleClass("active");
  });

  $('.request-payment').click(() =>{
    buildRecipie();
  });

  $(".logout").click(() => {
    $.ajax({
      type: "POST",
      url: "./php/authication.php",
      data: { request_type: "logout" },
      success: (response) => {
        if (response == "sucesso") {
          window.location.reload();
        } else {
          alert("Erro ao desautenticar, tente novamente");
          console.log(response);
        }
      },
    });
  });

  //Fetch User
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
      } else {
        user = undefined;
        $('.dashboard-link').hide();

      }
      fetchProducts();
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
      } else {
        $(".cart").addClass("empty");
      }
    },
  });
}

function addItemsToCart() {
  $(".cart-body").html("");

  let total = 0;

  $.each(cartItems, (key, value) => {
    let product = getProduct(value["pid"]);

    if (product == undefined || product == null) {
      console.log(product);
      return;
    }

    var cartItem = $("<div>").attr("class", "cart-item");

    cartItem.attr('id', value["id"]);

    let close = $('<i>').attr('class', 'bx bx-x');

    close.click(() =>{
      
    });

    cartItem.append(close);

    var cartHeader = $("<div>").attr("class", "item-header");
    var image = $("<img>");

    if (product["imagem"] == "default") {
      image.attr("src", "./images/e-store.jpg");
    } else {
      image.attr("src", product["image"]);
    }

    cartHeader.append(image);
    cartItem.append(cartHeader);

    var cartBody = $("<div>").attr("class", "item-body");
    var itemName = $("<div>").attr("class", "item-name");
    var itemPrice = $("<div>").attr("class", "item-price");

    itemName.text(product["nome"]);
    itemPrice.text(product["preco"] + " Mzn");

    cartBody.append(itemName);
    cartBody.append(itemPrice);

    var itemQuantity = $("<div>").attr("class", "item-quantity");
    var quantityValue = $("<input>").attr("class", "qauntity-value");
    var pcs = $("<span>").text("PCS");

    quantityValue.attr("type", "number");
    quantityValue.attr("max", 5);
    quantityValue.attr("min", 1);

    quantityValue.val(value["quantidade"]);

    itemQuantity.append(quantityValue);
    itemQuantity.append(pcs);

    cartBody.append(itemQuantity);

    cartItem.append(cartBody);

    var checkBox = $("<input>").attr("type", "checkbox");
    checkBox.attr('class', 'check');
    checkBox.attr('checked', 'true');
    checkBox.change(() => {updatePrice()});
    quantityValue.change(() => {updatePrice()});
    

    cartItem.append(checkBox);

    total += product["preco"] * value["quantidade"];

    $(".cart-body").append(cartItem);

  });

  $(".total").text(total + " Mzn");
  updatePrice();
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

function buildRecipie(){

  let items = document.querySelectorAll('.cart-item');

  let total = 0;

  let array = [];
  let cartId = [];


  items.forEach(element => {
    if(element.querySelector('.check').checked){

      let unityPrice = parseFloat(element.querySelector('.item-price').innerHTML);

      let quantidade = parseInt(element.querySelector('.qauntity-value').value);



      let tPrice = unityPrice * quantidade;

      let item = {'pid': element.id, 'quantidade': quantidade, 'preco': tPrice};

      array.push(item);

      cartId.push(element.id);
      total+= tPrice;
    }
  });

  let data = {'uid': user['uid'], 'preco': total, estado: 'Aberto', produtos: array, 'cartIds': cartId};

  $.ajax({
    type: 'POST',
    url: './php/pedido.php',
    data: data,
    success: (response) => {
      alert(response);
      fetchProducts();
    }
  });

}

function fetchProducts() {
  $.ajax({
    type: "POST",
    url: "./php/produto.php",
    data: {'request_type': 'read'},
    success: (response) => {
      products = response;
      adicionarProdutos(response);

      if (user == undefined) {
        $(".cart-footer").hide();
        $(".cart").addClass("empty");
      } else {
        $('.unloged').hide();
        getCart();
      }
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

function adicionarProdutos(json) {
  $(".product-wrapper").html("");

  $.each(json, (key, value) => {
    let productBox = $("<div>").attr("class", "product-box");
    let boxHeader = $("<div>").attr("class", "box-header");

    let addCart = $("<i>").attr("id", value["id"]);
    addCart.attr("class", "bx bx-cart-add");
    productBox.append(addCart);

    addCart.click(() => {
      if (user == undefined) {
        alert("Faca o login para poder gruardar itens no carrinho");
        return;
      }
      $.ajax({
        type: "POST",
        url: "./php/adicionar_ao_carrinho.php",
        data: { 'pid': value["id"], 'uid': user["uid"], 'quantidade': 1 },
        success: (request_response) => {
          getCart();
        },
      });
    });

    let imagem = $("<img>").attr("class", "image");
    if (value["imagem"] == "default") {
      imagem.attr("src", "./images/e-store.jpg");
    } else {
      imagem.attr("src", value["imagem"]);
    }

    boxHeader.append(imagem);
    productBox.append(boxHeader);

    let boxBody = $("<div>").attr("class", "box-body");

    let h3 = $("<h3>").attr("class", "name");
    let price = $("<p>").attr("class", "price");
    let descricao = $("<p>").attr("class", "product-description");

    h3.text(value["nome"]);
    price.text(value["preco"] + " Mzn");
    descricao.text(value["descricao"]);

    boxBody.append(h3);
    boxBody.append(price);
    boxBody.append(descricao);

    productBox.append(boxBody);

    $(".product-wrapper").append(productBox);
  });
}

function filter(){
  let fList = [];
  
  let value = $('select').val();
  alert(value);

  products.forEach((element) => {
    if(element['categoria'] == value){
      fList.push(element);
    }
  });

  adicionarProdutos(fList);

}