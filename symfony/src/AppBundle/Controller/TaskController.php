<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use BackendBundle\Entity\User;
use BackendBundle\Entity\Task;
use AppBundle\Service\Helpers;
use AppBundle\Service\JwtAuth;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

class TaskController extends Controller
{

    public function indexAction(Request $request)
    {
       echo "[TaskController] index";
       die();
    }

/**
 * Hará doble funcionalidad, crear y editar, según venga o no el id de una tarea.
 */
    public function newAction(Request $request, $id = null){
        //Recogida de parametro json que deberá contener todos los datos.
        $authorization = $request->get('authorization',null);
        $helpers = $this->get(Helpers::class);
        $auth = false;
        if(is_null($authorization)){
            $data = array('status'=>'error', 'data'=>'Faltan parámetro "authorization"');
        }else{
            $auth = $this->get(JwtAuth::class)->checkToken($authorization,true);
        }
        if($auth){
            //Recogida de parametro json que deberá contener todos los datos.
            $json = $request->get('json',null);
            if(is_null($json)){
                $data = array('status'=>'error', 'code'=>400, 'data'=>'Faltan parámetro "json"');
            }else{
                //recogemos los atributos del parametro 'json'
                $params = json_decode($json);
                $title = (isset($params->title)) ? $params->title : null;
                $description = (isset($params->description)) ? $params->description : null;
                $status = (isset($params->status)) ? $params->status : null;
                $createdAt = new \Datetime("now");
                $email = (isset($params->email)) ? $params->email : null;

                $idTask = (isset($params->email)) ? $params->email : null;

                //verificamos si le pertenece el email  con ese token  
                $validData = $email && ($auth->email == $email);

                if($validData){ 
                    $em = $this->getDoctrine()->getManager();
                    $repoUser = $em->getRepository("BackendBundle:User");
                    $user = $repoUser->findOneBy(array( "email"=>$email )); //check que siga existiendo

                    if($user){ 
                        $validDataTask = true;
                        if($id == null){    //creamos nueva tarea  
                            $task = new Task();   
                            $task->setCreatedAt($createdAt);
                            $task->setUser($user);
                        }else{  // Es una tarea que ya existía
                            $repoUser = $em->getRepository("BackendBundle:Task");
                            $task = $repoUser->findOneBy(array( "id"=>$id )); //recogemos el task a modificar
                            $validDataTask = $task && ($auth->sub == $task->getUser()->getId());// comprobamos que le pertenezca
                            if(!$validDataTask){
                                $data = array('status'=>'error', 'code'=>400, 'data'=>'Esa tarea ya no existe');
                                $validDataTask = false;
                            } 
                        }
                        if($validDataTask){
                            if($title) $task->setTitle($title);   
                            if($description)  $task->setDescription($description);   
                            if($status)  $task->setStatus($status);
                            $task->setUpdatedAt($createdAt);
                            $em->persist($task);
                            $em->flush();
                            $data = array('status'=>'success', 'code'=>200, 'data'=>$task);
                        }
                    }else{
                        $data = array('status'=>'error', 'code'=>400, 'data'=>'Ese usuario ya no existe');
                    } 
                }else{
                    $data = array('status'=>'error', 'code'=>400, 'data'=>'Ese email no pertenece a ese token');
                }            
            }
        }else{
            $data = array('status'=>'error', 'code'=>400, 'data'=>'authorization no válido');
        }

        
        return  $this->get(Helpers::class)->jsonParser($data);
    }

}
