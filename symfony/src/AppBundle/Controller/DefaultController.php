<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use BackendBundle\Entity\User;
use AppBundle\Service\Helpers;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * Prueba de acceso a la "BBDD", añadiendo un usuario e imprimiendo el numero de usuarios.
     * Accesible mediante una url similar a http://localhost/gestor-tareas-symfony-angular/symfony/web/app_dev.php/testadduser
     * @Route("/testadduser", name="testadduser")
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
}
