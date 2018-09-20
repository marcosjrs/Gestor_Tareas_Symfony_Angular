# Gestor de tareas con Symfony 3.4 y Angular

## Pasos iniciales para la parte de symfony

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

5. Añadimos la dependencia de "firebase/php-jwt" en el composer.json, para futuras utilizaciones de JWT cuando creemos la parte de la autentificación. Y tambien añadimos la dependencia de "knplabs/knp-paginator-bundle", para cuando creemos la entrega páginada de datos. Tras añadir estas dependencias, nos dirigimos desde la consola a la carpeta symfony (ubicación del composer.json), y ejecutamos ```composer update``` 

6. Creamos un bundle llamado BackendBundle, mediante consola: ```php .\bin\console generate:bundle --namespace=BackendBundle --format=yml``` 

	Tras lo cual, tuvimos que hacer algunos retoques (por "bugs" con la versión utilizada de symfony):

- Sustituir el contenido del "psr-4" del composer.json, por: ```"psr-4": { "AppBundle\\": "src/AppBundle", "BackendBundle\\": "src/BackendBundle" }```

- Ejecutar el comando: composer update

- Modificar la llamada de renderización en el DefaultContoller del bundle creado (ya que de otra forma no encontraba el twig): return $this->render('@Backend/Default/index.html.twig');

7. Eliminamos  la carga de la vista del nuevo bundle mediante la ruta principal ("app_dev.php/"), eliminando de del routing.yml el código: 
	```
	resource: "@BackendBundle/Resources/config/routing.yml"
	prefix:   /
	```


