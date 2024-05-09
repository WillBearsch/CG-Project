import { useState, useMemo } from "react";
import { Quaternion, TorusGeometry, Vector3 } from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { planePosition } from "./Airplane";
import * as THREE from 'three';

function randomPoint(scale) {
  return new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).multiply(scale || new Vector3(1, 1, 1));
}

const TARGET_RAD = 0.125;

export function Targets() {
  const [targets, setTargets] = useState(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      const isGolden = (i + 1) % 5 === 0;
      arr.push({
        center: randomPoint(new Vector3(4, 1, 4)).add(
          new Vector3(0, 2 + Math.random() * 2, 0)
        ),
        direction: randomPoint().normalize(),
        hit: false,
        golden: isGolden,
      });
    }

    return arr;
  });

  const [score, setScore] = useState(0);

  const normalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "green", 
      roughness: 0.5,
      metalness: 0.5,
    });
  }, []);

  const goldenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ffd700",
      roughness: 0.2,
      metalness: 1,
    });
  }, []);

  const geometries = useMemo(() => {
    const geometries = [];
    targets.forEach((target) => {
      const torusGeo = new TorusGeometry(TARGET_RAD, 0.02, 8, 25);
      torusGeo.applyQuaternion(
        new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, 1),
          target.direction
        )
      );
      torusGeo.translate(target.center.x, target.center.y, target.center.z);
      geometries.push(torusGeo);
    });
    return geometries;
  }, [targets]);

  useFrame(() => {
    targets.forEach((target, i) => {
      const v = planePosition.clone().sub(target.center);
      const dist = target.direction.dot(v);
      const projected = planePosition
        .clone()
        .sub(target.direction.clone().multiplyScalar(dist));

      const hitDist = projected.distanceTo(target.center);
      if (hitDist < TARGET_RAD) {
        target.hit = true;
        if (target.golden) {
          setScore(score + 10);
        } else {
          setScore(score + 1);
        }
      }
    });

    const atLeastOneHit = targets.find((target) => target.hit);
    if (atLeastOneHit) {
      setTargets(targets.filter((target) => !target.hit));
    }
  });

  return (
    <>
      {geometries.map((geometry, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={targets[index].golden ? goldenMaterial : normalMaterial}
        />
      ))}
      <Text
        position={[0, 7, -10]}
        color="black"
        fontSize={2.0}
      >
        Score: {score}
      </Text>
    </>
  );
}