import React, { useEffect, useRef, useState } from 'react';
import { Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera, MeshBuilder, StandardMaterial, Color3, PointerEventTypes, Color4, UniversalCamera } from '@babylonjs/core';
import { BLOCKS, BLOCK_SIZE, CHUNK_SIZE } from '../constants';
import { ChunkData } from '../types';

interface SceneProps {
  mode: 'plot' | 'world';
  chunks: ChunkData[];
  onPlaceBlock: (x: number, y: number, z: number, type: number) => void;
  onRemoveBlock: (x: number, y: number, z: number) => void;
  selectedBlock: number;
  initialCamPos?: { x: number, y: number, z: number };
}

const SceneManager: React.FC<SceneProps> = ({ mode, chunks, onPlaceBlock, onRemoveBlock, selectedBlock, initialCamPos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.53, 0.81, 0.92, 1); // Sky blue
    scene.collisionsEnabled = true;

    // Light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;

    // Camera
    let camera: ArcRotateCamera | UniversalCamera;

    if (mode === 'plot') {
      const arcCam = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 30, Vector3.Zero(), scene);
      arcCam.attachControl(canvasRef.current, true);
      arcCam.wheelPrecision = 50;
      camera = arcCam;
    } else {
      const uniCam = new UniversalCamera("UniversalCamera", new Vector3(initialCamPos?.x || 0, 10, initialCamPos?.z || 0), scene);
      uniCam.attachControl(canvasRef.current, true);
      uniCam.keysUp.push(87); // W
      uniCam.keysDown.push(83); // S
      uniCam.keysLeft.push(65); // A
      uniCam.keysRight.push(68); // D
      uniCam.speed = 0.5;
      uniCam.checkCollisions = true;
      uniCam.ellipsoid = new Vector3(0.5, 1, 0.5);
      camera = uniCam;
    }

    // Grid (Ground)
    const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
    groundMat.alpha = 0.2;
    groundMat.wireframe = true;
    ground.material = groundMat;
    ground.checkCollisions = true;

    // Voxel Rendering (Simplified Instance System)
    const materials: Record<number, StandardMaterial> = {};
    const meshCache: Record<string, any> = {};

    const getMaterial = (id: number) => {
        if (!materials[id]) {
            const mat = new StandardMaterial(`mat_${id}`, scene);
            const hex = BLOCKS[id].color;
            mat.diffuseColor = Color3.FromHexString(hex);
            if(BLOCKS[id].type === 'light') mat.emissiveColor = Color3.FromHexString(hex).scale(0.6);
            materials[id] = mat;
        }
        return materials[id];
    };

    // Render Chunks
    chunks.forEach(chunk => {
        chunk.blocks.forEach(b => {
            const key = `${b.x},${b.y},${b.z}`;
            if (meshCache[key]) return;
            const box = MeshBuilder.CreateBox("b", { size: BLOCK_SIZE * 0.95 }, scene);
            box.position = new Vector3(b.x, b.y + 0.5, b.z);
            box.material = getMaterial(b.type);
            box.checkCollisions = true;
            box.metadata = { x: b.x, y: b.y, z: b.z, type: b.type };
            meshCache[key] = box;
        });
    });

    // Ghost Block (Cursor)
    const ghost = MeshBuilder.CreateBox("ghost", { size: BLOCK_SIZE }, scene);
    ghost.material = new StandardMaterial("ghostMat", scene);
    (ghost.material as StandardMaterial).alpha = 0.4;
    (ghost.material as StandardMaterial).emissiveColor = Color3.White();
    ghost.isPickable = false;

    // Input Handling
    scene.onPointerObservable.add((pointerInfo) => {
        const pick = pointerInfo.pickInfo;
        
        if (pick && pick.hit) {
            const p = pick.pickedPoint;
            if(!p) return;

            // Calculate Grid Position
            const x = Math.round(p.x);
            const z = Math.round(p.z);
            let y = Math.round(p.y);

            // Adjust y based on face normal
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
               if (pick.pickedMesh?.metadata) {
                    // Clicking on existing block
                    if (pointerInfo.event.button === 2) {
                        // Right click: Delete
                        onRemoveBlock(pick.pickedMesh.metadata.x, pick.pickedMesh.metadata.y, pick.pickedMesh.metadata.z);
                        pick.pickedMesh.dispose();
                        delete meshCache[`${pick.pickedMesh.metadata.x},${pick.pickedMesh.metadata.y},${pick.pickedMesh.metadata.z}`];
                        return;
                    } 
                    // Left click: Add (calc adjacent)
                    const normal = pick.getNormal(true);
                    if(normal) {
                        const nx = Math.round(p.x + normal.x);
                        const ny = Math.round(p.y + normal.y);
                        const nz = Math.round(p.z + normal.z);
                        // Correct for box center vs surface
                         // For simplicity in this demo, strict normal logic
                         y = Math.floor(p.y) + (normal.y > 0 ? 1 : 0);
                         // This is tricky without precise math, fallback to ghost pos
                         const gp = ghost.position;
                         onPlaceBlock(gp.x, gp.y - 0.5, gp.z, selectedBlock);
                         
                         // Visual update immediate
                         const box = MeshBuilder.CreateBox("b", { size: BLOCK_SIZE * 0.95 }, scene);
                         box.position = gp.clone();
                         box.material = getMaterial(selectedBlock);
                         box.metadata = {x: gp.x, y: gp.y - 0.5, z: gp.z};
                         meshCache[`${gp.x},${gp.y-0.5},${gp.z}`] = box;
                    }
               } else {
                   // Clicking on ground
                    if (pointerInfo.event.button === 0) {
                        onPlaceBlock(x, 0, z, selectedBlock);
                        const box = MeshBuilder.CreateBox("b", { size: BLOCK_SIZE * 0.95 }, scene);
                        box.position = new Vector3(x, 0.5, z);
                        box.material = getMaterial(selectedBlock);
                        box.metadata = {x, y: 0, z};
                        meshCache[`${x},0,${z}`] = box;
                    }
               }
            }

            // Move Ghost
            if(pick.pickedMesh) {
                const normal = pick.getNormal(true);
                if(normal) {
                    ghost.position.x = Math.round(p.x + normal.x * 0.1);
                    ghost.position.y = Math.round(p.y + normal.y * 0.1);
                    ghost.position.z = Math.round(p.z + normal.z * 0.1);
                    // Snap
                    ghost.position.x = Math.round(ghost.position.x);
                    ghost.position.y = Math.max(0.5, Math.round(ghost.position.y) + 0.5); // align center
                    ghost.position.z = Math.round(ghost.position.z);
                }
            }
        }
    });

    // Optimization: Throttle FPS update
    let frameCount = 0;
    let lastTime = performance.now();

    engine.runRenderLoop(() => {
        scene.render();
        
        frameCount++;
        const now = performance.now();
        if (now - lastTime > 1000) {
            setFps(Math.round(engine.getFps()));
            lastTime = now;
            frameCount = 0;
        }
    });

    const resize = () => engine.resize();
    window.addEventListener('resize', resize);

    return () => {
        window.removeEventListener('resize', resize);
        scene.dispose();
        engine.dispose();
    };
  }, [mode, selectedBlock]);

  return (
    <div className="relative w-full h-full">
        <canvas 
            ref={canvasRef} 
            className="w-full h-full" 
            style={{ width: '100%', height: '100%', touchAction: 'none', outline: 'none' }}
            onContextMenu={e => e.preventDefault()} 
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white p-1 text-xs font-mono">
            FPS: {fps}
        </div>
    </div>
  );
};

export default SceneManager;