<?php

$server = "localhost";
$user = "root";
$pass = "";
$db = "formulario_boletin";
$conexion = new mysqli($server, $user, $pass, $db);

if($conexion->connect_error){
    die("Conexion Fallida".$conexion->connect_error);
} else {
    echo "";
}

?>