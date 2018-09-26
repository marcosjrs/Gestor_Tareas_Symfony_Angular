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

    /**
     * Devuelve las tareas de forma paginada, de mas recientes a más antiguas.
     * Parametro opcional: page
     * Ejemplo:  http://localhost/gestor-tareas-symfony-angular/symfony/web/app_dev.php/task/tasks?page=2
     */
    public function listAction(Request $request){
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
            $em = $this->getDoctrine()->getManager();
            $dql = "SELECT t FROM  BackendBundle:Task t WHERE t.user = {$auth->sub} ORDER BY t.id DESC";
            $query = $em->createQuery($dql);

            $page = $request->query->getInt('page',1);//recogemos el parametro del la url llamada "page", por defecto valor  1
            $paginator = $this->get('knp_paginator');//Recogemos la configuración
            $items_por_pagina = 10;
            $paginacion = $paginator->paginate($query,$page,$items_por_pagina);

            $total_items_count = $paginacion->getTotalItemCount();//numero de elementos que salen en esta query, porque en la ultima no tienen por que ser 10
            
            $data = array('status'=>'success', 'code'=>200, 
                        'total_items_count'=>$total_items_count,
                        'current_page'=>$page,
                        'items_per_page'=>$items_por_pagina,
                        'total_pages'=>ceil($total_items_count/$items_por_pagina),
                        'data' => $paginacion );

            
        }else{
            $data = array('status'=>'error', 'code'=>400, 'data'=>'authorization no válido');
        } 

        return  $this->get(Helpers::class)->jsonParser($data);
    }

}
