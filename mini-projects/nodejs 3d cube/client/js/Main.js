//Skrypt strony


document.onload = Game()
var MouseX = 50,MouseY = 50
var canvas

function Game(){
	var coords = document.getElementById("coords")
	var Scene1 = new THREE.Scene()
	var Camera1 = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,1000)
	var Renderer = new THREE.WebGLRenderer()

	document.body.appendChild(Renderer.domElement);

	var Geometry1 = new THREE.BoxGeometry(20,20,20)
	var Material1 = new THREE.MeshStandardMaterial()

	Material1.color = new THREE.Color(0xFF0000)

	var Light1 = new THREE.AmbientLight(0x0000FF)
	Scene1.add(Light1)
	
	var cube = new THREE.Mesh(Geometry1,Material1)
	Scene1.add(cube);

	Camera1.position.z = 50

	var lights = [];
			lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0,2);

			lights[ 0 ].position.set( 10, 15, 50 );

			Scene1.add( lights[ 0 ] );
	var PointGeometry = new THREE.BoxGeometry(1,1,1)

	var Points = [];

		Points[1] = new THREE.Mesh(PointGeometry,Material1)

		Points[ 1 ].position.set( 10,15, 50 );

			Scene1.add( Points[ 1 ] );

	Renderer.setClearColor(0x66ccFF)

	function Draw(){
		coords.innerHTML = MouseX + "   \n" + MouseY
		Renderer.setSize(window.innerWidth,window.innerHeight)
		requestAnimationFrame(Draw)
		Renderer.render(Scene1,Camera1)
		
		cube.rotation.y = MouseX
		cube.rotation.z = MouseY
	}
	Draw()

	canvas = document.getElementsByTagName("canvas")[0]
	canvas.addEventListener("mousemove",function(e){handle(e)})
	canvas.addEventListener("wheel",function(e){wheel(e)})

	function wheel(e){
	if(e.deltaY == 3)
		Camera1.position.z+=1
	else
		Camera1.position.z-=1
}
}

function handle(e){
	MouseX = e.clientX/250
	MouseY = e.clientY/250
}
