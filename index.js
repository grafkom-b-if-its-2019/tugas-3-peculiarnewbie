(function() {

  glUtils.SL.init({ callback: function() { main(); } });

  var canvas = document.getElementById("glcanvas");
  var gl = glUtils.checkWebGL(canvas);
  var gl2 = glUtils.checkWebGL(canvas);
  var program; 
  var program2;
  var programC;

  function main() {
  
    // Inisialisasi shaders dan program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    var vertexShader2 = glUtils.getShader(gl2, gl2.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex);
    var fragmentShader2 = glUtils.getShader(gl2, gl2.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

    var vertexShaderC = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v3.vertex);
    var fragmentShaderC = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v3.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    program2 = glUtils.createProgram(gl, vertexShader2, fragmentShader2);
    programC = glUtils.createProgram(gl, vertexShaderC, fragmentShaderC);
    render();
  }
  
    

    function render(){
    
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl2.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      var n = DrawTriangles();
      if (n < 0) {
          console.log("failed to init gl buffer");
          return;
      }
      gl.drawArrays(gl.TRIANGLES, 0, 18);

      gl.useProgram(program2);
      var n = DrawLines();
      if (n < 0) {
          console.log("failed to init gl buffer");
          return;
      }
      gl.drawArrays(gl.LINE_LOOP, 0, 8);

      gl.useProgram(programC);
      var n = DrawCube();
      if (n < 0) {
          console.log("failed to init gl buffer");
          return;
      }
      gl.drawArrays(gl.LINE_LOOP, 0, 24);

      requestAnimationFrame(render); 
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  
    var thetaT = [30,60,0];
    var scale = [1,1,0]
    var size = 0.2
    var vec = [0,0,0]
    var dX = 0.0098;
    var dY = -0.0089;
    var dZ = 0.0042;
    var pseudoRotation = 1;
    var squishX = 1;
    var AnimKeyFrame = 0;
    var Frame = 0;
    var NRP = 0.0089; // <- NRP


    function DrawTriangles() {

      var thetaLoc = gl.getUniformLocation(program, 'theta');
      
      var scaleLoc = gl.getUniformLocation(program, 'size');
      
      var dLoc = gl.getUniformLocation(program, 'vec');
      
      

      // Definisi verteks dan buffer
      var triangleVertices = [
        // x, y       r, g, b
        

        0.15, 0.5,    1.0, 1.0, 0.0,
        0.17, 0.4,   1.0, 1.0, 0.0,
        -0.17, 0.4,   1.0, 1.0, 0.0,

        0.15, 0.5,    1.0, 1.0, 0.0,
        -0.15, 0.5,   1.0, 1.0, 0.0,
        -0.17, 0.4,   1.0, 1.0, 0.0,

        0.07, 0.8,     1.0, 1.0, 0.0,
        0.07, 0.77,    1.0, 1.0, 0.0,
        -0.07, 0.77,   1.0, 1.0, 0.0,

        0.07, 0.8,     1.0, 1.0, 0.0,
        -0.07, 0.8,    1.0, 1.0, 0.0,
        -0.07, 0.77,   1.0, 1.0, 0.0,

        -0.025, 1.0,     0.5, 1.0, 0.0,
        -0.3, -0.0,   0.5, 1.0, 0.5,
        -0.2, -0.0,   0.0, 1.0, 0.5,

        0.025, 1.0,    1.0, 0.0, 0.5,
        0.2, -0.0,   1.0, 0.5, 0.5,
        0.3, -0.0,   1.0, 0.5, 0.0,
      ];

      var triangleVertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

      var vPosition = gl.getAttribLocation(program, 'vPosition');
      var vColor = gl.getAttribLocation(program, 'vColor');
      gl.vertexAttribPointer(
        vPosition,  // variabel yang memegang posisi attribute di shader
        2,          // jumlah elemen per attribute
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks 
        0                                   // offset dari posisi elemen di array
      );
      gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 
        5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vColor);

      Frame += 1;
      // Bersihkan layar jadi hitam
      
      
       thetaT[3] += Math.PI * NRP / 2; 
      
      scale[1] = (Math.sin(thetaT[3]*6))/2+0.75;

      squishX = -(Math.sin(thetaT[3]*6))/4*3+1;
      
      scale[0] = squishX;

      if (scale[0] >= 1) membesar = -1;
      else if (scale[0] <= -1) membesar = 1;
      pseudoRotation = Math.sin(thetaT[3]*12+1.2) ;

      // dX += 0.01;
      // if(dX>1.5) dX = -2.0;
      if(scale[1]>=0.77){
        dY = Math.abs(Math.sin(thetaT[3]*6))/2-0.7;
        scale[0] = pseudoRotation;
      }

      
      if(vec[0] > 0.5*(1-size) || vec[0] < -0.5*(1-size) ){
        dX = dX * -1;
      }
      vec[0] += dX;

      if(vec[1] > 0.5*(1-size) || vec[1] < -0.5*(1-size) ){
        dY = dY * -1;
      }
      vec[1] += dY;

      if(vec[2] > 0.5*(1-size) || vec[2] < -0.5*(1-size) ){
        dZ = dZ * -1;
      }
      vec[2] += dZ;
      // if (Frame == 5){
      //   AnimKeyFrame = 1;
      // }
      // if (Frame == 55){
      //   AnimKeyFrame = 2;
      // }
      // if (Frame >= 63){
      //   AnimKeyFrame = 0;
      //   Frame = 1;
      // }

      // console.log(Frame);
      // console.log(theta);

      //gl.uniform1f(thetaLoc, theta);

      gl.uniform3fv(scaleLoc, scale);

      gl.uniform3fv(dLoc, vec);

      // Bersihkan buffernya canvas
      
      
    }

    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    var thetaT2 = [30,60,0];
    var size2 = 0.2
    var scale2 = [1,1,0]
    var vec2 = [0,0,0]
    var dX2 = 0.0098;
    var dY2 = -0.0089;
    var dZ2 = 0.0042;
    var pseudoRotation = 1;
    var squishX = 1;


    function DrawLines() {

      

      var thetaLoc2 = gl.getUniformLocation(program, 'theta');
      
      var scaleLoc2 = gl.getUniformLocation(program, 'size');
      
      var dLoc2 = gl.getUniformLocation(program, 'vec');
      
      

      // Definisi verteks dan buffer
      var lineVertices = [
        // x, y       r, g, b
        0.05, +0.5,   1.0, 0.0, 0.0,
        -0.05, +0.5,   1.0, 0.0, 0.0,
        -0.3, -0.5,  1.0, 0.0, 0.0,
        -0.2, -0.5,  1.0, 0.0, 0.0,
        -0.17, -0.4,  1.0, 0.0, 0.0,  
        0.17, -0.4,  1.0, 0.0, 0.0,
        0.2, -0.5,  1.0, 0.0, 0.0,
        0.30, -0.5,  1.0, 0.0, 0.0,
      ];

      var triangleVertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);

      var vPosition = gl.getAttribLocation(program, 'vPosition');
      var vColor = gl.getAttribLocation(program, 'vColor');
      gl.vertexAttribPointer(
        vPosition,  // variabel yang memegang posisi attribute di shader
        2,          // jumlah elemen per attribute
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks 
        0                                   // offset dari posisi elemen di array
      );
      gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 
        5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

        thetaT2 += NRP;
        dY2 = Math.abs(Math.sin(thetaT2*6))/2-0.1;

        //Hit the Wall

      if(vec2[0] > 0.5*(1-size2) || vec2[0] < -0.5*(1-size2) ){
        dX2 = dX2 * -1;
      }
      vec2[0] += dX2;

      if(vec2[1] > 0.5*(1-size2) || vec2[1] < -0.5*(1-size2) ){
        dY2 = dY2 * -1;
      }
      vec2[1] += dY2;

      if(vec2[2] > 0.5*(1-size2) || vec2[2] < -0.5*(1-size2) ){
        dZ2 = dZ2 * -1;
      }
      vec2[2] += dZ2;


      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vColor);





      gl.uniform3fv(thetaLoc2, thetaT2);

      gl.uniform3fv(scaleLoc2, scale2);

      gl.uniform3fv(dLoc2, vec2);

      

      // Bersihkan buffernya canvas
      
      
    }

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    

    function DrawCube(){

      var thetaLocCube = gl.getUniformLocation(programC, 'theta');
      var thetaCube = [30, 60, 0];
      

      var cubeVertices = [
        // x, y, z             r, g, b

        //ABCD
        -0.5, -0.5, 0.5,    1.0, 0.0, 0.0,    //A
        -0.5, 0.5, 0.5,     1.0, 0.0, 0.0,    //B
        -0.5, 0.5, 0.5,     1.0, 0.0, 0.0,    //B
        0.5, 0.5, 0.5,      1.0, 0.0, 0.0,    //C
        0.5, 0.5, 0.5,      1.0, 0.0, 0.0,    //C
        0.5, -0.5, 0.5,     1.0, 0.0, 0.0,    //D
        0.5, -0.5, 0.5,     1.0, 0.0, 0.0,    //D
        -0.5, -0.5, 0.5,    1.0, 0.0, 0.0,    //A
        
        //DCGH
        0.5, 0.5, 0.5,      1.0, 0.0, 1.0,    //C
        0.5, 0.5, -0.5,     1.0, 0.0, 1.0,    //G
        0.5, -0.5, 0.5,     1.0, 0.0, 1.0,    //D
        0.5, -0.5, -0.5,    1.0, 0.0, 1.0,    //H

        //ABFE
        -0.5, -0.5, 0.5,    1.0, 1.0, 0.0,    //A
        -0.5, -0.5, -0.5,   1.0, 1.0, 0.0,    //E
        -0.5, 0.5, 0.5,     1.0, 1.0, 0.0,    //B
        -0.5, 0.5, -0.5,    1.0, 1.0, 0.0,    //F

        //EFGH
        -0.5, -0.5, -0.5,   0.0, 1.0, 1.0,    //E
        -0.5, 0.5, -0.5,    0.0, 1.0, 1.0,    //F
        -0.5, 0.5, -0.5,    0.0, 1.0, 1.0,    //F
        0.5, 0.5, -0.5,     0.0, 1.0, 1.0,    //G
        0.5, 0.5, -0.5,     0.0, 1.0, 1.0,    //G
        0.5, -0.5, -0.5,    0.0, 1.0, 1.0,    //H
        0.5, -0.5, -0.5,    0.0, 1.0, 1.0,    //H
        -0.5, -0.5, -0.5,   0.0, 1.0, 1.0,    //E

      ];

      var cubeVertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

      var vPosition = gl.getAttribLocation(programC, 'vPosition');
      var vColor = gl.getAttribLocation(programC, 'vColor');

      gl.vertexAttribPointer(
        vPosition,  // variabel yang memegang posisi attribute di shader
        3,          // jumlah elemen per attribute
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks 
        0                                   // offset dari posisi elemen di array
      );

      gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(vPosition);
      gl.enableVertexAttribArray(vColor);

      gl.uniform3fv(thetaLocCube, thetaCube);

    }
    
    

})();
