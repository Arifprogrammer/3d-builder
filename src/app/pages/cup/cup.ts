import { Component, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { extend, injectLoader, injectStore, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

extend({ ...THREE, OrbitControls });

@Component({
  imports: [NgtArgs],
  templateUrl: './cup.html',
  styleUrl: './cup.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cup {
  ngtStore = injectStore();
  gltf = injectLoader(
    () => GLTFLoader,
    () => 'assets/cup/scene.gltf'
  );

  model = computed(() => {
    const gltf = this.gltf();
    return gltf?.scene || null;
  });

  camera = this.ngtStore.select('camera');
  glDom = this.ngtStore.select('gl', 'domElement');

  constructor() {}
}
