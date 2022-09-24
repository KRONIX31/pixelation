let density = 'ABCDEFGHIJKLMNOQRSZ0123456789                       '
let symbols = 'ABCDEFGHIJKLMNOQRSZ0123456789'
let symbolsCopy = symbols
let img
let orig_height, orig_width, aspectRatio
let fps // определяется далее из localstorage
let area_k // определяется далее из localstorage
let widthX // определяется далее из localstorage
let brightn_k // определяется далее из localstorage
const fps_input = document.querySelector('.fps')
const file_input = document.querySelector('.file')
const download_wrapper = document.querySelector('.download_wrapper')
const download_input = document.querySelector('.download_name')
const file_type = document.querySelector('.file_type')
const resizeOrigX_input = document.querySelector('.resize_orig_x')
const resizeArea_input = document.querySelector('.resize_area')

const rainbow_input = document.querySelector('.rainbow_input')
const white_input = document.querySelector('.white_input')
const standart_input = document.querySelector('.standart_input')
const transparent_input = document.querySelector('.transparent_input')
const brightn_input = document.querySelector('.polzyn_input')
const monitoringFPS = document.querySelector('.monitoring_fps')
const buttonStartStop = document.querySelector('.button_start_stop')
const secretMode_wrapper = document.querySelector('.secret_mode_wrapper')


if(localStorage.fps){
    fps = parseInt(localStorage.fps, 10)
    fps_input.value = fps
} else{
    fps = 1
}
if(localStorage.width){
    widthX = localStorage.width
    resizeOrigX_input.value = widthX
} else{
    widthX = 64
}
if(localStorage.areaK){
    area_k = localStorage.areaK
    resizeArea_input.value = area_k
} else{
    area_k = resizeArea_input.value
}
if(localStorage.brightness){
    brightn_k = localStorage.brightness * 1
    brightn_input.value = brightn_k * 10
} else{
    brightn_k = 1.5
}
if(localStorage.fileType){
    file_type.options[localStorage.fileType * 1].selected = true
}
document.addEventListener('DOMContentLoaded', ()=>{
    const fileName = localStorage.fileName
    const mode = localStorage.mode
    download_input.value = fileName
    if(mode){
        if(mode == 'rainbow'){
            rainbow_input.checked = true
        } else{
            if(mode == 'white'){
                white_input.checked = true
            } else{
                standart_input.checked = true
            }
        }
    }
})


fps_input.oninput = function(){
    const fps_str = parseInt(fps_input.value, 10)
    if(fps_str && !buttonStartStop.classList.contains('start_stop_off')){
        fps = parseInt(fps_input.value, 10)
        localStorage.fps = fps
    }
}
file_input.onchange = function(e){
    const files = e.target.files[0]
    let urlOfImageFile = URL.createObjectURL(files)
    console.log(urlOfImageFile)
    img = loadImage(urlOfImageFile, (e) => {
        orig_height = img.height
        orig_width = img.width
        image(img, 0, 0)
        resizeCanvas(orig_width * area_k, orig_height * area_k)
    })
}
resizeOrigX_input.oninput = function(){
    widthX = parseInt(resizeOrigX_input.value, 10)
    if((!widthX) || widthX == 1){
        resizeOrigX_input.classList.add('input_wrong')
        return
    } else{
        resizeOrigX_input.classList.remove('input_wrong')
    }
    localStorage.width = widthX
}
resizeArea_input.oninput = function(e){
    area_k = e.target.value
    resizeCanvas(orig_width * area_k, orig_height * area_k)
    localStorage.areaK = area_k
}
brightn_input.oninput = function(e){
    brightn_k = e.target.value / 10
    localStorage.brightness = brightn_k
}
transparent_input.onchange = function(){
    if(this.checked){
        brightn_input.parentElement.classList.remove('range_polzyn_dis')
    } else{
        brightn_input.parentElement.classList.add('range_polzyn_dis')
    }
}
rainbow_input.onchange = function(){
    localStorage.mode = 'rainbow'
}
standart_input.onchange = function(){
    localStorage.mode = 'standart'
}
white_input.onchange = function(){
    localStorage.mode = 'white'
}

secretMode_wrapper.addEventListener('click', ()=>{
    if(!secretMode_wrapper.classList.contains('secret_mode_wrapper_active')){
        symbols = 'ZZZZZZ||VVVVVV'
    } else{
        symbols = symbolsCopy
    }
    secretMode_wrapper.classList.toggle('secret_mode_wrapper_active')
})


