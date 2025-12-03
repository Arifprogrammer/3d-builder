import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, effect } from '@angular/core';
import { extend, injectLoader, injectStore, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

extend({ ...THREE, OrbitControls });

@Component({
  imports: [NgtArgs],
  templateUrl: './car.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Car {
  store = injectStore();
  gltf = injectLoader(
    () => GLTFLoader,
    () => 'assets/car/scene.gltf'
  );

  model = computed(() => {
    const gltf = this.gltf();
    return gltf?.scene || null;
  });

  camera = this.store.select('camera');
  glDom = this.store.select('gl', 'domElement');

  constructor() {
    /* effect(() => {
      const camera = this.store.get('camera');
      if (camera) {
        camera.lookAt(0, 0, 0);
      }
    }); */
  }
}
