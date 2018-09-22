<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use BackendBundle\Entity\User;
use AppBundle\Service\Helpers;
use AppBundle\Service\JwtAuth;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

class UserController extends Controller
{

    public function indexAction(Request $request)
    {
       echo "[UserController] index";
       die();
    }

    public function newAction(Request $request){
        //Recogida de parametro json que deberá contener todos los datos.
        $json = $request->get('json',null);
        $helpers = $this->get(Helpers::class);
        if(is_null($json)){
            $data = array('status'=>'error', 'code'=>400, 'data'=>'Faltan parámetro "json"');
        }else{
            //recogemos los atributos del parametro 'json'
            $params = json_decode($json);
            $email = (isset($params->email)) ? $params->email : null;
            $password = (isset($params->password)) ? $params->password : null;
            $name = (isset($params->name)) ? $params->name : null;
            $surname = (isset($params->surname)) ? $params->surname : null;
            $createdAt = new \Datetime("now");
            $role = 'user';
            

            //verificamos formato email            
            $validatorEmail = new Assert\Email();
            $validatorEmail->message = "Formato de email no válido";
            $errorsValidations = $this->get("validator")->validate($email, $validatorEmail);

            $validData = (count($errorsValidations) == 0 
                            && $email != null && $password != null  
                            && $name != null && $surname != null );
            if($validData){ 
                //creamos el usuario               
                $user = new User();
                $user->setEmail($email);   
                $user->setPassword($password);   
                $user->setName($name);   
                $user->setSurname($surname);   
                $user->setCreatedAt($createdAt);   
                $user->setRole($role);   

                $em = $this->getDoctrine()->getManager();
                $repoUser = $em->getRepository("BackendBundle:User");
                $existsUser = $repoUser->findBy(array( "email"=>$email ));
                if(count($existsUser) == 0){
                    $em->persist($user);
                    $em->flush();
                    $data = array('status'=>'success', 'code'=>200, 
                            'data'=>'Usuario creado correctamente', 'user'=>$user);
                }else{
                    $data = array('status'=>'error', 'code'=>400, 'data'=>'Ese email ya existe');
                }               
                
            }            
        }
        return  $this->get(Helpers::class)->jsonParser($data);
    }

}
