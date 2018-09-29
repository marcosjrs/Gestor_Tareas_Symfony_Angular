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
8. Generar las entidades de las tablas. 
	- Generamos la configuración en yml, que modificaremos luego, para crear las entidades "finales": 

		```php .\bin\console doctrine:mapping:import BackendBundle yml```

	- Modificamos los dos orm que acaba de generar, llamándolos de forma individual Task.orm.yml y User.orm.yml. Y dentro de ellos tambien utilizamos el singular (en plural solo quedaría el valor de "table" y el alias de las foreign keys dentro de los archivos). Tras esto ejecutamos, para que nos genere las entidades Task y User:

		```php bin/console doctrine:schema:update --force```

		```composer update```

		```php .\bin\console doctrine:generate:entities BackendBundle```


## Pasos iniciales para la parte de angular

1. Instalamos el CLI de Angular. Luego nos situamos en la carpeta del proyecto y creamos el proyecto de angular (con ```ng new``` ), en este caso se le llamó "angular". Y para comprobar, una vez instalado, una vez dentro del directorio del proyecto, arrancamos el proyecto con el ```npm start```, y finalmente abrimos el navegador en ```http://localhost:4200/``` para ver la pantalla de "bienvenida" del proyecto.
	```
	npm install -g @angular/cli
	ng new angular
	npm start
	```
Nota: En nuestro caso era mejor haber hecho ```ng new angular --routing```, para que nos generara automaticamente el archivo de enrutado y lo inyectara en el modulo...

2. Creamos los componentes. Para luego crear una nueva carpeta views a las que llevar las vistas (html y css), actualizando las rutas dentro de los compenentes creados. 
	```
	ng g c components/component
	```
3. Creando el enrutado. Creamos un archivo  llamado app.routing.ts (u otro nombre), con las rutas configuradas, donde se le indica que componente se debe renderizar con que ruta (path):
	```
	import { NgModule } from '@angular/core';
	import { Routes, RouterModule } from '@angular/router';
	import {LoginComponent} from './components/login.component';
	import {RegisterComponent} from './components/register.component';

	const routes: Routes = [
		{ path: '', component: LoginComponent },
		{ path: 'login', component: LoginComponent },
		{ path: 'register', component: RegisterComponent },
		{ path: '**', component: LoginComponent } //el resto de las rutas
	];

	@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
	})
	export class AppRoutingModule { }
	```

	Luego en el html, "decimos" donde renderizar (en este caso en app.component.html) colocando al etiqueta: 
	```
	<router-outlet></router-outlet>
	```

## Instalación de jquery y bootstrap

Instalamos mediante npm
```
npm install --save jquery
npm install --save bootstrap
```

Y ahora en el index.html ya podemos cargar los minificados de dichas librería.
```
<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
<script src="../node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
```



