let products;

$(document).ready(() => {
  $("form").hide();
  $("section.products").css("marginTop", $("header").height() + "px");

  $(".bx-down-arrow-alt").click(() => {
    if ($(".bx-down-arrow-alt").attr("id") == "top") {
      $(".bx-down-arrow-alt").attr("id", "bottom");
    } else {
      $(".bx-down-arrow-alt").attr("id", "top");
    }
    filter($("select").val());
  });

  $(".edit").click((event) => {
    let button = event.target;
    if (button.textContent == "Editar") {
      button.textContent = "Salvar Alteracoes";
      let form = document.querySelector("form");
      let inputs = form.querySelectorAll("input");
      let textArea = form.querySelectorAll("textarea");

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = false;
      }

      for (let i = 0; i < textArea.length; i++) {
        textArea[i].readOnly = false;
      }
    } else if (button.textContent == "Salvar Alteracoes") {
      guardarAlteracoes();
    }
  });

  $(".close-form").click(() => {
    $("form").hide();
    $(".edit").text("Editar");
    let form = document.querySelector("form");
    let inputs = form.querySelectorAll("input");
    let textArea = form.querySelectorAll("textarea");

    for (let i = 0; i < inputs.length; i++) {
      inputs[i].readOnly = true;
    }

    for (let i = 0; i < textArea.length; i++) {
      textArea[i].readOnly = true;
    }
  });

  $("select").change(() => {
    filter($("select").val());
  });

  getProducts();
});

function getProducts() {
  $.ajax({
    type: "POST",
    url: "./php/produto.php",
    data: { request_type: "read" },
    success: (response) => {
      products = response;
      addProducts(products);
      console.log(response);
    },
  });
}

function addProducts(list) {
  $("tbody").html("");

  list.forEach((element) => {
    let tr = $("<tr>");

    let name = $("<td>").text(element["nome"]);
    let price = $("<td>").text(element["preco"]);
    let imageRow = $("<td>").attr("class", "image");
    let image = $("<img>").attr("class", "image");
    let quantity = $("<td>").text(element["quantidade"]);
    let categoria = $("<td>").text(element["categoria"]);
    let modelo = $("<td>").text(element["modelo"]);
    let marca = $("<td>").text(element["marca"]);

    if (element["imagem"] == "default") {
      image.attr("src", "./images/e-store.jpg");
    } else {
      image.attr("src", element["imagem"]);
    }

    imageRow.append(image);

    tr.append(imageRow);
    tr.append(categoria);
    tr.append(name);
    tr.append(price);
    tr.append(modelo);
    tr.append(marca);
    tr.append(quantity);

    tr.click(() => {
      showProduct(element["id"]);
    });

    $("tbody").append(tr);
  });
}

function filter(name) {
  let mList = products;

  mList.sort(function (a, b) {
    if ($(".bx-down-arrow-alt").attr("id") == "top") {
      return compare(b, a, name);
    } else {
      return compare(a, b, name);
    }
  });
  addProducts(mList);
}

function compare(a, b, key) {
  if (a[key] < b[key]) {
    return -1;
  } else if (a[key] > b[key]) {
    return 1;
  } else {
    return 0;
  }
}

function showProduct(id) {
  $("form").show();

  let product = getProduct(id);

  $("#categoria").val(product["categoria"]);
  $("#nome").val(product["nome"]);
  $("#marca").val(product["marca"]);
  $("#modelo").val(product["modelo"]);
  $("#preco").val(product["preco"]);
  $("#quantidade").val(product["quantidade"]);
  $("#descricao").val(product["descricao"]);
  $("#especificacoes").val(product["especificacoes"]);
  $("#id").val(product["id"]);
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

function guardarAlteracoes() {
  if (
    $("#categoria").val().trim() == "" ||
    $("#nome").val().trim() == "" ||
    $("#marca").val().trim() == "" ||
    $("#modelo").val().trim() == "" ||
    $("#preco").val().trim() == "" ||
    $("#quantidade").val().trim() == "" ||
    $("#descricao").val().trim() == "" ||
    $("#especificacoes").val().trim() == ""
  ) {
    alert("Todos os campos devem ser preenchidos");
  } else {
    var form = document.querySelector("form");
    // Capturar os dados do formulário
    var formData = new FormData(form);
    formData.append("request_type", "update");

    $.ajax({
      type: "POST",
      url: "./php/produto.php",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        alert(response);
      },
      error: () =>{
        //Error function
      }
    });
  }
}
