
var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;


// Create a place to store vertex colors
var vertexColorBuffer;

//create model view matrix
var mvMatrix = mat4.create();
//create projection matrix
var pMatrix = mat4.create();
var rotAngle = 0;
var lastTime = 0;
var transformVec = vec3.create();    
var scaleVec = vec3.create();
vec3.set(transformVec,0.0,0.0,-2.0);
var rad = 0;
var danceIndex = 0.00;



//----------------------------------------------------------------------------------

//specify the value of a uniform variable for the current program object, here are the model-to-view matrix and perspective matrix
function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
} 


//transform a degree value to radians
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

//function to set up a GLcontext
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}



//load the DOM by an integer ID of shader inside the program
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

//load shaders from DOM in html and generate the shader program to process the vertex and the Model-to-view matrix and perspective matrix
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  //link the vertexShader with fragmentShader

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
}


//Compile and link the shaders and gets the integer IDs of uniforms inside the program
function setupBuffers() {
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  
  if(document.getElementById("dance").value == "no_dancing")
    var triangleVertices = [
          -0.5,   0.75,   0.0,
          -0.5,   0.5,    0.0,
          -0.25,  0.5,    0.0, //1
          -0.5,   0.75,   0.0,
          -0.25,  0.5,    0.0,
           0.5,   0.75,   0.0, //2
          -0.25,  0.5,    0.0,
           0.25,  0.5,    0.0,
           0.5,   0.75,   0.0, //3
           0.5,   0.75,   0.0,
           0.25,  0.5,    0.0,
           0.5,   0.5,    0.0, //4
          -0.25,  0.5,    0.0,
           0.25,  -0.5,   0.0,
           0.25,  0.5,    0.0, //5
          -0.25,  0.5,    0.0,
          -0.25, -0.5,    0.0,
           0.25, -0.5,    0.0, //6
          -0.25, -0.5,    0.0,
          -0.5,  -0.5,    0.0,
          -0.5,  -0.75,   0.0, //7
          -0.25, -0.5,    0.0,
          -0.5,  -0.75,   0.0,
           0.5,   -0.75,  0.0, //8
           0.25,  -0.5,   0.0,
           0.5,   -0.75,  0.0,
           0.5,   -0.5,   0.0, //9
           -0.25,  -0.5,   0.0,
           0.5,   -0.75,  0.0,
           0.25,   -0.5,   0.0 //10
  ];

  else {
        if (danceIndex % 2 < 0.33)
        var triangleVertices = [
              -0.5,   0.75,   0.0,
              -0.5,   0.5,    0.0,
              -0.25,  0.5,    0.0, //1
              -0.5,   0.75,   0.0,
              -0.25,  0.5,    0.0,
               0.5,   0.75,   0.0, //2
              -0.25,  0.5,    0.0,
               0.25,  0.5,    0.0,
               0.5,   0.75,   0.0, //3
               0.5,   0.75,   0.0,
               0.25,  0.5,    0.0,
               0.5,   0.5,    0.0, //4
              -0.25,  0.5,    0.0,
               0.25,  -0.5,   0.0,
               0.25,  0.5,    0.0, //5
              -0.25,  0.5,    0.0,
              -0.25, -0.5,    0.0,
               0.25, -0.5,    0.0, //6
              -0.25, -0.5,    0.0,
              -0.5,  -0.5,    0.0,
              -0.5,  -0.75,   0.0, //7
              -0.25, -0.5,    0.0,
              -0.5,  -0.75,   0.0,
               0.5,   -0.75,  0.0, //8
               0.25,  -0.5,   0.0,
               0.5,   -0.75,  0.0,
               0.5,   -0.5,   0.0, //9
               -0.25,  -0.5,   0.0,
               0.5,   -0.75,  0.0,
               0.25,   -0.5,   0.0 //10
        ];
        else if (danceIndex % 2 >= 0.33  && danceIndex %2<=0.67)
            var triangleVertices = [
                -0.6,   0.80,   0.0,
                -0.5,   0.5,    0.0,
                -0.2,  0.55,    0.0, //1
                -0.6,   0.80,   0.0,
                -0.2,  0.55,    0.0,
                 0.6,   0.8,   0.0, //2
                -0.2,  0.55,    0.0,
                 0.2,  0.55,    0.0,
                 0.6,   0.8,   0.0, //3
                 0.6,   0.8,   0.0,
                 0.2,  0.55,    0.0,
                 0.5,   0.5,    0.0, //4
                -0.2,  0.55,    0.0,
                 0.2,  -0.55,   0.0,
                 0.2,  0.55,    0.0, //5
                -0.2,  0.55,    0.0,
                -0.2, -0.55,    0.0,
                 0.2,  -0.55,   0.0, //6
                -0.2, -0.55,    0.0,
                -0.5,  -0.5,    0.0,
                -0.6,  -0.80,   0.0, //7
                -0.2, -0.55,    0.0,
                -0.6,  -0.80,   0.0,
                 0.6,   -0.80,  0.0, //8
                 0.2,  -0.55,   0.0,
                 0.6,   -0.80,  0.0,
                 0.5,   -0.5,   0.0, //9
                 -0.2, -0.55,    0.0,
                 0.6,   -0.80,  0.0,
                 0.2,  -0.55,   0.0,//10
        ];
        else 
          var triangleVertices = [
                -0.7,   0.80,   0.0,
                -0.5,   0.5,    0.0,
                -0.2,  0.55,    0.0, //1
                -0.7,   0.80,   0.0,
                -0.2,  0.55,    0.0,
                 0.7,   0.8,   0.0, //2
                -0.2,  0.55,    0.0,
                 0.2,  0.55,    0.0,
                 0.7,   0.8,   0.0, //3
                 0.7,   0.8,   0.0,
                 0.2,  0.55,    0.0,
                 0.5,   0.5,    0.0, //4
                -0.2,  0.55,    0.0,
                 0.2,  -0.55,   0.0,
                 0.2,  0.55,    0.0, //5
                -0.2,  0.55,    0.0,
                -0.2, -0.55,    0.0,
                 0.2,  -0.55,   0.0, //6
                -0.2, -0.55,    0.0,
                -0.5,  -0.5,    0.0,
                -0.7,  -0.85,   0.0, //7
                -0.2, -0.55,    0.0,
                -0.7,  -0.85,   0.0,
                 0.7,   -0.85,  0.0, //8
                 0.2,  -0.55,   0.0,
                 0.7,   -0.85,  0.0,
                 0.5,   -0.5,   0.0, //9
                 -0.2, -0.55,    0.0,
                 0.7,   -0.85,  0.0,
                 0.2,  -0.55,   0.0,//10
        ];
      }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 30;
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  if(document.getElementById("wireframe-on").checked)
  //wireframe color setting. By setting the color of each vertex, we make the wire frame visible
  var colors = [
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0,
        Math.random(),Math.random(),Math.random(), 1.0
    ];
    else  //color setting for display without visible wireframe
      var colors = [
        0.5, 0.5, 0.0, 0.5,
        0.5, 0.5, 0.8, 0.5,
        0.5, 0.5, 0.0, 0.5, //1
        0.5, 0.5, 0.0, 0.5,
        0.5, 0.5, 0.0, 0.5,
        1.0, 0.0, 0.8, 0.5, //2
        0.5, 0.5, 0.0, 0.5,
        0.7, 0.0, 0.7, 0.5,
        0.7, 0.0, 0.7, 0.5, //3
        0.7, 0.0, 0.7, 0.5,
        1.0, 0.0, 0.0, 0.5,
        0.7, 0.0, 0.7, 0.5, //4
        0.7, 0.5, 0.0, 0.5,
        0.6, 0.6, 0.6, 0.5,
        0.6, 0.0, 0.6, 0.5, //5
        0.5, 0.7, 0.0, 0.5,
        0.3, 0.2, 0.0, 0.5,
        0.4, 0.5, 0.6, 0.5, //6
        0.6, 0.1, 0.4, 0.5, 
        0.4, 0.4, 0.7, 0.5, 
        0.4, 0.4, 0.6, 0.5, //7
        0.4, 0.2, 0.6, 0.5, 
        0.6, 0.3, 0.5, 0.5,
        0.7, 0.5, 0.6, 0.5, //8
        0.8, 0.5, 0.3, 0.5,
        0.2, 0.5, 0.2, 0.5,
        0.9, 0.3, 0.0, 0.5, //9
        0.4, 0.2, 0.0, 0.5,
        0.7, 0.5, 0.9, 0.5,
        0.4, 0.5, 0.6, 0.5, //10
      ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 30;  
}

//this is the draw function which draw the new frame according to the new pMatrix and mvMatrix value to the scene per tick
function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); //setting up the viewport, x=0, y=0 and height and width equal to the canvas height and width
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

  mat4.identity(mvMatrix);
  mat4.identity(pMatrix);
      if(document.getElementById("effects").value == "circle" )
      {     
        vec3.set(transformVec,0.0,0.0,-2.0);
            vec3.set(transformVec,Math.sin(rad/10),Math.cos(rad/10),-1); //set up transformVec value
            mat4.translate(mvMatrix, mvMatrix,transformVec); //change the mvMatrix to change the vertices
           mat4.perspective(pMatrix,degToRad(140), 1 , 0.1, 100.0); //setting up perspective attributes
           mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle * 2));  //rotate regarding to the X axis by 8*rotAngle per frame
      //mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle)); //rotate regarding to the Y axis by rotAngle per frame
           mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle * 2)); //rotate regarding to the Y axis by rotAngle*4 per frame
      }
      else if(document.getElementById("effects").value == "drawing_eight")
      {     
        vec3.set(transformVec,0.0,0.0,-2.0);
          vec3.set(transformVec,Math.sin(rad/2),Math.cos(rad/10),-1); //set up transformVec value
          mat4.translate(mvMatrix, mvMatrix,transformVec); //change the mvMatrix to change the vertices
           mat4.perspective(pMatrix,degToRad(140), 1 , 0.1, 100.0); //setting up perspective attributes
           mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle * 4));  //rotate regarding to the X axis by 8*rotAngle per frame
      //mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle)); //rotate regarding to the Y axis by rotAngle per frame
           mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle * 4)); //rotate regarding to the Y axis by rotAngle*4 per frame
      }
      else if (document.getElementById("effects").value == "no_animation")
      {
          vec3.set(transformVec,0.0,0.0,-2.0);
      }
      else if (document.getElementById("effects").value == "wave")
      {
          vec3.set(transformVec,0.0,0.0,-2.0);
          vec3.set(transformVec,Math.tan(rad/10) + Math.sin(rad/5),Math.tan(rad/10) + Math.sin(rad/5),-1); //set up transformVec value
          mat4.translate(mvMatrix, mvMatrix,transformVec); //change the mvMatrix to change the vertices
          mat4.perspective(pMatrix,degToRad(140), 1 , 0.1, 100.0); //setting up perspective attributes
          //mat4.rotateX(mvMatrix, mvMatrix, degToRad(rotAngle * 8));  //rotate regarding to the X axis by 8*rotAngle per frame
          mat4.rotateZ(mvMatrix, mvMatrix, degToRad(rotAngle*2)); //rotate regarding to the Y axis by rotAngle per frame
          //mat4.rotateY(mvMatrix, mvMatrix, degToRad(rotAngle * 4)); //rotate regarding to the Y axis by rotAngle*4 per frame
      }
      //mat4.scale(mvMatrix, mvMatrix, scaleVec );
  //}
  
  //binding vertex position from vertex shader
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  //binding vertex color from fragment shader
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
}

//animation function which changes varibles per tick
function animate() {
    rad = rad + 0.1;
    var timeNow = new Date().getTime();
    danceIndex = danceIndex+0.1;
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        
        rotAngle= (rotAngle + 1) % 360;
    }+1
    lastTime = timeNow;
}

//startup the WebGL frame by create the GL context from canvas in html, reset the color and enable animation
function startup() {
  //create a WebGL context
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  //setupShaders(); 
  //setupBuffers();

  gl.clearColor(0.2, 0.339, 0.4, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

//ticking function called 60 times per second. It request the animation frame and setup shader + buffers the draw the new frame and animation effect
function tick() {
    requestAnimFrame(tick);
    setupShaders(); 
    setupBuffers();
    draw();
    animate();
}


