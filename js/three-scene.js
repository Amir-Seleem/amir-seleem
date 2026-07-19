function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0025);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 1. Floating Particles (White dust)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 80; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15, color: 0xffffff, transparent: true, opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // 2. Wireframe Icosahedron (White)
    const geoGeometry = new THREE.IcosahedronGeometry(15, 1);
    const geoMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, wireframe: true, transparent: true, opacity: 0.05 
    });
    const wireframeSphere = new THREE.Mesh(geoGeometry, geoMaterial);
    scene.add(wireframeSphere);

    // 3. Sharp Torus Ring (Geometric accent)
    const torusGeometry = new THREE.TorusGeometry( 20, 0.1, 16, 100 );
    const torusMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.2 } );
    const torus = new THREE.Mesh( torusGeometry, torusMaterial );
    torus.rotation.x = Math.PI / 2; // Lay it flat
    scene.add( torus );

    let mouseX = 0; let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        const targetX = mouseX * 0.001;
        const targetY = mouseY * 0.001;

        // Particles
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Wireframe
        wireframeSphere.rotation.y -= 0.001;
        wireframeSphere.rotation.x -= 0.0005;
        wireframeSphere.scale.setScalar(1 + Math.sin(elapsedTime * 0.5) * 0.03);

        // Torus rotation
        torus.rotation.z = elapsedTime * 0.1;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

initThreeJS();