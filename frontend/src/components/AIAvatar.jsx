import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import RobotModel from './RobotModel';

export default function AIAvatar({ speaking }) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/20 to-blue-900/20">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.5, 0]}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[5, 5, 5]}
          intensity={1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 4, 2]} intensity={2} color="#7047fa" />
        
        {/* Environment */}
        <Environment preset="city" />
        
        {/* Robot Model */}
        <group position={[0, -1, 0]} scale={0.8}>
          <RobotModel speaking={speaking} />
        </group>
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
} 