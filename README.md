# Gestor de tareas con Symfony 3.4 y Angular

Pasos seguidos:

1. Configuramos el httpd.conf de Apache, añadiéndole:
 ```
# Configuración para que permita realizar peticiones ajax desde cualquier cliente. Obviamente esto no se haría en un server de PRO
<IfModule mod_headers.c>
	Header set Access-Control-Allow-Origin: "*"
	Header set Access-Control-Allow-Headers: "*"
	Header set Access-Control-Allow-Methods: "GET, POST, PUT, DELETE, OPTIONS"
</IfModule>
 ```

2. Creación de la base de datos, ejecutando el contenido de BBDD.sql

3. Instalacción de Symfony, que se utilizará como backend:
 ```composer create-project symfony/framework-standard-edition gestor-tareas-symfony-angular/symfony/``` 
 (Al preguntar configuración, todo por defecto excepto el nombre de la base de datos que le puse de nombre: gestor_tareas)

4. Comprobación de que está funcionando correctamente, arrancando apache y mysql y luego accediendo a: http://localhost/angular/gestor-tareas-symfony-angular/symfony/web/



