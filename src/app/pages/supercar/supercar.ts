import { Component, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { extend, injectLoader, injectStore, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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
      const scene = gltf.scene.clone();
      const pmremGenerator = new THREE.PMREMGenerator(this.store.get('gl'));
      pmremGenerator.compileEquirectangularShader();
      const envMap = pmremGenerator.fromScene(new THREE.Scene()).texture;
      
      scene.traverse((child: any) => {
        if (child.isMesh) {
          const name = child.name.toLowerCase();
          
          if (name.includes('glass') || name.includes('window') || name.includes('windshield')) {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0x0a0a0a,
              metalness: 0.1,
              roughness: 0.1,
              transmission: 0.9,
              opacity: 0.3,
              transparent: true,
            });
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x1a4d2e,
              metalness: 0.85,
              roughness: 0.25,
              envMap: envMap,
              envMapIntensity: 2.0,
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
