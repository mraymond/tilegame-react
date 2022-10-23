import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import ModelURL from './3dassets/Mike.gltf?url';

export default function Model({action, ...props}) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(ModelURL);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if(!actions[action]) {
      return;
    }
    actions[action].play();
    return () => {
      actions[action].stop();
    }
  }, [action])
  console.log(actions);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="RobotArmature">
          <primitive object={nodes.Body} />
          <primitive object={nodes.FootL} />
          <primitive object={nodes.FootR} />
          <skinnedMesh
            name="Mike"
            geometry={nodes.Mike.geometry}
            material={materials.Mike_Texture}
            skeleton={nodes.Mike.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ModelURL);