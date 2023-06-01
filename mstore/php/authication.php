<?php

    $db = new PDO("mysql:host=localhost;dbname=estore", "root", "");

    if($_SERVER["REQUEST_METHOD"] == "POST"){

        
        if(isset($_POST['request_type'])){
            $request_type = $_POST['request_type'];

            if($request_type == 'login'){
                login($db);
            }else if($request_type == 'logout'){
                logout();
            }else if($request_type == 'signup'){
                signUp($db);
            }
        }
    }
    function login($database){

        $email = $_POST["email"];
        $password = $_POST["password"];

        $stmt = $database -> prepare("SELECT * FROM user WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && !empty($user)) {

            if ($user["password"] == $password) {

                svaeUser($user["uid"]);

                echo 'sucesso';
                //header("Location: index.html");
                
            } else {
                echo "Senha Incorreta";
            }

        }else{
            echo "Email nao registado";
        }

    }
    function signUp($database){

    //Obter Usuarios
    $users = $database->query("select * from user")->fetchAll();

        $username = $_POST["username"];
        $email = $_POST["email"];
        $password = $_POST["password"];

        if ($users || count($users) == 0) {

            $uid = gerarNumero($users);

            $exist = false;

            foreach ($users as $user) {
                if ($user["email"] == $email) {
                    $exist = true;
                }
            }

            if ($exist) {

                echo "Este email ja foi registado";
                
            } else {

                $insert = $database->query("INSERT INTO user (uid, email, name, password) VALUES('$uid', '$email', '$username', '$password')");

                if($insert){
                    svaeUser($uid);
                    echo 'sucesso';
                }
            }
        }else{
            echo "ocorreu um erro ao guardar os dados";
        }
    }

    function logout(){
        session_start();
        $_SESSION['loged'] = false;
        $_SESSION['uid'] = null;
        if($_SESSION['loged']){
            echo 'error';
        }else{
            echo 'sucesso';
        }
    }

    function svaeUser($uid){
        session_start();
        $_SESSION["loged"] = true;
        $_SESSION["uid"] = $uid;
    }

    function gerarNumero($lista)
    {
        $numero = "11" . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);

        for ($i = 0; $i < count($lista); $i++) {
            if ($lista[$i]["uid"] == $numero) {
                return gerarNumero($lista);
            }
        }
        return $numero;
    }

?>