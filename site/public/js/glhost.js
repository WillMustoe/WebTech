function GLHost(gl) {
    this.gl = gl;
    this.program = new Program(gl, '../webgl/id.vert', '../webgl/perlin.frag');
    this.background = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.background);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
         1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
        -1.0, -1.0
    ]), gl.STATIC_DRAW);
    this.program.attrib('position', this.background, 2);
};

GLHost.prototype.depth = 100;
GLHost.prototype.scale = 30;
GLHost.prototype.seed = Math.random() *100;
GLHost.prototype.r = 0.83;
GLHost.prototype.g = 0.83;
GLHost.prototype.b = 0.83;
GLHost.prototype.r_bg = 0.02;
GLHost.prototype.g_bg = 0.83;
GLHost.prototype.b_bg = 0.23;

GLHost.prototype.render = function() {
    this.gl.clearColor(0.99, 0.99, 0.99, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.program.use()
        .uniform('scale', this.scale)
        .uniform('depth', this.depth)
        .uniform('seed', this.seed)
        .uniform('r', this.r)
        .uniform('g', this.g)
        .uniform('b', this.b)
        .uniform('r_bg', this.r_bg)
        .uniform('g_bg', this.g_bg)
        .uniform('b_bg', this.b_bg)
        .draw(this.gl.TRIANGLE_STRIP, 4);
};