import { Component, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { extend, injectLoader, injectStore, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DirectionalLightHelper, PointLightHelper, SpotLightHelper } from 'three';

extend({ ...THREE, OrbitControls });

@Component({
  imports: [NgtArgs],
  templateUrl: './supercar.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SuperCar {
  Math = Math;
  store = injectStore();

  // Texture loader
  textureLoader = new THREE.TextureLoader();

  // Light helpers
  hemisphereHelper = new THREE.HemisphereLightHelper(
    new THREE.HemisphereLight(0xffffff, 0x222222, 0.8),
    2
  );
  directionalHelper1 = new DirectionalLightHelper(new THREE.DirectionalLight(0xffffff, 2.0), 5);
  directionalHelper2 = new DirectionalLightHelper(new THREE.DirectionalLight(0xe8f4f8, 1.2), 5);
  pointLightHelper1 = new PointLightHelper(new THREE.PointLight(0xffffff, 1.0), 2);
  pointLightHelper2 = new PointLightHelper(new THREE.PointLight(0xb8d4e8, 0.8), 2);
  spotLightHelper = new SpotLightHelper(new THREE.SpotLight(0xffffff, 1.5), 0x00ff00);

  constructor() {
    this.directionalHelper1.position.set(10, 15, 10);
    this.directionalHelper2.position.set(-8, 10, -8);
    this.pointLightHelper1.position.set(15, 8, 5);
    this.pointLightHelper2.position.set(-10, 8, -5);
    this.spotLightHelper.position.set(0, 20, 0);
  }

  gltf = injectLoader(
    () => GLTFLoader,
    () => 'assets/supercar/scene.gltf'
  );

  model = computed(() => {
    const gltf = this.gltf();
    if (gltf?.scene) {
      console.log(gltf.scene);
      const scene = gltf.scene.clone();
      const pmremGenerator = new THREE.PMREMGenerator(this.store.get('gl'));
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromScene(new THREE.Scene()).texture;

      scene.traverse((child: any) => {
        if (child.isMesh) {
          const name = child.name.toLowerCase();
          console.log(name);

          if (name.includes('glass')) {
            const glassColorMap = this.textureLoader.load(
              'assets/supercar/textures/car_glass_diffuse.png'
            );

            child.material = new THREE.MeshPhysicalMaterial({
              map: glassColorMap,
              metalness: 0.5,
              roughness: 0.2,
              transmission: 0.9,
              opacity: 0.2,
              transparent: true,
            });
          } else if (name.includes('tire') || name.includes('wheel')) {
            const tireColorMap = this.textureLoader.load(
              'assets/supercar/textures/car_tire_diffuse.png'
            );
            const tireNormalMap = this.textureLoader.load(
              'assets/supercar/textures/car_tire_normal.png'
            );
            const tireOcclusionMap = this.textureLoader.load(
              'assets/supercar/textures/car_tire_occlusion.png'
            );
            const tireSpecGloss = this.textureLoader.load(
              'assets/supercar/textures/car_tire_specularGlossiness.png'
            );

            child.material = new THREE.MeshStandardMaterial({
              map: tireColorMap,
              normalMap: tireNormalMap,
              aoMap: tireOcclusionMap,
              roughnessMap: tireSpecGloss,
              metalness: 0.6,
              roughness: 0.2,
            });
          } else if (name.includes('bone_suspension') || name.includes('car_brake')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x631e0a,
              metalness: 0.6,
              roughness: 0.2,
            });
          } else if (name.includes('car_shadow')) {
            const shadowColorMap = this.textureLoader.load(
              'assets/supercar/textures/car_shadow_diffuse.png'
            );
            const shadowOcclusionMap = this.textureLoader.load(
              'assets/supercar/textures/car_shadow_occlusion.png'
            );

            child.material = new THREE.MeshStandardMaterial({
              map: shadowColorMap,
              aoMap: shadowOcclusionMap,
              metalness: 0.6,
              roughness: 0.2,
              transparent: true,
              opacity: 0.3,
            });
          } else if (name.includes('car_body_car_body_0')) {
            const bodyColorMap = this.textureLoader.load(
              'assets/supercar/textures/car_body_diffuse.png'
            );
            const bodyOcclusionMap = this.textureLoader.load(
              'assets/supercar/textures/car_body_occlusion.png'
            );
            const bodySpecGloss = this.textureLoader.load(
              'assets/supercar/textures/car_body_specularGlossiness.png'
            );

            child.material = new THREE.MeshStandardMaterial({
              color: 0x000000,
              // map: bodyColorMap,
              aoMap: bodyOcclusionMap,
              roughnessMap: bodySpecGloss,
              metalness: 0.6,
              roughness: 0.2,
            });
          } else if (name.includes('clearcoat')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x4a874f,
              metalness: 0.75,
              roughness: 0.25,
              envMap: envMap,
              envMapIntensity: 0.5,
            });
          } else {
            const bodyColorMap = this.textureLoader.load(
              'assets/supercar/textures/car_body_diffuse.png'
            );
            const bodySpecGloss = this.textureLoader.load(
              'assets/supercar/textures/car_body_specularGlossiness.png'
            );
            const bodyOcclusionMap = this.textureLoader.load(
              'assets/supercar/textures/car_body_occlusion.png'
            );
            child.material = new THREE.MeshStandardMaterial({
              map: bodyColorMap,
              aoMap: bodyOcclusionMap,
              roughnessMap: bodySpecGloss,
              metalness: 0.75,
              roughness: 0.25,
            });
          }

          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      return scene;
    }
    return null;
  });

  camera = this.store.select('camera');
  glDom = this.store.select('gl', 'domElement');
}
