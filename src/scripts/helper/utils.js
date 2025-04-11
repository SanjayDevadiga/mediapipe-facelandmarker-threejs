import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function loadModel( file ) {
    return new Promise( ( res, rej ) => {
        const loader = new GLTFLoader();
        loader.load( file, function ( gltf ) {
            res( gltf.scene );
        }, undefined, function ( error ) {
            rej( error );
        } );
    });
}