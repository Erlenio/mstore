<?php

    $pid = $_POST['pid'];
    $uid = $_POST['uid'];
    $quantidade = $_POST['quantidade'];

    $connection = new PDO("mysql:host=localhost;dbname=estore", "root", "");
    //ciid => cart item id
    $cid_list = $connection -> query("SELECT * from cart WHERE uid = '$uid'") -> fetchAll();

    $exist = false;

    for($i = 0; $i < count($cid_list); $i++){

        if($cid_list[$i]['pid'] == $pid){
            $exist = true;
            break;
        }

    }

    if($exist){
        echo 'Este item ja existe no seu carrinho';
    }else{
        if($cid_list || count($cid_list) == 0){

            $id =  gerarNumero($cid_list);
            $date = date("Y-m-d H:i:s");
    
            $insert_query = $connection -> query("INSERT INTO cart(id, uid, data_adicao, pid, quantidade) VALUES('$id', $uid, '$date', '$pid', '$quantidade')");
    
            if($insert_query){
                echo "Sucesso";
            }else{
                echo "fracso";
            }
    
        }else{
            echo "Base de dados nao encotrada";
        }
    }

    

function gerarNumero($lista)
{
    $numero = "13" . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);

    for ($i = 0; $i < sizeof($lista); $i++) {
        if ($lista[$i]["id"] == $numero) {
            return gerarNumero($lista);
        }
    }

    return $numero;
}

?>