<?php
namespace AppBundle\Service;

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\Response;

class Helpers{

    public $manager;
    public function __construct($manager){
        $this->manager = $manager;
    }

    public function jsonParser($data){

        //https://symfony.com/doc/current/components/serializer.html
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        $json = $serializer->serialize($data, 'json');

        $response = new Response();
        $response->headers->set('Content-Type','application/json');
        $response->setContent($json);

        return $response;
    }

}