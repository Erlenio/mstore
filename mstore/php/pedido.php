<?php



if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db = new PDO('mysql:host=localhost;dbname=estore', 'root', '');

    $pedidos = $db->query("select id from pedido")->fetchAll();

    if(isset($_SESSION['loged'])){
        if($_SESSION['loged']){
            $uid = $_SESSION['uid'];

            if(isset($_POST['request_type'])){
                echo $_POST['request_type'];

                if($_POST['request_type'] == 'read'){
                    getPedidos($db, $uid);
                }

            }else{
                echo 'request ype not found';
            }

        }else{

        }
    }

    
    
}

function getPedidos($db, $uid){

    $pedidos = $db -> query("SELECT * FROM PEDIDO WHERE uid = '$uid'") -> fetchAll();

    $json = json_encode($pedidos);

    echo $json;   
}

function guardarPedido($db, $pedidos){
    if ($pedidos || count($pedidos) == 0) {
        $uid = $_POST['uid'];
        $preco = $_POST['preco'];
        $estado = $_POST['estado'];
        $produtos = $_POST['produtos'];
        $cartIds = $_POST['cartIds'];
        $json = json_encode($produtos);

        $id = gerarNumero($pedidos);

        $insert_Query = $db->query("INSERT INTO pedido (id, uid, preco, estado, produtos) VALUES('$id', '$uid', '$preco', '$estado', '$json')");

        if ($insert_Query) {

            foreach ($cartIds as $value) {

                // Prepare the query
                $query = $db->prepare("DELETE FROM CART WHERE id = :cartId");

                // Bind the parameter
                $query->bindParam(":cartId", $value);

                // Execute the query
                $query->execute();
            }

            echo "sucesso";
        }
    } else {
        echo 'error';
    }
}

function gerarNumero($lista)
{
    $numero = "14" . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);

    for ($i = 0; $i < sizeof($lista); $i++) {
        if ($lista[$i]["id"] == $numero) {
            return gerarNumero($lista);
        }
    }

    return $numero;
}

?>