<?php
namespace AppBundle\Service;
use Firebase\JWT\JWT;

class JwtAuth{

    public $manager;
    public $key;
    
    public function __construct($manager){
        $this->manager = $manager;
        $this->key = 'clave@_secreta1234';
    }

    /**
     * $email : Email
     * $pass : Contraseña
     * $getHash: Indica si se quiere o no los datos decodificados; si no, solo se pide el token (conjunto de datos pasados por el JWT::encode)
     */
    public function signup($email, $pass, $getHash = null){
        $data = false;
        $user = $this->manager
                    ->getRepository('BackendBundle:User')
                    ->findOneBy(array("email" => $email, "password"=> $pass));

        if(is_object($user)){

            //Creamos un objeto valido para generar el token jwt
            $token = array( 
                        "sub" => $user->getId(),
                        "email" => $user->getEmail(),
                        "name" => $user->getName(),
                        "surname" => $user->getSurname(),
                        "iat" => time(),
                        "exp" => time() + (7*24*60*60)
                    );  //expira en 7 días. "sub" es como un indice.
            $data = JWT::encode($token, $this->key, 'HS256');//la genera en base a la "clave privada"

            if($getHash){                
                $data = json_decode(json_encode(JWT::decode($data, $this->key, array('HS256'))),true);
            }
        }

        return $data;
    }

    /**
     * Si getIdentity es true, devolverá el token decodificado, para poder comprobar los datos.
     * Si no solo devolverá si es válido o no.
     */
    public function checkToken($jwt, $getIdentity = false){
        $auth = false;
        try{
            $decoded = JWT::decode($jwt, $this->key, array('HS256'));
            $auth = true;
        }catch(\UnexpectedValueException $error ){
            $auth = false;
        }catch(\DomainException $error ){
            $auth = false;
        }catch(\InvalidArgumentException $error ){
            $auth = false;
        }

        if($auth && is_object($decoded) && isset($decoded->sub)){
            return $getIdentity ? $decoded : true;
        }else{
            return false;
        }        

    }


}