

// export default LandingPage;
import React, { useEffect, useRef } from 'react';
import './LandingPage.css';

const NeuroCanvas = () => {
  const canvasRef = useRef(null);
  const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
  const pointer = { x: 0, y: 0, tX: 0, tY: 0 };
  let uniforms;
  let gl;

  useEffect(() => {
    gl = initShader();
    setupEvents();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const initShader = () => {
    const canvasEl = canvasRef.current;
    const vsSource = document.getElementById("vertShader").innerHTML;
    const fsSource = document.getElementById("fragShader").innerHTML;

    gl = canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

    if (!gl) {
      alert("WebGL is not supported by your browser.");
      return null;
    }

    const createShader = (gl, sourceCode, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);

    if (!shaderProgram) return null; // Handle the case where the program fails to initialize

    // Move getUniforms definition here
    const getUniforms = (program) => {
      const uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
      }
      return uniforms;
    };

    uniforms = getUniforms(shaderProgram);

    const vertices = new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.useProgram(shaderProgram);

    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    return gl;
  };

  const createShaderProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  };

  const render = () => {
    const currentTime = performance.now();

    pointer.x += (pointer.tX - pointer.x) * 0.5;
    pointer.y += (pointer.tY - pointer.y) * 0.5;

    gl.uniform1f(uniforms.u_time, currentTime);
    gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
    gl.uniform1f(uniforms.u_scroll_progress, window.pageYOffset / (2 * window.innerHeight));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  };

  const resizeCanvas = () => {
    const canvasEl = canvasRef.current;
    canvasEl.width = window.innerWidth * devicePixelRatio;
    canvasEl.height = window.innerHeight * devicePixelRatio;
    gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
  };

  const setupEvents = () => {
    window.addEventListener("pointermove", e => updateMousePosition(e.clientX, e.clientY));
    window.addEventListener("touchmove", e => updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY));
    window.addEventListener("click", e => updateMousePosition(e.clientX, e.clientY));
  };

  const updateMousePosition = (eX, eY) => {
    pointer.tX = eX;
    pointer.tY = eY;
  };

  return (
    <div className="content">
      <div className="section">
        <div>JPMA Biweekly</div>
      </div>
      {/* <div className="section">
        <div>
          GLSL shader based on <a href="https://x.com/zozuar/" target="_blank" rel="noopener noreferrer">@zozuar</a>
          <a href="https://x.com/zozuar/status/1625182758745128981/" target="_blank" rel="noopener noreferrer">artwork</a>
        </div>
      </div> */}
      {/* <div className="section">
        <div>
          <a href="https://linkedin.com/in/ksenia-kondrashova/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://codepen.io/ksenia-k" target="_blank" rel="noopener noreferrer">CodePen</a>
          <a href="https://x.com/uuuuuulala" target="_top" rel="noopener noreferrer">X (Twitter)</a>
        </div>
      </div> */}
      <canvas ref={canvasRef} id="neuro"></canvas>

      {/* Shader scripts */}
      <script id="vertShader" type="x-shader/x-vertex">
        {`
          precision mediump float;
          varying vec2 vUv;
          attribute vec2 a_position;

          void main() {
              vUv = .5 * (a_position + 1.);
              gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `}
      </script>
      <script id="fragShader" type="x-shader/x-fragment">
        {`
          precision mediump float;
          varying vec2 vUv;
          uniform float u_time;
          uniform float u_ratio;
          uniform vec2 u_pointer_position;
          uniform float u_scroll_progress;

          vec2 rotate(vec2 uv, float th) {
              return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
          }

          float neuro_shape(vec2 uv, float t, float p) {
              vec2 sine_acc = vec2(0.);
              vec2 res = vec2(0.);
              float scale = 8.;

              for (int j = 0; j < 15; j++) {
                  uv = rotate(uv, 1.);
                  sine_acc = rotate(sine_acc, 1.);
                  vec2 layer = uv * scale + float(j) + sine_acc - t;
                  sine_acc += sin(layer);
                  res += (.5 + .5 * cos(layer)) / scale;
                  scale *= (1.2 - .07 * p);
              }
              return res.x + res.y;
          }

          void main() {
              vec2 uv = .5 * vUv;
              uv.x *= u_ratio;

              vec2 pointer = vUv - u_pointer_position;
              pointer.x *= u_ratio;
              float p = clamp(length(pointer), 0., 1.);
              p = .5 * pow(1. - p, 2.);

              float t = .001 * u_time;
              vec3 color = vec3(0.);

              float noise = neuro_shape(uv, t, p);
              noise = 1.2 * pow(noise, 3.);
              noise += pow(noise, 10.);
              noise = max(.0, noise - .5);
              noise *= (1. - length(vUv - .5));

              color = normalize(vec3(.2, .5 + .4 * cos(3. * u_scroll_progress), .5 + .5 * sin(3. * u_scroll_progress)));
              color = color * noise;

              gl_FragColor = vec4(color, noise);
          }
        `}
      </script>
    </div>
  );
};

export default NeuroCanvas;
