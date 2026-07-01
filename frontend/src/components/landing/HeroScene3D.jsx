import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';

function lerp(a, b, t) {
    return a + (b - a) * t;
}

/** Single realistic coin: metallic body, raised rim, embossed face, currency mark */
function Coin({ faceColor, rimColor, simplified, symbol = '₹' }) {
    const segments = simplified ? 32 : 48;
    const thickness = 0.07;
    const radius = 0.54;
    const half = thickness / 2;

    const metalProps = {
        metalness: 0.92,
        roughness: simplified ? 0.28 : 0.18,
        envMapIntensity: 1.2,
    };

    return (
        <group>
            {/* Coin body */}
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[radius, radius, thickness, segments]} />
                <meshStandardMaterial color={faceColor} {...metalProps} />
            </mesh>

            {/* Raised outer rim lip — top face */}
            <mesh position={[0, half + 0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius - 0.03, 0.018, 8, segments]} />
                <meshStandardMaterial color={rimColor} metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Raised outer rim lip — bottom face */}
            <mesh position={[0, -half - 0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius - 0.03, 0.018, 8, segments]} />
                <meshStandardMaterial color={rimColor} metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Inner embossed ring — top face */}
            <mesh position={[0, half + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius * 0.42, radius * 0.62, segments]} />
                <meshStandardMaterial
                    color={rimColor}
                    metalness={0.88}
                    roughness={0.22}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner embossed ring — bottom face */}
            <mesh position={[0, -half - 0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius * 0.42, radius * 0.62, segments]} />
                <meshStandardMaterial
                    color={rimColor}
                    metalness={0.88}
                    roughness={0.22}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Center hub on top */}
            <mesh position={[0, half + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[radius * 0.38, segments]} />
                <meshStandardMaterial
                    color={faceColor}
                    metalness={0.9}
                    roughness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Currency symbol — top */}
            <Text
                position={[0, half + 0.012, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={simplified ? 0.32 : 0.36}
                color={rimColor}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.012}
                outlineColor="#8B6914"
            >
                {symbol}
            </Text>

            {/* Currency symbol — bottom (mirrored) */}
            {!simplified && (
                <Text
                    position={[0, -half - 0.012, 0]}
                    rotation={[Math.PI / 2, 0, Math.PI]}
                    fontSize={0.36}
                    color={rimColor}
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.012}
                    outlineColor="#8B6914"
                >
                    {symbol}
                </Text>
            )}
        </group>
    );
}

function CoinStack({
    primaryColor,
    secondaryColor,
    rotationSpeed,
    floatIntensity,
    parallaxStrength,
    simplified,
    active,
}) {
    const groupRef = useRef();
    const { pointer } = useThree();

    const coinCount = simplified ? 4 : 6;
    const coins = useMemo(() => {
        const gold = new THREE.Color('#E8C547');
        const bronze = new THREE.Color('#C9A227');
        const rim = new THREE.Color('#9A7B0A');
        const accent = new THREE.Color(primaryColor).lerp(new THREE.Color(secondaryColor), 0.5);

        const items = [];
        for (let i = 0; i < coinCount; i++) {
            const t = i / Math.max(1, coinCount - 1);
            const faceColor = gold.clone().lerp(bronze, t * 0.45).lerp(accent, t * 0.12).getStyle();
            const rimColor = rim.clone().lerp(accent, t * 0.08).getStyle();
            items.push({
                y: i * 0.095,
                x: Math.sin(i * 0.9) * 0.04,
                z: Math.cos(i * 0.8) * 0.04,
                ry: i * 0.18,
                tilt: (i % 2 === 0 ? 1 : -1) * 0.04,
                faceColor,
                rimColor,
            });
        }
        return items;
    }, [coinCount, primaryColor, secondaryColor]);

    useFrame((state) => {
        const group = groupRef.current;
        if (!group || !active) return;

        const time = state.clock.getElapsedTime();
        const targetX = pointer.y * parallaxStrength * 0.35;
        const targetZ = -pointer.x * parallaxStrength * 0.35;
        const targetY = time * rotationSpeed;

        group.rotation.x = lerp(group.rotation.x, targetX, 0.06);
        group.rotation.z = lerp(group.rotation.z, targetZ, 0.06);
        group.rotation.y = lerp(group.rotation.y, targetY, 0.04);
        group.position.y = Math.sin(time * 1.2) * floatIntensity * 0.16;
    });

    return (
        <group ref={groupRef}>
            {coins.map((coin, index) => (
                <group
                    key={index}
                    position={[coin.x, coin.y, coin.z]}
                    rotation={[coin.tilt, coin.ry, coin.tilt * 0.5]}
                >
                    <Coin
                        faceColor={coin.faceColor}
                        rimColor={coin.rimColor}
                        simplified={simplified}
                        symbol="₹"
                    />
                </group>
            ))}
        </group>
    );
}

