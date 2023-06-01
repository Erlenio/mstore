<?php

    $request_type = $_POST['request_type'];

    session_start();
    $response;

    if(isset($_SESSION['loged'])){
        if($_SESSION['loged']){

            $uid = $_SESSION['uid'];
    
            $m_db = new PDO('mysql:host=localhost;dbname=estore', 'root', '');
            $cart_table = $m_db -> query("SELECT * FROM CART WHERE uid='$uid'");
    
            if($request_type == 'get'){
                
                if($cart_table){
    
                    $mcart = $cart_table -> fetchAll();
                    
    
                    if(count(($mcart)) > 0){
                        $response = array(
                            "status" => true,
                            "body" => $mcart
                        );
                    }else{
                        $response = array(
                            "status" => false,
                            "body" => "O seu carrinho esta vazio"
                        );
                    }
    
                    
                }else{
                    echo 'Problemas ao conectar a base de dados';
                }
    
            }elseif ($request_type = 'drop') {
                
            }
    
        }else{
            $response = array(
                "status" => false,
                "body" => "Usuario Nao conectado"
            );
        }
    }else{
        $response = array(
            "status" => false,
            "body" => "Usuario Nao conectado"
        );
    }

    // Definir o cabeçalho da resposta como JSON
    header('Content-Type: application/json');
    $json = json_encode($response);

    echo $json;

    

?>