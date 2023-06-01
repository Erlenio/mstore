<?php
$connection = new PDO("mysql:host=localhost;dbname=estore", "root", "");

if (isset($_POST['request_type'])) {
    if ($_POST['request_type'] == 'update') {
        alterarProduto($connection);
    } elseif ($_POST['request_type'] == 'read') {
        readProducts($connection);
    } elseif ($_POST['request_type'] == 'write') {
        guardarProduto($connection);
    } elseif ($_POST['request_type'] == 'drop') {
        //Codigo Aqui
    }
} else {
    echo "";
}




function guardarProduto($connection)
{

    $nome = $_POST['nome'];
    $descricao = $_POST['descricao'];
    $preco = $_POST['preco'];
    $marca = $_POST['marca'];
    $modelo = $_POST['modelo'];
    $volume = $_POST['quantidade'];
    $especificacoes = $_POST['especificacoes'];
    $imagem = 'default';
    $categoria = $_POST['categoria'];

    $products_id = $connection->query("SELECT id from produto")->fetchAll();

    $id =  gerarNumero($products_id);

    if ($products_id || count($products_id) == 0) {

        $insert_query = $connection->query("INSERT INTO produto(id, categoria, descricao, especificacoes, imagem, marca, modelo, nome, preco, quantidade) VALUES('$id', '$categoria', '$descricao', '$especificacoes', 'default', '$marca', '$modelo', '$nome', '$preco', '$volume')");

        if ($insert_query) {
            echo "sucesso";
        } else {
            echo "fracso";
        }
    } else {
        echo "Base de dados nao encotrada";
    }
}

function alterarProduto($connection)
{

    $nome = $_POST['nome'];
    $descricao = $_POST['descricao'];
    $preco = $_POST['preco'];
    $marca = $_POST['marca'];
    $modelo = $_POST['modelo'];
    $quantidade = $_POST['quantidade'];
    $especificacoes = $_POST['especificacoes'];
    $imagem = 'default';
    $id = $_POST['id'];
    $categoria = $_POST['categoria'];

    // Preparar a instrução SQL usando um prepared statement
    $insert_query = $connection->prepare("UPDATE PRODUTO 
        SET categoria = :categoria,
        descricao = :descricao,
        especificacoes = :especificacoes,
        marca = :marca,
        modelo = :modelo,
        nome = :nome,
        preco = :preco,
        quantidade = :quantidade
        WHERE id = :id"
    );

    // Vincular os valores aos parâmetros no prepared statement
    $insert_query -> bindParam(":categoria", $categoria);
    $insert_query -> bindParam(":descricao", $descricao);
    $insert_query -> bindParam(":especificacoes", $especificacoes);
    $insert_query -> bindParam(":marca", $marca);
    $insert_query -> bindParam(":modelo", $modelo);
    $insert_query -> bindParam(":nome", $nome);
    $insert_query -> bindParam(":preco", $preco);
    $insert_query -> bindParam(":quantidade", $quantidade);
    $insert_query -> bindParam(":id", $id);

    // Executar a instrução SQL
    $insert_query->execute();

    if ($insert_query) {
        echo "Sucesso";
    } else {
        echo "fracso";
    }
}

function gerarNumero($lista)
{
    $numero = "12" . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);

    for ($i = 0; $i < sizeof($lista); $i++) {
        if ($lista[$i]["id"] == $numero) {
            return gerarNumero($lista);
        }
    }
    return $numero;
}

function readProducts($connection){
    $connection = new PDO("mysql:host=localhost;dbname=estore", "root", "");
    $statement = $connection->prepare("SELECT * FROM produto");
    $statement->execute();
    $products = $statement->fetchAll(PDO::FETCH_ASSOC);
    $json = json_encode($products);
    
    // Definir o cabeçalho da resposta como JSON
    header('Content-Type: application/json');
    
    echo $json;
}
