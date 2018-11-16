(() => {
    // "global" class property accessor
    let gl = null

    class GlslSandbox {

        constructor(canvas, vertexShaderUrl, fragmentShaderUrl, width, height) {
            this.canvas = typeof(canvas) === 'string' ? document.querySelector(canvas) : canvas
            this.gl = this.canvas.getContext('webgl')
            this.canvas.width = width || window.innerWidth
            this.canvas.height = height || window.innerHeight
            this.frame = 0
            this.startTime = Date.now()
            this.uniforms = {}
            this.events = {
                'post-init': [],
                'pre-render': [],
                'post-render': [],
            }

            // assign dirty "global" class accessor
            gl = this.gl

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

            fetch(vertexShaderUrl).then(r => r.text()).then(vertexShader => {
                fetch(fragmentShaderUrl).then(r => r.text()).then(fragmentShader => {
                    this.compileAndRunShaders(vertexShader, fragmentShader)
                    this.bindGeometry()
                    this.registerDefaultUniforms()
                    this.fire('post-init')
                    this.render()
                })
            })
        }

        on(event, fn) {
            if (this.events[event]) {
                this.events[event].push(fn)
            } else {
                this.events[event] = [fn]
            }
        }

        fire(event, params) {
            if (this.events[event]) {
                this.events[event].forEach(fn => fn(params))
            }
        }

        compileAndRunShaders(vertexShaderSrc, fragmentShaderSrc) {
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)
            gl.shaderSource(vertexShader, vertexShaderSrc)
            gl.compileShader(vertexShader)

            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
            gl.shaderSource(fragmentShader, fragmentShaderSrc)
            gl.compileShader(fragmentShader)

            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                console.log('Vertex shader error')
                console.log(gl.getShaderInfoLog(vertexShader));
                return false
            }

            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                console.log('Fragment shader error')
                console.log(gl.getShaderInfoLog(fragmentShader));
                return false
            }

            this.program = gl.createProgram()
            gl.attachShader(this.program, vertexShader)
            gl.attachShader(this.program, fragmentShader)
            gl.linkProgram(this.program)
            gl.useProgram(this.program)
        }

        bindGeometry() {
            var buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    -1.0, -1.0,
                    1.0, -1.0,
                    -1.0,  1.0,
                    -1.0,  1.0,
                    1.0, -1.0,
                    1.0,  1.0
                ]),
                gl.STATIC_DRAW
            )

            let positionLoc = gl.getAttribLocation(this.program, 'position')
            gl.enableVertexAttribArray(positionLoc)
            gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

        }

        registerDefaultUniforms() {
            this.registerUniform('iTime', 'f', 0.0)
            this.registerUniform('iFrame', 'i', 0.0)
            this.registerUniform('iResolution', '2f', [gl.drawingBufferWidth, gl.drawingBufferHeight])
        }

        updateDefaultUniforms() {
            this.uniforms.iTime.value = (Date.now() - this.startTime) / 1000
            this.uniforms.iFrame.value = ++this.frame
        }

        registerUniform(name, type, value) {
            let glRef = gl.getUniformLocation(this.program, name)
            let uniform = new GlUniform(name, glRef, type, value)
            this.uniforms[name] = uniform

            if (uniform.needsUpdate) {
                this.updateGlUniform(uniform)
            }
        }

        updateGlUniform(uniform) {
            switch (uniform.type) {
                case 'i':
                case '1i':
                    gl.uniform1i(uniform.glRef, uniform.value)
                    break
                case 'f':
                case '1f':
                    gl.uniform1f(uniform.glRef, uniform.value)
                    break
                case '2f':
                    gl.uniform2f(uniform.glRef, uniform.value[0], uniform.value[1])
                    break
                case '3f':
                    gl.uniform3f(uniform.glRef, uniform.value[0], uniform.value[1], uniform.value[2])
                    break
                case '4f':
                    gl.uniform4f(uniform.glRef, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3])
                    break
                case '1iv':
                case 'iv':
                    gl.uniform1iv(uniform.glRef, uniform.value)
                    break
                case '2iv':
                    gl.uniform2iv(uniform.glRef, uniform.value)
                    break
                case '3iv':
                    gl.uniform3iv(uniform.glRef, uniform.value)
                    break
                case '4iv':
                    gl.uniform4iv(uniform.glRef, uniform.value)
                    break
                case 'fv':
                case '1fv':
                    gl.uniform1fv(uniform.glRef, uniform.value)
                    break
                case '2fv':
                    gl.uniform2fv(uniform.glRef, uniform.value)
                    break
                case '3fv':
                    gl.uniform3fv(uniform.glRef, uniform.value)
                    break
                case '4fv':
                    gl.uniform4fv(uniform.glRef, uniform.value)
                    break
                case 'mat2fv':
                    gl.uniformMatrix2fv(uniform.glRef, false, uniform.value)
                    break
                case 'mat3fv':
                    gl.uniformMatrix3fv(uniform.glRef, false, uniform.value)
                    break
                case 'mat4fv':
                    gl.uniformMatrix4fv(uniform.glRef, false, uniform.value)
                    break
                case 't':
                    let texture = gl.createTexture()
                    gl.bindTexture(gl.TEXTURE_2D, texture)
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value)
                    gl.generateMipmap(gl.TEXTURE_2D)
                    gl.uniform1i(uniform.glRef, 0);
                    break
            }

            uniform.needsUpdate = false
        }

        render() {
            window.requestAnimationFrame(this.render.bind(this), this.canvas)
            this.fire('pre-render')

            this.clearScreen()

            this.updateDefaultUniforms()

            for (let name in this.uniforms) {
                if (this.uniforms[name].needsUpdate) {
                    this.updateGlUniform(this.uniforms[name])
                }
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6)
            this.fire('post-render')
        }

        clearScreen() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            gl.clear(gl.COLOR_BUFFER_BIT)
        }
    }

    class GlUniform {
        constructor(name, glRef, type, value) {
            this.name = name
            this.glRef = glRef
            this.type = type
            this._value = value || null
            this.needsUpdate = this.value !== null ? true : false
        }

        get value() { return this._value }
        set value(v) {
            this._value = v
            this.needsUpdate = true
        }
    }

    window.GlslSandbox = GlslSandbox
})()

