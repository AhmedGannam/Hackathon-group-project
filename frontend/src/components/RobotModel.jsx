import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function RobotModel({ speaking }) {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 2) * 0.1;
    if (speaking) {
      group.current.position.y = Math.sin(t * 8) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Head */}
      <mesh
        position={[0, 2.5, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={speaking ? "#7047fa" : "#4a4a4a"} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 2.6, 0.51]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={speaking ? "#00ff00" : "#ffffff"} emissive={speaking ? "#00ff00" : "#000000"} emissiveIntensity={speaking ? 0.5 : 0} />
      </mesh>
      <mesh position={[0.2, 2.6, 0.51]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={speaking ? "#00ff00" : "#ffffff"} emissive={speaking ? "#00ff00" : "#000000"} emissiveIntensity={speaking ? 0.5 : 0} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arms */}
      <mesh position={[-1, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.5]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.5]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.4, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Energy Core */}
      <mesh position={[0, 1.5, 0.6]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={speaking ? "#7047fa" : "#4a4a4a"}
          emissive={speaking ? "#7047fa" : "#000000"}
          emissiveIntensity={speaking ? 1 : 0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
} 