buttonStartStop.addEventListener('click', (e)=>{
    const button = e.target
    button.classList.toggle('start_stop_off')
    if(button.innerText == 'STOP'){
        button.innerText = 'START'
        fps = 0
        frameRate(fps)
        monitoringFPS.innerText = 'FPS: 0.0'
    } else{
        button.innerText = 'STOP'
        fps = fps_input.value * 1
        frameRate(fps)
    }
})
download_wrapper.addEventListener('click', ()=>{
    if(file_type.selectedIndex == 0){
        saveCanvas(download_input.value, 'png')             //png
    } else{        
        let orig_fps = fps
        if(fps == 0){
            console.log('dviueuri')
            frameRate(15)
        }
        fps = 15
        let gif = createLoop({
            framesPerSecond: 3,
            duration: 2,
            gif:{
                download: true,
                fileName: `${download_input.value}.gif`,
                render: false
            }
        })

        let funcInterval = setInterval(()=>{
            if(gif.elapsedFramesTotal >= 6){
                fps = orig_fps
                clearInterval(funcInterval)
            }
        }, 200)
    }
})

download_input.oninput = function(e){
    localStorage.fileName = e.target.value
}
file_type.onchange = function(){
    localStorage.fileType = file_type.selectedIndex
}






function preload(){
    img = loadImage('russia.png')
}

function setup(){
    orig_width = img.width
    orig_height = img.height
    aspectRatio = orig_height / orig_width
    console.log(area_k)
    let canv = createCanvas(orig_width * area_k, orig_height * area_k)
    canv.parent('canvas')
    frameRate(fps)
}

function draw(){
    if((!widthX) || widthX == 1){
        console.log(widthX)
        return widthX
    }
    img.resize(widthX, 0)
    //noLoop()
    monitoringFPS.innerHTML = 'FPS: ' + frameRate().toFixed(1)
    frameRate(fps)
    background(0)
    //image(img, 0, 0, width, height)

    let w = width / img.width;
    let h = height / img.height; 
    img.loadPixels()
    for(let i = 0; i < img.width; i++){
        for(let j = 0; j < img.height; j++){
            let pixelIndex = (i + j * img.width) * 4
            const r = img.pixels[pixelIndex + 0]
            const g = img.pixels[pixelIndex + 1]
            const b = img.pixels[pixelIndex + 2]
            //const a = img.pixels[pixelIndex + 3]
            const avg = (r + g + b) / 3
            let brightn = Math.floor(lightness(color(r,g,b))) / 100 * brightn_k
            noStroke()
            //square(i*w, j*h, w)
            if(rainbow_input.checked){
                transparent_input.checked = true
                transparent_input.style.pointerEvents = 'none'
                transparent_input.parentElement.querySelector('label').style.pointerEvents = 'none'
                transparent_input.parentElement.style.cursor = 'no-drop'
                brightn_input.parentElement.classList.remove('range_polzyn_dis')


                fill(`rgba(${Math.floor(random() * 256)}, ${Math.floor(random() * 256)}, 
                ${Math.floor(random() * 256)}, ${brightn})`)
                density = `${randomize('rainbow')}`
            } else{
                transparent_input.style.pointerEvents = 'all'
                transparent_input.parentElement.querySelector('label').style.pointerEvents = 'all'
                transparent_input.parentElement.style.cursor = 'pointer'

                if(white_input.checked){
                    if(transparent_input.checked){
                        fill(`rgba(255,255,255,${brightn})`)
                        density = `${randomize_common()}`
                    } else{
                        fill(`rgba(255,255,255,1)`)
                        density = `${randomize()}`
                    }

                } else{
                    if(standart_input.checked){
                        if(transparent_input.checked){
                            fill(`rgba(${r},${g},${b},${brightn})`)
                            density = `${randomize_common()}`
                        } else{
                            fill(r,g,b)
                            density = `${randomize_common()}`
                        }
                    }
                }
            }
            //fill(`rgba(${Math.floor(random() * 256)}, ${Math.floor(random() * 256)}, 
            //${Math.floor(random() * 256)}, ${Math.floor(lightness(color(r,g,b))) / 100 * 1.6})`)

            const charIndex = floor(map(avg, 0, 255, density.length - 1, 0))
            textSize(w)
            textAlign(CENTER, CENTER)
            text(density[charIndex], i * w + w * 0.5, j * h + h * 0.5)
        }
    }
}

function randomize(what){
    let result, symbolsLength
    if(what == 'rainbow'){
        result = '________'
        symbolsLength = symbols.length;
        for (let i = 0; i < symbolsLength; i++ ) {
            result += symbols.charAt(Math.floor(Math.random() * symbolsLength)) 
        }
        return result + '                ';
    } else{
        result = '____________________________'
        symbolsLength = symbols.length;
        for (let i = 0; i < symbolsLength; i++ ) {
            result += symbols.charAt(Math.floor(Math.random() * symbolsLength)) 
        }
        return result + '                             ';
    }
}
function randomize_common(){
    let result = ''
    let symbolsLength = symbols.length;
    for (let i = 0; i < symbolsLength; i++ ) {
        result += symbols.charAt(Math.floor(Math.random() * symbolsLength)) 
   }
   return result + '';
}