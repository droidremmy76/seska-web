"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv=uv;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}`;

const fragmentShader = /* glsl */ `
precision highp float;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);} 
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=noise(p)*a;p*=2.02;a*=.5;}return v;}

void main(){
  vec2 uv=vUv;
  vec2 delta=uv-uMouse;
  float dist=length(delta);
  vec2 dir=normalize(delta+vec2(.00001));
  float wave=sin(dist*32.0-uTime*7.5)*exp(-dist*7.5);
  float n=fbm(uv*5.0+vec2(uTime*.08,-uTime*.05));
  float liquid=(wave+(n-.5)*.35*exp(-dist*7.5))*uHover;
  vec2 perp=vec2(-dir.y,dir.x);
  vec2 distortion=(dir+perp*.45)*liquid*.055;
  vec2 turbulence=(vec2(noise(uv*9.0+vec2(uTime*.12,0.0)),noise(uv*9.0+vec2(0.0,-uTime*.12)))-.5)*.018*uHover*exp(-dist*7.5);
  vec2 duv=clamp(uv+distortion+turbulence,vec2(.001),vec2(.999));
  float off=.018*uHover;
  vec4 base=texture2D(uTexture,duv);
  vec4 cyan=texture2D(uTexture,clamp(duv+vec2(off,off*.18),vec2(.001),vec2(.999)));
  vec4 magenta=texture2D(uTexture,clamp(duv-vec2(off,off*.18),vec2(.001),vec2(.999)));
  vec4 yellow=texture2D(uTexture,clamp(duv+vec2(0.,off*.10),vec2(.001),vec2(.999)));
  vec3 separated=vec3(magenta.r,cyan.g,yellow.b);
  vec3 color=mix(base.rgb,separated,smoothstep(0.0,1.0,uHover));
  float edge=smoothstep(.15,.85,abs(liquid));
  vec3 ink=mix(vec3(0.,.55,.95),vec3(1.,0.,.45),smoothstep(.25,.75,n));
  color+=ink*edge*uHover*.035;
  gl_FragColor=vec4(color,base.a);
}`;

export function InkBleedCard({ image, width=4, height=3, position=[0,0,0] }:{image:string;width?:number;height?:number;position?:[number,number,number]}) {
  const texture=useLoader(THREE.TextureLoader,image);
  const materialRef=useRef<THREE.ShaderMaterial|null>(null);
  const targetHover=useRef(0), currentHover=useRef(0);
  const targetMouse=useRef(new THREE.Vector2(.5,.5)), currentMouse=useRef(new THREE.Vector2(.5,.5));

  useMemo(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;texture.needsUpdate=true;return texture;},[texture]);
  const uniforms=useMemo(()=>({uTexture:{value:texture},uTime:{value:0},uHover:{value:0},uMouse:{value:new THREE.Vector2(.5,.5)}}),[texture]);

  useFrame((_,delta)=>{
    const m=materialRef.current;if(!m)return;
    m.uniforms.uTime.value+=delta;
    const hs=1-Math.exp(-12*delta), ms=1-Math.exp(-16*delta);
    currentHover.current=THREE.MathUtils.lerp(currentHover.current,targetHover.current,hs);
    currentMouse.current.lerp(targetMouse.current,ms);
    m.uniforms.uHover.value=currentHover.current;
    m.uniforms.uMouse.value.copy(currentMouse.current);
  });

  useEffect(()=>()=>texture.dispose(),[texture]);
  const enter=useCallback((e:any)=>{if(e.uv){targetMouse.current.copy(e.uv);currentMouse.current.copy(e.uv);}targetHover.current=1;},[]);
  const move=useCallback((e:any)=>{if(e.uv)targetMouse.current.copy(e.uv);},[]);
  const leave=useCallback(()=>{targetHover.current=0;},[]);

  return <mesh position={position} onPointerEnter={enter} onPointerMove={move} onPointerLeave={leave}>
    <planeGeometry args={[width,height,64,64]}/>
    <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent toneMapped={false}/>
  </mesh>;
}
