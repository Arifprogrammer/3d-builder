import { Component, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { extend, injectLoader, injectStore, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

extend({ ...THREE, OrbitControls });

@Component({
  imports: [NgtArgs],
  templateUrl: './supercar.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SuperCar {
  Math = Math;
  store = injectStore();

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

          if (name.includes('glass') || name.includes('window') || name.includes('windshield')) {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0x0a0a0a,
              metalness: 0.1,
              roughness: 0.1,
              transmission: 0.9,
              opacity: 0.7,
              transparent: true,
            });
          }

          if (name.includes('tire') || name.includes('wheel')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x222222,
              metalness: 0.1,
              roughness: 0.7,
            });
          }

          if (name.includes('bone_suspension') || name.includes('car_brake')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xff0000, // redish
              metalness: 0.1,
              roughness: 0.7,
            });
          }

          if (name.includes('car_shadow')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x000000,
              metalness: 0.1,
              roughness: 0.7,
            });
          }

          if (name.includes('car_body_car_body_0')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x888888, // gray
              metalness: 0.1,
              roughness: 0.7,
            });
          }

          if (name.includes('clearcoat')) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x4a874f,
              metalness: 0.75,
              roughness: 0.25,
              envMap: envMap,
              envMapIntensity: 0.5,
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
