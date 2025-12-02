import { Component, ElementRef, viewChild, CUSTOM_ELEMENTS_SCHEMA, computed } from '@angular/core';
import { extend, injectBeforeRender, injectLoader, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

extend(THREE);

@Component({
  imports: [NgtArgs],
  templateUrl: './cup.html',
  styleUrl: './cup.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cup {
  meshRef = viewChild.required<ElementRef<Mesh>>('mesh');
  gltf = injectLoader(
    () => GLTFLoader,
    () => 'assets/scene.gltf'
  );

  model = computed(() => {
    const gltf = this.gltf();
    return gltf ? gltf.scene : null;
  });

  constructor() {
    /* injectBeforeRender(({ delta }) => {
      const mesh = this.meshRef().nativeElement;
      mesh.rotation.x += delta;
      mesh.rotation.y += delta;
    }); */
  }
}
