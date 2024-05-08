import React from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { SphereEnv } from "./SphereEnv";
import { Landscape } from "./Landscape";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { EffectComposer, DepthOfField, Bloom } from "@react-three/postprocessing";
import { MotionBlur } from "./MotionBlur";

function App() {
  return (
    <>
      <SphereEnv />
      <Environment background={false} files={"assets/textures/sky.hdr"} />

      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      
      <Landscape />  
      <Airplane />
      <Targets />

      <directionalLight
        castShadow
        color={"#f3d29a"}
        intensity={2}
        position={[10, 5, 4]}
        shadow-bias={-0.0005}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.01}
        shadow-camera-far={20}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-left={-6.2}
        shadow-camera-right={6.4}
      />

      <EffectComposer>
        <MotionBlur />
        <Bloom />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
      </EffectComposer>

    </>
  );
}

export default App;
