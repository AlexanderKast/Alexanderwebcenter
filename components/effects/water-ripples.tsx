"use client";

import { useEffect, useRef } from "react";

/**
 * Efecto de ondas de agua interactivo sobre el area del hero.
 * Reemplaza al `jquery.ripples` (ripples.js) del template Davis Portfolio 1.
 *
 * Implementacion: WebGL2 con ping-pong framebuffers.
 *  - Shader `update`: propaga las ondas (laplaciano + damping).
 *  - Shader `drop`: agrega perturbacion al mover/clickear el mouse.
 *  - Shader `render`: dibuja un overlay con highlights dorados
 *    donde la altura de onda gradiente es fuerte.
 *
 * El overlay se pone en `absolute inset-0 pointer-events-none` y no
 * bloquea los clicks del resto del hero. Los pointer events se
 * capturan a nivel del contenedor padre via window.
 */
export function WaterRipples({
  color = [0.996, 0.773, 0.267], // #fec544
  intensity = 0.55,
  resolution = 256,
  className,
}: {
  color?: [number, number, number];
  intensity?: number;
  resolution?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    // ---------- Geometria: full-screen quad ----------
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const vertSrc = `#version 300 es
      in vec2 aPos;
      out vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }`;

    const updateSrc = `#version 300 es
      precision highp float;
      in vec2 vUv;
      uniform sampler2D uState;
      uniform vec2 uTexel;
      out vec4 outColor;
      void main() {
        vec4 c = texture(uState, vUv);
        float l = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
        float r = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
        float t = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
        float b = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
        float next = (l + r + t + b) * 0.5 - c.g;
        next *= 0.992;
        outColor = vec4(next, c.r, 0.0, 1.0);
      }`;

    const dropSrc = `#version 300 es
      precision highp float;
      in vec2 vUv;
      uniform sampler2D uState;
      uniform vec2 uCenter;
      uniform float uRadius;
      uniform float uStrength;
      out vec4 outColor;
      void main() {
        vec4 c = texture(uState, vUv);
        float d = distance(vUv, uCenter);
        float drop = smoothstep(uRadius, 0.0, d) * uStrength;
        c.r += drop;
        outColor = c;
      }`;

    const renderSrc = `#version 300 es
      precision highp float;
      in vec2 vUv;
      uniform sampler2D uState;
      uniform vec2 uTexel;
      uniform vec3 uColor;
      uniform float uIntensity;
      out vec4 outColor;
      void main() {
        float hL = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
        float hR = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
        float hT = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
        float hB = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
        vec2 grad = vec2(hR - hL, hB - hT);
        float caustic = clamp(length(grad) * 12.0, 0.0, 1.0);
        float specular = clamp(grad.x * 2.5 + 0.5, 0.0, 1.0);
        float alpha = caustic * uIntensity;
        vec3 rgb = mix(uColor * 0.55, uColor, specular);
        outColor = vec4(rgb, alpha);
      }`;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(sh));
      }
      return sh;
    }
    function program(frag: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, compile(gl!.VERTEX_SHADER, vertSrc));
      gl!.attachShader(p, compile(gl!.FRAGMENT_SHADER, frag));
      gl!.linkProgram(p);
      gl!.bindAttribLocation(p, 0, "aPos");
      return p;
    }

    const progUpdate = program(updateSrc);
    const progDrop = program(dropSrc);
    const progRender = program(renderSrc);

    // ---------- Framebuffers ping-pong ----------
    const texA = gl.createTexture();
    const texB = gl.createTexture();
    for (const tex of [texA, texB]) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA16F,
        resolution,
        resolution,
        0,
        gl.RGBA,
        gl.HALF_FLOAT,
        null,
      );
    }
    const fbA = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbA);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texA,
      0,
    );
    const fbB = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbB);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texB,
      0,
    );

    let readFb = fbA;
    let writeFb = fbB;
    let readTex = texA;
    let writeTex = texB;

    function bindQuad(prog: WebGLProgram) {
      gl!.useProgram(prog);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
      gl!.enableVertexAttribArray(0);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
    }

    function swap() {
      [readFb, writeFb] = [writeFb, readFb];
      [readTex, writeTex] = [writeTex, readTex];
    }

    // ---------- Pointer events ----------
    const drops: { x: number; y: number; strength: number }[] = [];

    function addDrop(x: number, y: number, strength = 0.6) {
      drops.push({ x, y, strength });
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      addDrop(x, y, 0.35);
    };
    const onClick = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      addDrop(x, y, 1.4);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });

    // ---------- Resize ----------
    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = "100%";
      canvas!.style.height = "100%";
    }
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // ---------- Loop ----------
    const uTexel = [1 / resolution, 1 / resolution];
    let raf = 0;
    let running = true;

    function renderLoop() {
      if (!running) return;

      // 1) Apply queued drops to read texture
      if (drops.length) {
        bindQuad(progDrop);
        gl!.viewport(0, 0, resolution, resolution);
        for (const d of drops) {
          gl!.bindFramebuffer(gl!.FRAMEBUFFER, writeFb);
          gl!.activeTexture(gl!.TEXTURE0);
          gl!.bindTexture(gl!.TEXTURE_2D, readTex);
          gl!.uniform1i(gl!.getUniformLocation(progDrop, "uState"), 0);
          gl!.uniform2f(
            gl!.getUniformLocation(progDrop, "uCenter"),
            d.x,
            d.y,
          );
          gl!.uniform1f(gl!.getUniformLocation(progDrop, "uRadius"), 0.03);
          gl!.uniform1f(
            gl!.getUniformLocation(progDrop, "uStrength"),
            d.strength,
          );
          gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
          swap();
        }
        drops.length = 0;
      }

      // 2) Update (propagate waves)
      bindQuad(progUpdate);
      gl!.viewport(0, 0, resolution, resolution);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, writeFb);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, readTex);
      gl!.uniform1i(gl!.getUniformLocation(progUpdate, "uState"), 0);
      gl!.uniform2f(
        gl!.getUniformLocation(progUpdate, "uTexel"),
        uTexel[0],
        uTexel[1],
      );
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      swap();

      // 3) Render to canvas
      bindQuad(progRender);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, readTex);
      gl!.uniform1i(gl!.getUniformLocation(progRender, "uState"), 0);
      gl!.uniform2f(
        gl!.getUniformLocation(progRender, "uTexel"),
        uTexel[0],
        uTexel[1],
      );
      gl!.uniform3f(
        gl!.getUniformLocation(progRender, "uColor"),
        color[0],
        color[1],
        color[2],
      );
      gl!.uniform1f(
        gl!.getUniformLocation(progRender, "uIntensity"),
        intensity,
      );
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(renderLoop);
    }

    raf = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      ro.disconnect();
      gl.deleteProgram(progUpdate);
      gl.deleteProgram(progDrop);
      gl.deleteProgram(progRender);
      gl.deleteTexture(texA);
      gl.deleteTexture(texB);
      gl.deleteFramebuffer(fbA);
      gl.deleteFramebuffer(fbB);
      gl.deleteBuffer(quadBuffer);
    };
  }, [color, intensity, resolution]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
    />
  );
}
