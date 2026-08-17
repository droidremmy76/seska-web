"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
precision highp float;
attribute vec3 aHome;
attribute vec3 aColor;
attribute float aSize;
attribute float aPhase;
uniform float uTime;
uniform vec3 uMouse;
uniform float uRadius;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vAlpha;

float hash(float n){return fract(sin(n)*43758.5453123);} 
float noise3D(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float n=i.x+i.y*57.0+i.z*113.0;
  float a=mix(hash(n),hash(n+1.0),f.x);
  float b=mix(hash(n+57.0),hash(n+58.0),f.x);
  float c=mix(hash(n+113.0),hash(n+114.0),f.x);
  float d=mix(hash(n+170.0),hash(n+171.0),f.x);
  return mix(mix(a,b,f.y),mix(c,d,f.y),f.z);
}
float fbm(vec3 p){
  float v=0.0,a=.5; v+=noise3D(p)*a; p*=2.03;a*=.5;
  v+=noise3D(p)*a; p*=2.01;a*=.5;
  v+=noise3D(p)*a; p*=2.02;a*=.5;
  v+=noise3D(p)*a; return v;
}
vec3 flow(vec3 p){
  float t=uTime*.055;
  vec3 f=vec3(fbm(p*.42+vec3(t,0.,0.)),fbm(p*.42+vec3(0.,t*.87,13.7)),fbm(p*.42+vec3(17.2,0.,t*.73)))*2.-1.;
  f.x+=sin(p.y*.55+uTime*.13)*.18;
  f.y+=cos(p.x*.48+uTime*.11)*.18;
  f.z+=sin(p.z*.40+uTime*.09)*.12;
  return f;
}
void main(){
  vec3 p=aHome+flow(aHome)*.22;
  p.y+=sin(uTime*.55+aPhase*6.2831853)*.06;
  p*=1.0+sin(uTime*.18)*.025;
  vec3 d=p-uMouse;
  float dist=length(d);
  vec3 dir=d/max(dist,.0001);
  float influence=1.0-smoothstep(0.0,uRadius,dist);
  influence*=influence*uMouse.z;
  p+=dir*(1.65*influence);
  vec3 tangent=normalize(cross(dir,vec3(0.,1.,0.))+vec3(.0001));
  p+=tangent*influence*.25;
  vec4 viewPosition=viewMatrix*modelMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*viewPosition;
  float depthScale=10.0/max(-viewPosition.z,.1);
  gl_PointSize=min(aSize*uPixelRatio*depthScale*(1.0+sin(uTime*.8+aPhase*6.2831853)*.12),8.0*uPixelRatio);
  vAlpha=smoothstep(0.0,.35,depthScale);
  vColor=aColor;
}`;

const fragmentShader = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 c=gl_PointCoord-.5;
  float d=length(c);
  if(d>.5) discard;
  float soft=1.0-smoothstep(.20,.50,d);
  float core=1.0-smoothstep(0.0,.23,d);
  gl_FragColor=vec4(vColor*(.85+core*.65),soft*(.55+core*.45)*vAlpha);
}`;

export function ParticleField({ count=18000, radius=7, interactionRadius=2.8, particleSize=2.1 }:{count?:number;radius?:number;interactionRadius?:number;particleSize?:number}) {
  const materialRef=useRef<THREE.ShaderMaterial|null>(null);
  const targetMouse=useRef(new THREE.Vector3());
  const currentMouse=useRef(new THREE.Vector3());

  const geometry=useMemo(()=>{
    const g=new THREE.BufferGeometry();
    const positions=new Float32Array(count*3), home=new Float32Array(count*3), colors=new Float32Array(count*3), sizes=new Float32Array(count), phases=new Float32Array(count);
    const palette=[new THREE.Color("#00AEEF"),new THREE.Color("#FF007F"),new THREE.Color("#FFE600")];
    for(let i=0;i<count;i++){
      const theta=Math.random()*Math.PI*2, phi=Math.acos(2*Math.random()-1), radial=Math.cbrt(Math.random()), j=i*3;
      const x=Math.sin(phi)*Math.cos(theta)*radius*radial, y=Math.cos(phi)*radius*.58*radial, z=Math.sin(phi)*Math.sin(theta)*radius*radial;
      positions.set([x,y,z],j); home.set([x,y,z],j);
      const c=palette[i%3]; colors.set([c.r,c.g,c.b],j);
      sizes[i]=particleSize*(.65+Math.random()*.7); phases[i]=Math.random()*Math.PI*2;
    }
    g.setAttribute("position",new THREE.BufferAttribute(positions,3));
    g.setAttribute("aHome",new THREE.BufferAttribute(home,3));
    g.setAttribute("aColor",new THREE.BufferAttribute(colors,3));
    g.setAttribute("aSize",new THREE.BufferAttribute(sizes,1));
    g.setAttribute("aPhase",new THREE.BufferAttribute(phases,1));
    return g;
  },[count,radius,particleSize]);

  const uniforms=useMemo(()=>({uTime:{value:0},uMouse:{value:new THREE.Vector3()},uRadius:{value:interactionRadius},uPixelRatio:{value:1.5}}),[interactionRadius]);

  useFrame((state,delta)=>{
    const m=materialRef.current; if(!m) return;
    const pointer=state.pointer;
    targetMouse.current.set(pointer.x*radius*.75,pointer.y*radius*.5,1);
    currentMouse.current.lerp(targetMouse.current,1-Math.exp(-10*delta));
    m.uniforms.uTime.value+=delta;
    m.uniforms.uMouse.value.copy(currentMouse.current);
  });

  useEffect(()=>()=>{geometry.dispose();materialRef.current?.dispose();},[geometry]);

  return <points geometry={geometry} frustumCulled={false}>
    <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false}/>
  </points>;
}
