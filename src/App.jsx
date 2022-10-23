import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Stats } from '@react-three/drei';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Model from './Model';


extend({ OrbitControls });

const coordsToVector = (x, y, z) => {
  const vector = new THREE.Vector2((x + (y % 2) * 0.5) * 1.77, y * 1.535);
  return [vector.x, z, vector.y];
}

function Tile({
  x,
  y,
  height,
  onTileClick,
}) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
  // Return view, these are regular three.js elements expressed in JSX
  const position = coordsToVector(x,y,height*1/2+(1/2));

  const handleTileClick = (e) => {
    e.stopPropagation();
    if (onTileClick) {
      onTileClick(x, y, height);
    }
  }

  return (
    <mesh
      position={position}
      ref={mesh}

      rotation={[0, 0, 0]}
      onClick={handleTileClick}
      onPointerOver={(event) => {
        event.stopPropagation();
        return setHover(true)
      }}
      onPointerOut={(event) => setHover(false)}>
      <cylinderBufferGeometry  args={[1, 1, 1+1*height, 6]}/>

      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Controls = () => {
  /*
  camera = new THREE.OrthographicCamera(-D*aspect, D*aspect, D, -D, .1, 1000)
camera.position.set(-20, 20, 20)
camera.lookAt(scene.position)
  */
  const ref = useRef()
  const camera = useThree((state) => {
    console.log(state);
    return state.camera
  });
  const gl = useThree((state) => state.gl);
  useFrame((state, delta) => ref.current.update(delta));
  return <orbitControls ref={ref} args={[camera, gl.domElement]} enableRotate={false} maxPolarAngle={Math.PI / 2} />
}

// const tiles = [
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0],
// ];


const generateMap = (size) => {
  const tiles = [];
  const heightMap = [];
  for (let i = 0; i <= size; i++) {
    tiles.push([]);
    heightMap.push([])
    for (let j = 0; j <= size; j++) {
      tiles[i].push(Math.round(Math.random()));
      if(tiles[i][j] === 0) {
        heightMap[i].push(0);
      } else {
        heightMap[i].push(Math.ceil(Math.random()*3));
      }
    }
  }
  return {tiles, heightMap};
}

const {tiles, heightMap} = generateMap(10);

function App() {
  
  const [selectedTile, setSelectedTile] = useState();
  const [modelPosition, setModelPosition] = useState({x: 0, y: 1, height: .5});
  const [modelSelected, setModelSelected] = useState(false);

  const onTileClick = (x, y, height) => {
    if (modelPosition.x == x && modelPosition.y == y) {
      setModelSelected((state) => !state);
      return;
    }
    if (!modelSelected) {
      return;
    }
    setModelPosition({ x, y, height });
  }

  return (
    <Canvas>
      <Stats showPanel={0} className="stats" />
      <Controls />
      <OrthographicCamera position={[-20, 20, 20]} zoom={25} makeDefault />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model action={modelSelected ? 'Walk' : ''} position={coordsToVector(modelPosition.x, modelPosition.y, modelPosition.height+1)} scale={0.5} />
      {tiles.map((row, rowIndex) => row.map((col, colIndex) => 
        <Tile onTileClick={onTileClick} x={rowIndex} y={colIndex} tileType={col} height={heightMap[rowIndex][colIndex]} />
      ))}
    </Canvas>
  )
}


export default App