function Particles({ primaryColor, secondaryColor, active }) {
    const pointsRef = useRef();
    const particleCount = 96;
    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const col = new Float32Array(particleCount * 3);
        const c1 = new THREE.Color(primaryColor);
        const c2 = new THREE.Color(secondaryColor);
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const spread = 3.2;
            pos[i3] = (Math.random() - 0.5) * spread;
            pos[i3 + 1] = (Math.random() - 0.5) * spread * 0.8;
            pos[i3 + 2] = -1.6 - Math.random() * 1.8;
            const mixed = c1.clone().lerp(c2, Math.random());
            col[i3] = mixed.r;
            col[i3 + 1] = mixed.g;
            col[i3 + 2] = mixed.b;
        }
        return [pos, col];
    }, [primaryColor, secondaryColor]);

    useFrame((state) => {
        if (!pointsRef.current || !active) return;
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.028}
                sizeAttenuation
                vertexColors
                transparent
                opacity={0.55}
                depthWrite={false}
            />
        </points>
    );
}

function Scene({
    simplified,
    active,
    primaryColor,
    secondaryColor,
    rotationSpeed,
    floatIntensity,
    parallaxStrength,
}) {
    return (
        <>
            <ambientLight intensity={0.65} />
            <directionalLight
                position={[2.6, 2.8, 2.6]}
                intensity={1.35}
                color="#fff8e7"
            />
            <directionalLight
                position={[-2.6, 1.2, -2.6]}
                intensity={0.55}
                color={secondaryColor}
            />
            <pointLight position={[0, 2, 1.5]} intensity={0.4} color="#FFD700" />
            <Environment preset="studio" />
            {!simplified && (
                <Particles
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    active={active}
                />
            )}
            <CoinStack
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                simplified={simplified}
                rotationSpeed={rotationSpeed}
                floatIntensity={floatIntensity}
                parallaxStrength={parallaxStrength}
                active={active}
            />
        </>
    );
}

const HeroScene3D = ({
    primaryColor = '#10B981',
    secondaryColor = '#4F46E5',
    backgroundColor = '#0F172A',
    rotationSpeed = 0.3,
    floatIntensity = 1,
    parallaxStrength = 0.3,
    simplifyOnMobile = true,
    staticImageUrl = '',
    className = '',
}) => {
    const wrapperRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [inView, setInView] = useState(true);
    const [webglSupported, setWebglSupported] = useState(true);

    const checkViewport = useCallback(() => {
        setIsMobile(window.innerWidth < 640);
    }, []);

    useEffect(() => {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            setWebglSupported(!!gl);
        } catch {
            setWebglSupported(false);
        }
    }, []);

    useEffect(() => {
        checkViewport();
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, [checkViewport]);

    useEffect(() => {
        const node = wrapperRef.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const simplified = simplifyOnMobile && isMobile;
    const shouldShowImage = staticImageUrl.trim().length > 0;

    const fallbackStyle = {
        background: `radial-gradient(circle at 30% 25%, ${primaryColor}33 0%, transparent 40%), radial-gradient(circle at 72% 70%, ${secondaryColor}33 0%, transparent 42%), ${backgroundColor}`,
    };

    return (
        <div
            ref={wrapperRef}
            className={`relative h-full w-full overflow-hidden ${className}`}
            style={{ background: 'transparent' }}
        >
            {shouldShowImage ? (
                <img
                    src={staticImageUrl}
                    alt="SpendWise hero visual"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : webglSupported ? (
                <Canvas
                    dpr={[1, 1.5]}
                    gl={{
                        alpha: true,
                        antialias: true,
                        powerPreference: 'high-performance',
                    }}
                    camera={{ position: [0, 0.55, 3.4], fov: 42 }}
                    className="absolute inset-0 h-full w-full"
                    style={{ background: 'transparent' }}
                >
                    <Scene
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        simplified={simplified}
                        rotationSpeed={rotationSpeed}
                        floatIntensity={floatIntensity}
                        parallaxStrength={parallaxStrength}
                        active={inView}
                    />
                </Canvas>
            ) : (
                <div aria-hidden className="absolute inset-0" style={fallbackStyle} />
            )}
        </div>
    );
};

export default HeroScene3D;
