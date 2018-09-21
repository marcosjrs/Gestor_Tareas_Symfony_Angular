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

class DefaultController extends Controller
{
    /**
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * Recibirá un parametro de tipo json, llamado json.
     * Este parametro debe contener a su vez los atributos email y password. 
     * json:{  "email": "user@email.com",  "password": "12345678" }
     * Si el usuario es correcto, devolverá un token. 
     */
    public function loginAction(Request $request){
        //Recogida de parametro json que deberá contener todos los datos.
        $json = $request->get('json',null);
        $helpers = $this->get(Helpers::class);
        if(is_null($json)){
            $data = array('status'=>'error', 'data'=>'Faltan parámetro "json"');
        }else{
            //recogemos los atributos del parametro 'json'
            $params = json_decode($json);
            $email = (isset($params->email)) ? $params->email : null;
            $password = (isset($params->password)) ? $params->password : null;

            //verificamos formato email            
            $validatorEmail = new Assert\Email();
            $validatorEmail->message = "Formato de email no válido";
            $errorsValidations = $this->get("validator")->validate($email, $validatorEmail);

            $signValid = false;
            if(count($errorsValidations) == 0 && $password != null){
                $jwtAuth = $this->get(JwtAuth::class);
                $data = $jwtAuth->signup($email, $password);
                if($data) $signValid = true;                 
            }
            
            if(!$signValid){
                $data = array('status'=>'error', 'data'=>'Email o Password no válidos');
            }

        }

        return $helpers->jsonParser($data);
    }

    /**
     * Prueba de acceso a la "BBDD", añadiendo un usuario e imprimiendo el numero de usuarios.
     * Accesible mediante una url similar a http://localhost/gestor-tareas-symfony-angular/symfony/web/app_dev.php/testadduser
     */
    public function testadduserAction()
    {
        $em = $this->getDoctrine()->getManager();
        $repoUser = $em->getRepository("BackendBundle:User");

        $user = new User();
        $user->setName("Marcos3");
        $user->setSurname("RS");
        $user->setEmail("marcos3@email.com");
        $user->setPassword("1234");
        $user->setCreatedAt(new \DateTime("now"));

        $em->persist($user);
        $em->flush();

        $users = $repoUser->findAll();
        $count = count($users);

        return  $this->get(Helpers::class)->jsonParser($users);
    }

    /**
     * Si el token es válido devolverá los usuarios.
     * Para probarlo:
     *  llamar a testadduserAction
     *  llamar a loginAction con datos (x-wwww-form-urlencoded):  json  -->> {"email":"marcos3@email.com", "password":"1234"}
     *  lo anterior devolverá un token, por tanto podemos llamar ya a este acción  con datos (x-wwww-form-urlencoded):  authorization  -->> el valor del token
     */
    public function testchecktokenAction(Request $request)
    {
        //Recogida de parametro json que deberá contener todos los datos.
        $authorization = $request->get('authorization',null);
        $helpers = $this->get(Helpers::class);
        $data = null;
        if(is_null($authorization)){
            $data = array('status'=>'error', 'data'=>'Faltan parámetro "authorization"');
        }else{

            if( $this->get(JwtAuth::class)->checkToken($authorization)){
                $em = $this->getDoctrine()->getManager();
                $users = $em->getRepository("BackendBundle:User")->findAll();
                $data = array(
                    'status'=>'success', 
                    'users'=>$users
                );
            }

        }
        if(!$data){
            $data = array('status'=>'error', 'code'=>400, 'data'=>'Authorization not valid');
        }

        return  $this->get(Helpers::class)->jsonParser($data);
    }
}
